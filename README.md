# ReuseHub

**ReuseHub** is a full-stack MERN web application that promotes sustainability by enabling users to donate and request second-hand items through an intuitive, near real-time map-based interface which visualizes offers,Adsetc.. and vi chat. The platform empowers communities to reduce waste and reuse valuable items through real-time collaboration, gamified incentives, and location-based search.

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Demo](#demo)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the App](#running-the-app)  
- [API Reference](#api-reference)  
- [Real-time Updates](#real-time-updates)  
- [Map Integration](#map-integration)  
- [Folder Structure](#folder-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)

---

## Overview

ReuseHub connects community members who want to donate items, post wishlists, and negotiate offers—all within a geographically-aware interface. Built as the final project for a software engineering methods course, it demonstrates:

- **Full CRUD** for donation and wishlist ads  
- **User authentication** (JWT + bcrypt)  
- **Real-time updates** via Socket.io  
- **Location visualization** with Google Maps markers  
- **Offer/request workflow** between users :contentReference[oaicite:0]{index=0}

---

## Features

- **User Management**  
  - Registration & login with JWT and HttpOnly cookies  
  - Profile pictures (upload & display)  
- **Ads & Items**  
  - Create, edit & delete **Donation Ads**  
  - Create, edit & delete **Wishlist Ads**  
  - Automatic item-quantity tracking & “donation completed” logic  
- **Offers Workflow**  
  - Send donation/wish offers to ad owners  
  - Dual-approval system: adOwnerApproval + requesterApproval  
  - Automatic status updates & notifications on completion  
- **Real-Time Map & List**  
  - Home page lists all ads; map shows markers (distinct icons for donation vs. wish)  
  - Socket.io pushes new ads to all clients without refresh  
- **Ratings & Leaderboard**  
  - Rate users post-transaction  
  - Leaderboard of top-rated contributors  
- **Material-UI (MUI)** for responsive design  
- **Logging & Monitoring** with Morgan & Winston  

---

## Tech Stack

- **Frontend**  
  - React (Hooks, Context API)  
  - Material-UI (MUI)  
  - Socket.io-client  
  - Google Maps JavaScript API  
- **Backend**  
  - Node.js & Express  
  - MongoDB & Mongoose (with discriminators for BaseAd → DonationAd/WishlistAd)  
  - Socket.io  
  - JWT for auth, bcryptjs for password hashing  
  - Morgan & Winston for logging  
- **Deployment**  
  - Hosted on [Render.com](https://reusehub-h9o5.onrender.com) :contentReference[oaicite:1]{index=1}  

---

## Demo

> Live app: https://reusehub-h9o5.onrender.com

*(login with a new account to explore creating ads, offers, and watching them appear in real time on the map)*

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.x  
- [npm](https://www.npmjs.com/) v9.x  
- A MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
# Clone the repo
git clone https://github.com/yotamgr314/ReuseHub.git
cd ReuseHub

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
