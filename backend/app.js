// backend/app.js
//IMPORTS MODELS SECTION.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db.js");

// IMPORT ROUTES SECTION.
const adRoutes = require("./routes/adRouter");
const authenticateRoutes = require("./routes/authenticateRouter");
const donationAdRoutes = require("./routes/donationAdRouter");
const wishAdRouter = require("./routes/wishAdRouter");
const offerRoutes = require("./routes/offerRouter");
const chatRoutes = require("./routes/chatRouter");
const ratingRouter = require("./routes/ratingRouter");  // <-- ADD THIS
const leaderboardRouter = require("./routes/leaderboardRouter");


//CONFIGURATION SECTION
dotenv.config(); 
connectDB();
const app =express(); 
                                         
//MIDDLEWARES SECTION
app.use(cors()); 
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ROUTES SECTION
app.use("/api/ads", adRoutes);
app.use("/api/authenticate", authenticateRoutes);
app.use("/api/donationAds", donationAdRoutes);
app.use("/api/wishAds", wishAdRouter);
app.use("/api/offers", offerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ratings", ratingRouter);  // <-- REGISTER ROUTER
app.use("/api/leaderboard", leaderboardRouter);


app.get("/", (req, res) => {
  res.send("Welcome to the ReuseHub project API");
});

module.exports = app;



