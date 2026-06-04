# ✈️ Traveloop – AI Powered Travel Planning Platform

<div align="center">

### Plan Smarter. Travel Better.

An AI-powered travel planning platform that helps travelers create personalized itineraries, manage budgets, discover community-created trips, and connect with experienced travelers through premium real-time chat.

</div>

---

## 🌍 Overview

Traveloop is a full-stack travel planning platform built for modern travelers. Users can create detailed day-by-day trip plans, track expenses, generate AI-powered itineraries, share travel experiences with the community, and connect directly with trip creators through premium real-time chat.

The platform combines AI, real-time communication, and social travel planning into one seamless experience.

---

## ✨ Features

### 🤖 AI Trip Planner

* Generate complete travel itineraries using Groq LLaMA 3.3 AI.
* Instant day-wise planning.
* Server-Sent Events (SSE) for real-time AI responses.

### 📅 Smart Itinerary Builder

* Create detailed daily schedules.
* Automatic trip duration validation.
* Drag-and-drop itinerary management.

### 👥 Community Travel Feed

* Share travel plans publicly.
* Explore trips created by other travelers.
* Clone community trips with one click.

### 💰 Budget & Expense Tracking

* Daily expense management.
* Budget monitoring dashboard.
* Interactive Pie and Bar charts using Recharts.

### 💬 Premium Traveler Chat

* Secure real-time chat using Socket.io.
* Pay ₹20 via Razorpay to unlock traveler consultation.
* Access remains active for 24 hours.

### 📝 Travel Notes & Packing Checklist

* Create personalized travel notes.
* Manage packing lists efficiently.

### 🔐 Secure Authentication

* JWT-based authentication.
* Password encryption using Bcrypt.
* Profile image uploads with Cloudinary.

### 🎨 Modern User Experience

* Responsive design.
* Dark glassmorphism UI.
* Smooth animations using Framer Motion.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Socket.io Client
* Recharts
* Framer Motion
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Socket.io
* JWT Authentication
* Bcrypt.js
* Multer
* Cloudinary

### Integrations

* Groq AI (LLaMA 3.3)
* Razorpay Payment Gateway

---

## 📂 Project Structure

```bash
Traveloop
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── assets
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── utils
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

VITE_API_BASE_URL=http://localhost:5000/api

GROQ_API_KEY=your_groq_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

### Start Application

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

## 💡 Core Workflow

1. User creates or generates a trip using AI.
2. Day-wise itinerary is automatically organized.
3. Budget and expenses are tracked throughout the trip.
4. Users can publish trips to the community.
5. Other travelers can clone trips instantly.
6. Premium users can purchase traveler consultations through Razorpay.
7. Real-time chat is enabled using Socket.io.

---

## 📸 Screenshots

Add screenshots here:

```text
Home Page
Dashboard
AI Planner
Community Feed
Budget Analytics
Premium Chat
```

---

## 🔮 Future Enhancements

* Multi-user collaborative trip planning
* Hotel and flight integrations
* Google Maps integration
* AI travel assistant chatbot
* Offline itinerary access
* Mobile application

---

## 👨‍💻 Author

### Luv Yadav

Built for **Odoo Hackathon**

**Tech Stack:** MERN Stack | AI Integration | Real-Time Systems

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

```bash
⭐ Star the repository
🍴 Fork the project
🚀 Contribute and improve
```
