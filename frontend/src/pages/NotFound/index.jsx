import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <svg 
              className="h-48 w-auto mx-auto text-purple-500" 
              viewBox="0 0 133 133" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M66.5 11.083c30.6 0 55.416 24.817 55.416 55.417 0 30.6-24.816 55.417-55.416 55.417-30.6 0-55.417-24.817-55.417-55.417 0-30.6 24.817-55.417 55.417-55.417z" 
                stroke="currentColor" 
                strokeWidth="5"
              />
              <path 
                d="M66.5 122.833c30.6 0 55.416-24.816 55.416-55.416 0-30.6-24.816-55.417-55.416-55.417-30.6 0-55.417 24.817-55.417 55.417 0 30.6 24.817 55.416 55.417 55.416z" 
                stroke="currentColor" 
                strokeWidth="5"
              />
              <path 
                d="M41.683 49.875h8.834l-11.042 33.125h-8.833l11.041-33.125z" 
                fill="currentColor"
              />
              <path 
                d="M59.125 49.875h8.833l-11.041 33.125h-8.834l11.042-33.125z" 
                fill="currentColor"
              />
              <path 
                d="M78.833 49.875h8.834l-11.042 33.125h-8.833l11.041-33.125z" 
                fill="currentColor"
              />
              <path 
                d="M96.275 49.875h8.833l-11.041 33.125h-8.834l11.042-33.125z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          {/* 404 Message */}
          <h1 className="text-5xl font-bold mb-4 text-purple-400">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved to another dimension.
          </p>
          
          {/* Helpful suggestions */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-medium mb-3 text-gray-200">You might want to try:</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500 text-white text-xs mr-2 mt-0.5">→</span>
                Checking the URL for typos
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500 text-white text-xs mr-2 mt-0.5">→</span>
                Returning to the dashboard
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500 text-white text-xs mr-2 mt-0.5">→</span>
                Creating a new book
              </li>
            </ul>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Back to Dashboard
            </Link>
            <Link 
              to="/books/new" 
              className="px-6 py-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
            >
              Create New Book
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PageNotFound;