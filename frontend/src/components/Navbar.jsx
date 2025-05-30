import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, BookOpen, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.jpg";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Toggle mobile drawer
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Open the login modal
  const handleLoginClick = () => {
    setModalVisible(true);
  };

  // Open the sign-up modal
  const handleSignUpClick = () => {
    setSignupModalVisible(true);
  };

  // Close the modals
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseSignUpModal = () => {
    setSignupModalVisible(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Smooth scroll to sections (only for home page)
  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      const navbar = document.getElementById("navbar");
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      const sectionRect = section.getBoundingClientRect();
      window.scrollTo({
        top: sectionRect.top + window.scrollY - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  // User dropdown menu
  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <span className="text-gray-100 hidden md:block">{user?.name || 'User'}</span>
      </button>

      {userDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-gray-100 font-medium">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              to="/dashboard"
              onClick={() => setUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <BookOpen size={16} className="mr-2" />
              Dashboard
            </Link>
            
            <Link
              to="/profile"
              onClick={() => setUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <User size={16} className="mr-2" />
              Profile
            </Link>
            
            <Link
              to="/settings"
              onClick={() => setUserDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link>
            
            <hr className="my-2 border-gray-700" />
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Navbar */}
      <nav
        id="navbar"
        className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-gray-900/80"
      >
        <div className="container px-4 mx-auto relative text-sm">
          <div className="flex justify-between items-center">
            {/* Logo and Brand Name */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center flex-shrink-0">
              <img className="h-11 w-11 mr-2 rounded-2xl" src={logo} alt="Logo" />
              <span className="text-xl tracking-tight">
                Tale
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-800 text-transparent bg-clip-text">
                  Flect.AI
                </span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex ml-14 space-x-12 text-[18px] text-neutral-400">
              {isAuthenticated ? (
                // Authenticated navigation
                <>
                  <li>
                    <Link to="/dashboard" className="hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="hover:text-white transition-colors">
                      My Books
                    </Link>
                  </li>
                  <li>
                    <Link to="/new-project" className="hover:text-white transition-colors">
                      Create
                    </Link>
                  </li>
                </>
              ) : (
                // Public navigation
                <>
                  <li>
                    <button
                      className="hover:text-white transition-colors"
                      onClick={() => scrollToSection("heroSection")}
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-white transition-colors"
                      onClick={() => scrollToSection("featureSection")}
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-white transition-colors"
                      onClick={() => scrollToSection("pricingSection")}
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-white transition-colors"
                      onClick={() => scrollToSection("footer")}
                    >
                      Contact
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden lg:flex justify-center space-x-4 items-center">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="py-2 px-4 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-900 py-2 px-4 rounded-md border border-neutral-400 hover:from-yellow-600 hover:to-yellow-800 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar} className="text-gray-300 hover:text-white">
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 top-0 z-40 w-full h-full bg-gray-900/95 backdrop-blur-lg p-12 flex flex-col justify-center items-center lg:hidden">
            {/* Close button */}
            <button 
              onClick={toggleNavbar}
              className="absolute top-6 right-6 text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Mobile Navigation */}
            <ul className="space-y-6 text-center">
              {isAuthenticated ? (
                // Authenticated mobile navigation
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      onClick={toggleNavbar}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/projects" 
                      onClick={toggleNavbar}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      My Books
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/new-project" 
                      onClick={toggleNavbar}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      onClick={toggleNavbar}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                // Public mobile navigation
                <>
                  <li>
                    <button 
                      onClick={() => {
                        scrollToSection("heroSection");
                        toggleNavbar();
                      }}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        scrollToSection("featureSection");
                        toggleNavbar();
                      }}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        scrollToSection("pricingSection");
                        toggleNavbar();
                      }}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        scrollToSection("footer");
                        toggleNavbar();
                      }}
                      className="text-xl text-gray-300 hover:text-white transition-colors"
                    >
                      Contact
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Auth Buttons */}
            <div className="mt-8 space-y-4">
              {isAuthenticated ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-100 font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleNavbar();
                    }}
                    className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 w-full">
                  <button 
                    onClick={() => {
                      handleLoginClick();
                      toggleNavbar();
                    }} 
                    className="py-3 px-6 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      handleSignUpClick();
                      toggleNavbar();
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-900 py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close user dropdown */}
      {userDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setUserDropdownOpen(false)}
        />
      )}

      {/* Modals */}
      {!isAuthenticated && (
        <>
          <LoginModal modalVisible={modalVisible} onCloseModal={handleCloseModal} />
          <SignUpModal modalVisible={signupModalVisible} onCloseModal={handleCloseSignUpModal} />
        </>
      )}
    </>
  );
};

export default Navbar;