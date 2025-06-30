# 🔐 Full-Stack Authentication System

A production-ready authentication and authorization backend built with **Node.js**, **Express**, **Sequelize**, and **Passport.js**, featuring both local and Google OAuth strategies. Designed for scalability and real-world use.

---

## Description

This project implements a complete authentication system suitable for modern applications. It supports:

- Email/password authentication
- OAuth login via Google
- Secure JWT handling (access & refresh tokens)
- Role-based access control
- Password reset via email
- Session management (logout from one or all devices)

---

## Tech Stack

- **Node.js** + **Express**
- **Sequelize ORM** (PostgreSQL)
- **Passport.js** (Local + Google strategies)
- **bcrypt** (password hashing)
- **JWT** for stateless auth
- **dotenv** for config management
- **express-session** (used with OAuth only)

---

## 🚀 Features

- ✅ Email/password registration & login
- ✅ Hashed password storage with bcrypt
- ✅ JWT + refresh token authentication
- ✅ Logout from current or all sessions
- ✅ Role-based access control (admin, user, etc.)
- ✅ Password reset via secure email link
- ✅ Google OAuth login
- ✅ Tracks login provider (local, google)
- ✅ Sequelize migrations + class-based models
- ✅ Properly commented codebase

---

## 🧪 Testing

🧼 _Tests coming soon (Jest + Supertest)_

---

## 🛠️ Getting Started

### 1. Clone the Repo

### 2. Install

- npm install

### 3. Set up your Environment

**Create a .env file using the template below**

- PORT=3000
- JWT_SECRET=your_jwt_secret
- REFRESH_TOKEN_SECRET=your_refresh_secret
- SESSION_SECRET=your_session_secret

- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret

### 4. Run Migrations

- npx sequelize-cli db:migrate

### 5. Start the Server

- npm run dev

```bash
git clone https://github.com/Justindaily23/Auth-System.git
cd Auth-System
```

## License

- This project is open-source under the MIT License.
