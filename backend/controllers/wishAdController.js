// backend/controllers/wishAdController.js
const WishAd = require("../models/wishAdSchema");

// Create a new wish ad
exports.createWishAd = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get WebSocket instance
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    const { adTitle, adDescription, category, amount, urgency, location, item } = req.body;

    if (!adTitle || !adDescription || !category || !amount || !urgency || !item || !location) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newAd = new WishAd({
      adTitle,
      adDescription,
      category,
      amount,
      urgency,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      item,
      createdBy: req.user._id,
    });

    await newAd.save();

    // Emit event for real-time update
    io.emit("wishAdCreated", newAd);

    res.status(201).json({ success: true, message: "Wish ad created successfully", data: newAd });
  } catch (error) {
    console.error("Error creating wish ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};