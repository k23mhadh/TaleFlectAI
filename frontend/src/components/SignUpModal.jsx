import React, { useEffect, useRef, useState } from "react";
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

function SignUpModal({ modalVisible, onCloseModal }) {
  const modalRef = useRef(null);

  // State for triggering the opening transition
  const [showModal, setShowModal] = useState(false);

  // Trigger transition when modal visibility changes
  useEffect(() => {
    if (modalVisible) {
      setShowModal(true); // Modal opens: Apply transition
    } else {
      setTimeout(() => {
        setShowModal(false); // Modal closes: Apply transition after delay
      }, 300); // Match the transition duration (300ms)
    }
  }, [modalVisible]);

  // Handle outside click to close modal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseModal(); // Close modal on outside click
      }
    };

    if (modalVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalVisible, onCloseModal]);

  // Don't render the modal if it's not visible (after transition)
  if (!showModal) {
    return null;
  }

  // Google Sign Up Response Handler
  const handleGoogleSignup = (response) => {
    if (response.credential) {
      // Handle the token you receive (usually send it to your backend to verify)
      console.log('Google Sign Up Response:', response.credential);
      // You can use the credential to authenticate the user on your backend
      // Example: Send the credential to your backend for verification
    }
  };

  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden={!modalVisible}
      className="bg-black bg-opacity-60 fixed inset-0 flex justify-center items-center w-full h-screen z-10"
    >
      {/* Modal Content with Transition Classes */}
      <div
        ref={modalRef} // Attach the ref to modal content
        className={`relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700 transform transition-all duration-300 ease-out ${
          modalVisible
            ? "opacity-100 scale-100" // Full opacity and scale when modal is visible
            : "opacity-0 scale-95" // Fade out and scale down when modal is closing
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create an Account
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onCloseModal}
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              focusable="false"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign Up
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account?{" "}
              <a
                href="#"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Log In
              </a>
            </div>

            {/* Google OAuth Button */}
            <div className="flex justify-center items-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={(error) => console.log('Google Sign In Error:', error)}
                useOneTap
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
