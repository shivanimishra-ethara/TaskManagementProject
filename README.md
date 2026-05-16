# Full-Stack MERN Team Task Manager

This is a Full-Stack Team Task Management application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. It allows users to create projects, invite members, and manage tasks within a collaborative environment.

## Features
- **User Authentication**: Secure signup and login using JWT.
- **Role-Based Access**: Project creators automatically become Admins who can add members and manage all tasks. Members can only update the status of tasks assigned to them.
- **Project Management**: Create multiple projects and organize work.
- **Task Management**: Create tasks with titles, descriptions, due dates, and priorities. Assign tasks to project members and track them via statuses (To Do, In Progress, Done).
- **Dashboard**: Get a clear overview of total tasks, overdue tasks, task statuses, and workloads per user.

## Tech Stack
- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (JWT), Bcrypt.js.
- **Database**: MongoDB (Atlas or Local).

## Setup Instructions

### Local Development

1. **Clone the repository**
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
4. **Environment Variables**:
   In the `backend` directory, create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
5. **Run the Application Locally**:
   Start the backend server (from `/backend`):
   ```bash
   npm run dev
   ```
   Start the frontend server (from `/frontend`):
   ```bash
   npm run dev
   ```

### Deployment to Railway

This application is configured as a monorepo where the backend Express server serves the static React frontend in production.

1. Create a GitHub repository and push your code.
2. Log into [Railway](https://railway.app/).
3. Create a **New Project** and select **Deploy from GitHub repo**.
4. Select your repository.
5. In the **Variables** section of your Railway service, add:
   - `MONGO_URI` (Your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong random string)
6. Go to **Settings > Build** and configure the root directory or custom build command if necessary. Railway will automatically detect Node.js.
   You can add a custom `start` script and `build` script in the root `package.json` to handle installing both frontend and backend dependencies, building the frontend, and starting the backend.

### Root `package.json` for Deployment

Ensure your root `package.json` contains:
```json
{
  "name": "task-management",
  "scripts": {
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm run build",
    "start": "cd backend && node server.js"
  }
}
```
And set the **Build Command** in Railway to `npm run install-all && npm run build` and **Start Command** to `npm start`.

## Submission Video
*(Please record your 2-5 minute video demonstrating the live URL, codebase, and functional workflow)*
