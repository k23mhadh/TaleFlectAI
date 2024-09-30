Contributing Guidelines

Welcome to TaleFlect! This project aims to generate eBooks using AI in a way that traditional LLMs (like GPT, Llama, etc.) struggle with, especially when handling tens of chapters or complex structures. With TaleFlect, we aim to make AI-driven book creation a reality. Let's work together to bring this vision to life!
Project Structure

The project is divided into two main parts:

    Frontend
    Backend (can be organized using a microservice architecture for scalability and flexibility)

Repo Organization

To contribute effectively to the project, please adhere to the following guidelines regarding the repository structure and branching strategy:

    Master Branch: This branch is reserved for the final, stable version of the project. Do not push any changes directly to the Master branch.
    Development Branches: There are three main branches:
        frontend - All front-end related work.
        backend - All back-end related work.
        dev - This is the branch where new changes from both frontend and backend are merged. Any pull request should be directed to the dev branch.
    Sub-Branches: Each of the frontend and backend branches is further divided into feature-specific sub-branches:
        Frontend sub-branches: Organized by page or component (e.g., landing-page, sign-in, sign-up).
        Backend sub-branches: Organized by functionality (e.g., auth-service, login-service, registration-service).

Guidelines for Contributing

    Pull Requests: All contributions must be made through pull requests targeting the dev branch. This ensures that the master branch remains stable and only includes fully tested and finalized features.
    Feature Branches: When working on a new feature or bug fix, create a new branch from the frontend, backend, or dev branch, depending on your area of work.
    Naming Conventions: Use clear and descriptive names for branches. For instance, if you're working on a landing page design in the frontend, use something like frontend-landing-page-update.
    Code Reviews: Before any pull request is merged into the dev branch, it must undergo a code review. Make sure your code is well-documented and tested.

Recommended Tool

For Git management, we recommend using SmartGit. You can download it here. It provides an intuitive interface for managing branches and commits, making your contribution process smoother.
Tech Stack

    Backend: Node.js with the Express framework.
    Frontend: React, Tailwind CSS, and Framer Motion for animations.

For detailed setup instructions and dependencies, refer to the ReadMe.md file in the repository.
Final Note

We’re excited to have you contribute to this project and help make AI-driven book creation more accessible. Thank you for your contributions!

Enjoy coding, and welcome to the TaleFlect team!
By Kaies MHADHBI
