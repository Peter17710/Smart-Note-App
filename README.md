# Smart Note App Backend

This repository contains the backend for a powerful and secure Smart Note application. It provides robust user authentication, note management with GraphQL, and advanced features like AI-powered note summarization and profile picture uploads.

## Features

### User Management & Authentication
* **User Registration & Login:** Secure user registration and login system with password hashing (using `bcrypt`) and JWT-based authentication.
* **Token-Based Authentication:** Utilizes JSON Web Tokens (JWT) for secure API access.
* **Logout & Token Revocation:** Implements a mechanism to revoke JWT tokens upon logout for enhanced security.
* **Protected Routes:** Ensures that sensitive routes are accessible only to authenticated users.
* **Password Reset (OTP-based):**
    * **Forget Password:** Users can request a One-Time Password (OTP) via email to reset their password.
    * **Reset Password:** Verifies the OTP and allows users to set a new password, ensuring the OTP is single-use and time-limited.
* **Profile Picture Upload:** Authenticated users can upload a profile picture, which is stored locally with a unique filename to prevent overwrites, and its path is saved in the user's database document.

### Note Management (GraphQL API)
* **GraphQL API:** Provides a flexible and efficient GraphQL endpoint for managing notes.
* **Note Creation:** Create new notes with a title and content, associated with a user.
* **Note Retrieval:** Fetch notes, with capabilities for:
    * Filtering by `userId` and `title`.
    * Date range filtering (`startDate`, `endDate`).
    * Pagination (`page`, `limit`).
* **Note Updates:** Update existing notes by `noteId`.
* **Note Deletion:** Delete notes by `noteId` for the authenticated user.
* **GraphiQL IDE:** A GET route is available to serve the GraphiQL IDE, allowing for easy testing and exploration of the GraphQL API.

### AI-Powered Summarization
* **Note Summarization:** Integrates with OpenAI's API (`gpt-4o-mini`) to provide a summary of note content. Users can request a single-paragraph summary of any existing note.

### Security & Error Handling
* **CORS (Cross-Origin Resource Sharing):** Configured to handle requests from different origins.
* **Helmet:** Implements various HTTP headers to enhance security against common web vulnerabilities (e.g., XSS, clickjacking).
* **Express Rate Limit:** Protects against brute-force and Denial-of-Service (DoS) attacks by limiting the number of requests from a single IP address within a time window.
* **Asynchronous Error Handling:** Uses a custom `handleAsyncError` middleware to centralize error handling for asynchronous operations.
* **Global Error Middleware:** Catches and processes all application errors, providing consistent error responses.

### Technologies Used
* **Node.js & Express.js:** Backend runtime and web framework.
* **MongoDB & Mongoose:** NoSQL database and ODM (Object Data Modeling) for MongoDB.
* **GraphQL:** Query language for your API, implemented with `graphql.js` and `graphql-http`.
* **JWT (JSON Web Tokens):** For user authentication.
* **Bcrypt:** For secure password hashing.
* **Nodemailer:** For sending emails (e.g., OTP for password reset).
* **Multer:** For handling multipart/form-data, primarily for file uploads.
* **OpenAI API:** For AI-powered note summarization.
* **Dotenv:** For managing environment variables securely.
* **Cors, Helmet, Express-Rate-Limit:** For robust API security.

## Getting Started

### Prerequisites
* Node.js (v14 or higher recommended)
* MongoDB instance (local or cloud-hosted)
* OpenAI API Key
* Gmail account (or another email service) for sending OTPs

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Peter17710/Smart-Note-App.git](https://github.com/Peter17710/Smart-Note-App.git)
    cd Smart-Note-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root directory of your project, create a file named `.env` and add the following environment variables:
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    EMAIL_USER=your_gmail_address@gmail.com
    EMAIL_PASS=your_gmail_app_password
    JWT_SECRET=your_jwt_secret_key # Use a strong, random string here
    ```
    * **`MONGODB_URI`**: Your MongoDB connection string (e.g., `mongodb://localhost:27017/smartnotes` or a MongoDB Atlas URI).
    * **`OPENAI_API_KEY`**: Get this from the [OpenAI Platform](https://platform.openai.com/account/api-keys).
    * **`EMAIL_USER`**: Your Gmail address for sending OTPs.
    * **`EMAIL_PASS`**: **Crucially, this must be an [App Password](https://myaccount.google.com/apppasswords) generated from your Google Account (requires 2-Step Verification enabled).**
    * **`JWT_SECRET`**: A secret key for signing JWTs. Make this a long, random string.

4.  **Create Uploads Directories:**
    Ensure you have the following directories in your project root:
    ```
    ./uploads
    ./uploads/profilePics
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    # or if you have nodemon installed:
    # npm run dev
    ```
    The server will typically run on `http://localhost:3000` (or the port specified in your `.env` file).

### API Endpoints

#### Authentication (`/auth`)
* `POST /auth/register`: Register a new user.
* `POST /auth/login`: Log in a user and get a JWT token.
* `POST /auth/logout`: Invalidate a user's JWT token.
* `POST /auth/forget-password`: Request an OTP for password reset.
* `POST /auth/reset-password`: Reset password using OTP.

#### User (`/users`)
* `POST /users/:addUser`: Add a new user (likely for admin use or initial setup).
* `GET /users/:id`: Get user details by ID.
* `PATCH /users/upload-profile-pic`: Upload or update an authenticated user's profile picture.

#### Notes (`/`)
* `GET /`: Serves the GraphiQL IDE for testing GraphQL queries.
* `POST /graphql`: The main GraphQL endpoint for notes (queries and mutations).
* `POST /:id/summarize`: Get an AI-powered summary of a specific note.

---

## Project Structure (Simplified)

├── db/
│   └── connection.js             # MongoDB connection
│   └── models/
│       ├── notes.model.js        # Mongoose Note Schema
│       └── user.model.js         # Mongoose User Schema
├── src/
│   ├── Modules/
│   │   ├── Auth/
│   │   │   ├── authControllers.js  # Auth logic (Register, Login, OTP, Reset, Logout, Middleware)
│   │   │   └── authRoutes.js       # Auth API routes
│   │   ├── Notes/
│   │   │   ├── notesControllers.js # GraphQL schema, resolvers, and AI summarization logic
│   │   │   └── notesRoutes.js      # GraphQL and summarization API routes
│   │   └── User/
│   │       ├── userControllers.js  # User logic (add, get, profile pic upload)
│   │       └── userRoutes.js       # User API routes
│   ├── Middleware/
│   │   └── handleAsyncError.js   # Async error handling utility
│   └── utils/
│       ├── appError.js           # Custom error class
│       └── fileUpload.js         # Multer configuration for file uploads
├── uploads/                      # Directory for uploaded files (ignored by Git)
│   └── profilePics/              # Subdirectory for profile pictures
├── .env                          # Environment variables (ignored by Git)
├── .gitignore                    # Specifies files/folders to ignore from Git
├── package.json
├── server.js                     # Main application entry point
└── README.md                     # This file
