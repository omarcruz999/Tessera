import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OmarCruzGif: React.FC = () => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGif = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://random.dog/woof.json');
      const url: string = response.data.url;
      // Check if the URL ends with an image extension
      if (!/\.(jpg|jpeg|png|gif)$/i.test(url)) {
        // If not an image, recursively call fetchGif until an image URL is returned
        fetchGif();
      } else {
        setGifUrl(url);
      }
    } catch (error) {
      console.error('Error fetching the GIF:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGif();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading GIF...</p>
      ) : gifUrl ? (
        <img src={gifUrl} alt="Random Dog" style={{ maxWidth: '100%' }} />
      ) : (
        <p>No GIF to display</p>
      )}
      <button onClick={fetchGif}>Get New Dog Picture</button>
    </div>
  );
};

export default OmarCruzGif;
