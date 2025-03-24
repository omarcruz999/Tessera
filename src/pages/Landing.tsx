import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

const Landing: React.FC = () => {
  const userContext = useContext(UserContext);

  const handleGoogleSignIn = () => {
    // Call your Google SSO function from UserContext
    userContext?.signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Column - Text Content */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#424242] leading-tight mb-4">
              Real updates from real people.
            </h1>
            <p className="text-xl text-[#666666] mb-8 max-w-lg">
              Chronological, intentional, and real. Tessera helps you stay in touch with people you actually care about.
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="bg-[#E7A691] hover:bg-[#D8957F] text-white text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              Sign in with Google
            </button>
          </div>
          
          {/* Right Column - Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/hero-image.png" 
                alt="People connecting through Tessera" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.style.minHeight = '400px';
                  (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#F0D6CC';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section - Optional */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#FAE8E0] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#E7A691]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#424242] mb-3">Real Connections</h3>
            <p className="text-[#666666]">Focus on building meaningful relationships without algorithm interference.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#FAE8E0] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#E7A691]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#424242] mb-3">Chronological Feed</h3>
            <p className="text-[#666666]">See updates as they happen, in the order they happen, without manipulation.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#FAE8E0] rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#E7A691]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#424242] mb-3">Privacy-Focused</h3>
            <p className="text-[#666666]">Your data stays yours. We never sell your information or manipulate what you see.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#FDF7F4] py-8">
        <div className="container mx-auto px-4 text-center text-[#666666]">
          <p>© 2025 Tessera. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;