TaleFlect

Welcome to TaleFlect, an AI-driven platform designed to generate eBooks at scale using advanced language models. Unlike traditional LLMs (Large Language Models) such as GPT or LLaMA, which struggle with generating long-form content like books, TaleFlect leverages AI to overcome these limitations and produce eBooks seamlessly.
Table of Contents

    Project Overview
    Tech Stack
    Installation
    Project Structure
    How to Contribute
    License

Project Overview

The primary goal of this project is to create a platform where users can generate entire eBooks using AI.
Tech Stack
Backend

    Node.js: JavaScript runtime for building server-side applications.
    Express.js: Web framework for Node.js to manage API routes and handle requests.
    
Frontend

    React: JavaScript library for building user interfaces.
    Tailwind CSS: Utility-first CSS framework for efficient, responsive design.
    Framer Motion: Animation library for creating smooth, dynamic UI experiences.

Other

    SmartGit: Version control system for managing codebase collaboration.

Installation
Prerequisites

Before you can run this project locally, ensure you have the following installed on your machine:

    Node.js (v14.x or higher)
    npm (comes with Node.js)
    Git for version control

Steps to Install

    Clone the repository:

    bash

git clone https://github.com/k23mhadh/TaleFlectAI.git
cd TaleFlect

Install dependencies:

For the backend:

bash

cd backend
npm install

For the frontend:

bash

cd frontend
npm install

Environment Configuration:

Create a .env file in both the frontend and backend directories based on the provided .env.example. Replace the placeholder values with your own environment settings.

Running the Project:

In separate terminal windows, run the frontend and backend servers.

To run the backend:

bash

cd backend
npm start

To run the frontend:

bash

    cd frontend
    npm start

    Open the App:

    Navigate to http://localhost:3000 in your browser to view the frontend interface.

Project Structure

The repository is divided into multiple branches for better code organization:

    Master: This branch contains the final, stable version of the project. Do not push directly to Master.
    Frontend: This branch handles the front-end code.
    Backend: This branch contains the back-end services and API.
    Dev: This branch is for ongoing development. All new features should be merged here before being tested and finalized for the master branch.

Each branch may have multiple feature branches, organized by component or service (e.g., landing-page, auth-service, etc.).
File Structure Overview
Backend (Node.js + Express)

bash

backend/
│
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models (if applicable)
│   ├── routes/        # API routes
│   ├── services/      # Business logic and microservices
│   └── utils/         # Utility functions
│
├── tests/             # Unit and integration tests
└── package.json       # Dependencies and scripts

Frontend (React + Tailwind CSS)

graphql

frontend/
│
├── src/
│   ├── assets       # all asstets used in the frontend
│   ├── constants    # constants (e.g., names, texts, etc..)
│   ├── components/    # Reusable UI components
│   ├── pages/         # Main page components (e.g., LandingPage, SignIn)
│   ├── services/      # API calls and services
│   ├── index.css        # Tailwind CSS configuration
│   ├── App.jsx         # Main app structure
│   └── main.jsx       # App entry point
│
└── package.json       # Dependencies and scripts

How to Contribute

We are excited to welcome contributors! Follow the guidelines below to ensure smooth collaboration:

    Fork the repository and clone it to your local machine.
    Create a new branch based on the feature you are working on:

    bash

git checkout -b feature/your-feature-name

Work on your feature, committing regularly with clear commit messages.
Push your changes to your forked repository:

bash

    git push origin feature/your-feature-name

    Create a Pull Request to the dev branch of the original repository.

Please ensure your code adheres to the following:

    Well-documented and clean.
    Adequately tested, with relevant unit or integration tests.
    No direct changes to the Master branch.

For a more detailed contribution process, please refer to our Contributing Guidelines.
License

This project is licensed under the MIT License. See the LICENSE file for more information.
