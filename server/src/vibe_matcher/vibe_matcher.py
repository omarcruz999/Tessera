import os
import logging
from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
from supabase import create_client, Client
from dotenv import load_dotenv
from io import BytesIO
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
PORT = int(os.getenv("PORT", 8000))

# Initialize Supabase client
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
else:
    print("⚠️ Supabase credentials are missing. Running in standalone mode.")

# Load CLIP model and processor
try:
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    print("✅ CLIP model loaded successfully.")
except Exception as e:
    print(f"❌ Failed to load CLIP model: {e}")
    raise e


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/compare")
async def compare_images(image1: UploadFile, image2: UploadFile, threshold: float = 0.9):
    """Compare two images and return similarity score."""
    try:
        # Load images
        img1 = Image.open(BytesIO(await image1.read())).convert("RGB")
        img2 = Image.open(BytesIO(await image2.read())).convert("RGB")

        # Process images
        inputs1 = processor(images=img1, return_tensors="pt", padding=True)
        inputs2 = processor(images=img2, return_tensors="pt", padding=True)

        # Generate embeddings
        with torch.no_grad():
            embedding1 = model.get_image_features(**inputs1).squeeze()
            embedding2 = model.get_image_features(**inputs2).squeeze()

        # Normalize embeddings
        embedding1 /= embedding1.norm()
        embedding2 /= embedding2.norm()

        # Compute cosine similarity
        similarity = torch.dot(embedding1, embedding2).item()

        # Check threshold
        match_found = similarity >= threshold
        return {"similarity": similarity, "match_found": match_found}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing images: {e}")


# Add this helper function before the process_selfie endpoint
def load_image_from_bytes(image_bytes):
    """Convert bytes to PIL Image."""
    return Image.open(BytesIO(image_bytes)).convert("RGB")


# Also add this helper function for embeddings
def get_embedding(image, processor, model):
    """Generate embedding from image using CLIP model."""
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embedding = model.get_image_features(**inputs).squeeze()
    return embedding


# And add this for cosine similarity
def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors."""
    vec1 = vec1 / vec1.norm()
    vec2 = vec2 / vec2.norm()
    return torch.dot(vec1, vec2).item()


@app.post("/process-selfie")
async def process_selfie(
    selfie: UploadFile = File(...),
    user_id: str = Form(...),
    latitude: Optional[float] = Form(None),  # Make latitude optional
    longitude: Optional[float] = Form(None)  # Make longitude optional
):
    """Process a selfie and find potential matches."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase is not configured.")

    try:
        # Load and process the selfie
        selfie_bytes = await selfie.read()
        img = load_image_from_bytes(selfie_bytes)
        
        # Generate embedding
        embedding = get_embedding(img, processor, model)
        
        # Convert to list for storage
        embedding_list = embedding.cpu().numpy().tolist()
        
        # Store the embedding in Supabase
        selfie_data = {
            "user_id": user_id,
            "embedding": embedding_list,  # Changed from "features" to "embedding"
            "status": "pending"
        }
        
        # Add location data if provided
        if latitude is not None:
            selfie_data["latitude"] = float(latitude)
        if longitude is not None:
            selfie_data["longitude"] = float(longitude)
        
        logging.info(f"Storing selfie data for user {user_id} with optional location data")
        
        # Insert the selfie data
        result = supabase.table("selfie_candidates").insert(selfie_data).execute()
        
        # Find potential matches
        five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat()
        
        # Query recent selfie candidates from other users
        response = supabase.table("selfie_candidates") \
            .select("id,user_id,embedding") \
            .neq("user_id", user_id) \
            .eq("status", "pending") \
            .gt("created_at", five_minutes_ago) \
            .execute()
            
        candidates = response.data
        best_match = None
        best_score = 0.9  # Minimum threshold
        
        logging.info(f"Found {len(candidates)} potential matches to compare against")
        
        # Compare with other recent selfies
        for candidate in candidates:
            candidate_embedding = torch.tensor(candidate["embedding"])  # Changed from "features" to "embedding"
            similarity = cosine_similarity(embedding, candidate_embedding)
            
            logging.info(f"Comparing with user {candidate['user_id']}, similarity: {similarity}")
            
            if similarity > best_score:
                best_score = similarity
                best_match = candidate
        
        # If we found a match
        if best_match:
            logging.info(f"Match found with user {best_match['user_id']}, score: {best_score}")
            
            # Update the status of both selfies
            supabase.table("selfie_candidates").update({"status": "matched"}) \
                .eq("user_id", user_id) \
                .execute()
            
            supabase.table("selfie_candidates").update({"status": "matched"}) \
                .eq("user_id", best_match["user_id"]) \
                .execute()
            
            # Return match info with fields that match your Node.js expectations
            return {
                "match_found": True,
                "matched_user_id": best_match["user_id"],
                "similarity_score": float(best_score)
            }
        
        # No match found
        logging.info(f"No match found for user {user_id}")
        return {
            "match_found": False,
            "user_id": user_id,
            "message": "Selfie processed and stored. No matches found."
        }
    except Exception as e:
        logging.error(f"Error processing selfie: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing selfie: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)