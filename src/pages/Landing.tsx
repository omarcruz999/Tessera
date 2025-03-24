// src/pages/LandingPage.tsx
import React from 'react';
// import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#424242] mb-6">
          Welcome to Tessera
        </h1>
        <p className="text-xl md:text-2xl text-[#424242] mb-8">
          Connect with your peers, join groups, and collaborate on projects.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-[#E7A691] hover:bg-[#D8957F] text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
          <button 
            className="bg-white hover:bg-gray-100 text-[#E7A691] font-bold py-3 px-6 rounded-lg text-lg border-2 border-[#E7A691] transition-colors"
            onClick={() => window.location.href = '/register'}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;