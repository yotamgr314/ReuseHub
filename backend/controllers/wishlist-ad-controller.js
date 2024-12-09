const wishListAdModel = require("../models/wishListAdSchema");

exports.createWishListAd = async (req, res) => {
  try {
    
    // Validate input
    const { title, description, location, createdBy, items, urgency } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate location
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: "Invalid coordinates. Must be an array with exactly 2 numbers [longitude, latitude].",
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.some(item => item.itemType !== "WishlistAd")) {
      return res.status(400).json({
        message: "All items must have itemType as 'WishlistAd'.",
      });
    }

    // Create and save the wishlist ad
    const newWishListAd = new wishListAdModel({
      title,
      description,
      location,
      createdBy,
      items,
      urgency,
    });

    const savedWishListAd = await newWishListAd.save();

    // Emit the event via Socket.IO
    const io = req.app.get("io");
    if (io) {
        io.emit("wishListAdCreated", savedWishListAd);
    }

    // Return a successful response
    res.status(201).json({ success: true, data: savedWishListAd });
  } catch (error) {
    console.error("Error creating wishlist ad:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
