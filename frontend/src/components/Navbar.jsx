import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal"; // Import the SignUpModal

const Navbar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false); // Track SignUp modal visibility
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  // Smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar.getBoundingClientRect().height;
    const sectionRect = section.getBoundingClientRect();
    window.scrollTo({
      top: sectionRect.top + window.scrollY - navbarHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav
        id="navbar"
        className="sticky top-0 z-3 py-3 backdrop-blur-lg border-b border-neutral-700/80"
      >
        <div className="container px-4 mx-auto relative text-sm">
          <div className="flex justify-between items-center">
            {/* Logo and Brand Name */}
            <div className="flex items-center flex-shrink-0">
              <img className="h-11 w-11 mr-2 rounded-2xl" src={logo} alt="Logo" />
              <span className="text-xl tracking-tight">
                Tale
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-800 text-transparent bg-clip-text">
                  Flect.AI
                </span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex ml-14 space-x-12 text-[18px] text-neutral-400">
              <li>
                <button
                  className="hover:text-white"
                  onClick={() => scrollToSection("heroSection")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className="hover:text-white"
                  onClick={() => scrollToSection("featureSection")}
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  className="hover:text-white"
                  onClick={() => scrollToSection("pricingSection")}
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  className="hover:text-white"
                  onClick={() => scrollToSection("footer")}
                >
                  Contact
                </button>
              </li>
            </ul>

            {/* Buttons (Login and Sign Up) */}
            <div className="hidden lg:flex justify-center space-x-12 items-center">
              <button
                onClick={handleLoginClick}
                className="py-2 px-3 border rounded-md"
              >
                LogIn
              </button>
              <button
                onClick={handleSignUpClick} // Open Sign Up modal
                className="bg-gradient-to-r from-yellow-500 to-yellow-900 py-2 px-3 rounded-md border border-neutral-400"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar}>
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-2 w-full bg-neutral-900 p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              <li className="py-2">
                <button onClick={() => scrollToSection("heroSection")}>Home</button>
              </li>
              <li className="py-2">
                <button onClick={() => scrollToSection("featureSection")}>Features</button>
              </li>
              <li className="py-2">
                <button onClick={() => scrollToSection("pricingSection")}>Pricing</button>
              </li>
              <li className="py-2">
                <button onClick={() => scrollToSection("footer")}>Contact</button>
              </li>
            </ul>
            <div className="flex justify-center space-x-6 items-center py-4">
              <button onClick={handleLoginClick} className="py-2 px-3 border rounded-md">
                LogIn
              </button>
              <button
                onClick={handleSignUpClick}
                className="bg-gradient-to-r from-yellow-500 to-yellow-900 py-2 px-3 rounded-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal modalVisible={modalVisible} onCloseModal={handleCloseModal} />
      <SignUpModal modalVisible={signupModalVisible} onCloseModal={handleCloseSignUpModal} /> {/* Add SignUpModal */}
    </>
  );
};

export default Navbar;
