# Ask!

A responsive, Reddit-style Q&A web application where users can post questions and provide answers. Built with the MERN stack, it features user authentication, image uploads, state management using Redux, and more.

![Home Page](https://github.com/frestaris/ask/raw/main/client/src/assets/homepage.png)

<p align="center">
  🔗 <strong><a href="https://ask-frontend-virid.vercel.app/">Live Demo</a></strong>
</p>

## Screenshots

### Question View + Comments

![Question with Comments](https://github.com/frestaris/ask/raw/main/client/src/assets/question-page.png)
![Comments](https://github.com/frestaris/ask/raw/main/client/src/assets/comment-section.png)

### Ask Question

![Ask Question](https://github.com/frestaris/ask/raw/main/client/src/assets/create-question.png)

### Search Bar

![Search Bar](https://github.com/frestaris/ask/raw/main/client/src/assets/searchbar.png)

### User Dashboard

![User Dashboard](https://github.com/frestaris/ask/raw/main/client/src/assets/user-dashboard.png)
![User Board](https://github.com/frestaris/ask/raw/main/client/src/assets/user-board.png)

### Admin Dashboard

![Admin Dashboard](https://github.com/frestaris/ask/raw/main/client/src/assets/admin-dashboard.png)
![Admin Comments Board](https://github.com/frestaris/ask/raw/main/client/src/assets/comments-board.png)
![Admin Questions Board](https://github.com/frestaris/ask/raw/main/client/src/assets/question-board.png)

### Edit Profile

![Edit Profile](https://github.com/frestaris/ask/raw/main/client/src/assets/edit-profile.png)

---

## Tech Stack

- **Frontend**: React, Redux, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Image Storage**: Firebase
- **State Management**: Redux
- **Deployment**: Vercel (Frontend, Backend)

---

## ✨ Features

- ✅ User registration and login
- 🔐 Secure authentication with JWT & bcrypt
- 📝 Post, edit, delete questions and answers
- 💬 Comment system with add, edit, and delete options
- 🔎 Searchbar to filter questions
- 🌓 Light and dark mode toggle
- 👤 Profile page with user dashboard
- 🛠️ Admin dashboard for content management
- 🖼️ Firebase image uploads
- ⚛️ Responsive design with Bootstrap

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (Atlas or local)
- Firebase project for image storage

### Installation

# 1. Clone the repository

```bash
git clone https://github.com/frestaris/ask.git
cd ask
```

# 2. Install Dependencies

# Backend

```bash
cd api
npm install
```

# Frontend

```bash
cd ../client
npm install
```

# 3. Configure Environment Variables

# Create file: api/.env

```bash
"PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret" > ../api/.env
```

# Create file: client/.env

```bash
"REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id" > ../client/.env
```

# 4. Run the App

# Start Backend

```bash
cd ../api
npm start
```

# Open a new terminal and start Frontend

```bash
cd ../client
npm start
```

Deployment
Frontend: Deployed to Vercel

Backend: Deployable to Vercel
Make sure REACT_APP_API_URL in the frontend .env matches your backend deployment URL.

Contributions are welcome! To contribute:

Fork the repo

```bash
Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push to the branch: git push origin feature-name

Submit a pull request
```

Designed and built with ❤️ by frestaris
