import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Linkedin, Brain } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              InvestMinD
            </span>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base max-w-md">
            AI-powered investment analytics.<br />
            Make smarter decisions with data-driven insights.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-6 mb-6 sm:mb-8">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/SumanKumar5" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/suman-kumar-sol/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          {/* Navigation Links */}
          <nav className="mb-6 sm:mb-8">
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <li>
                <a 
                  href="https://github.com/SumanKumar5/InvestMinD" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Documentation
                </a>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms-of-service')}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </nav>
          
          {/* Copyright */}
          <div className="text-gray-500 text-xs sm:text-sm">
            <p>© 2025 InvestMinD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;