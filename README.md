# Task Manager Backend API

A RESTful API backend for the Task Manager application, built with Node.js, Express, and MongoDB as part of the MERN Stack Intern Screening Assignment.

## 📋 Overview

This Task Manager API provides endpoints for user authentication and task management. It uses JWT authentication to protect routes and MongoDB for data storage.

## ✨ Features

- User registration and login with JWT authentication
- Protected API routes for task management
- Complete CRUD operations for tasks
- MongoDB integration with Mongoose ODM
- Error handling and validation

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing support

## 📁 Project Structure

```
├── config/             # Configuration files
│   └── database.js           # Database connection configuration
├── controllers/        # Route controllers
│   ├── auth.controller.js
│   └── task.controller.js
├── middleware/         # Custom middleware
│   └── auth.middleware.js
├── models/             # Mongoose models
│   ├── user.model.js
│   └── task.model.js
├── routes/             # API routes
│   ├── auth.routes.js
│   └── task.routes.js
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Package configuration
└── index.js           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or later)
- MongoDB Atlas account or local MongoDB installation
- pnpm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone
   cd into the directory
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. Start the server:

   ```bash
   # Development mode
   pnpm dev
   # or
   yarn dev

   # Production mode
   pnpm start
   # or
   yarn start
   ```

4. The server will be running at `http://localhost:5000`.

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Tasks (Protected Routes)

- `GET /api/tasks` - Get all tasks for the logged-in user
- `GET /api/tasks/:id` - Get a single task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

## 📊 Data Models

### User Model

```javascript
{
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  email: ObjectId (reference to User),
  title: String,
  description: String,
  status: String (enum: ["pending", "in-progress", "completed"]),
  dueDate: Date,
  assignee: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment

This project is deployed on Render.

## 🔍 Error Handling

The API uses a centralized error handling middleware. All errors are formatted consistently.
