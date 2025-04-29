import os
from fastapi import FastAPI, UploadFile, HTTPException
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


@app.post("/process-selfie")
async def process_selfie(selfie: UploadFile, user_id: str):
    """Process a selfie and find potential matches."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase is not configured.")

    try:
        # Load and process the selfie
        img = Image.open(BytesIO(await selfie.read())).convert("RGB")
        inputs = processor(images=img, return_tensors="pt", padding=True)

        # Generate embedding
        with torch.no_grad():
            embedding = model.get_image_features(**inputs).squeeze()
        embedding /= embedding.norm()

        # Store embedding in Supabase
        embedding_list = embedding.tolist()
        created_at = datetime.utcnow().isoformat()
        response = supabase.table("selfie_candidates").insert({
            "user_id": user_id,
            "embedding": embedding_list,
            "created_at": created_at,
            "status": "pending"
        }).execute()

        if response.error:
            raise HTTPException(status_code=500, detail=f"Error storing selfie: {response.error.message}")

        # Find matches
        five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat()
        candidates = supabase.table("selfie_candidates").select("*").filter(
            "created_at", "gte", five_minutes_ago
        ).filter("status", "eq", "pending").execute()

        if candidates.error:
            raise HTTPException(status_code=500, detail=f"Error fetching candidates: {candidates.error.message}")

        # Compare embeddings
        matches = []
        for candidate in candidates.data:
            candidate_embedding = torch.tensor(candidate["embedding"])
            similarity = torch.dot(embedding, candidate_embedding).item()
            if similarity >= 0.9:
                matches.append({"user_id": candidate["user_id"], "similarity": similarity})

        # Update statuses if matches are found
        if matches:
            supabase.table("selfie_candidates").update({"status": "matched"}).filter(
                "user_id", "in", [user_id] + [match["user_id"] for match in matches]
            ).execute()

        return {"matches": matches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing selfie: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)