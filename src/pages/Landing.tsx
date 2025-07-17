import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/demo'); // Navigate to demo instead of login
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4] flex items-center justify-center">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#424242] leading-tight mb-6">
          Real updates from real people.
        </h1>
        <p className="text-xl text-[#666666] mb-6 mx-auto">
          Chronological, intentional, and real. Tessera helps you stay in touch with people you actually care about.
        </p>
        
        <div className="bg-[#FDF7F4] border border-[#E7A691] rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <p className="text-[#666666] text-sm leading-relaxed">
            <strong>Demo Notice:</strong> This is a streamlined demonstration version of our original Tessera application. 
            To avoid ongoing maintenance costs, we've created this lightweight demo that showcases the core features 
            without requiring external services or databases.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="bg-[#E7A691] hover:bg-[#D8957F] text-white text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300"
            onClick={handleLogin}
          >
            Try Demo
          </button>
          <a 
            href="https://github.com/Bytemare-CPP/tessera"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent hover:bg-[#FAE8E0] text-[#424242] border-2 border-[#997C70] text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 no-underline"
          >
            View Original Source
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;