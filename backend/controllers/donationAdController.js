// backend/controllers/donationAdController.js
const DonationAd = require("../models/donationAdSchema");

exports.createDonationAd = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get WebSocket instance
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    const { adTitle, adDescription, category, amount, donationMethod, itemCondition, location, item } = req.body;

    if (!adTitle || !adDescription || !category || !amount || !donationMethod || !itemCondition || !item || !location) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    console.log("🔹 Received Donation Ad Request:", req.body);

    const newAd = new DonationAd({
      adTitle,
      adDescription,
      category,
      amount,
      donationMethod,
      itemCondition,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      items: {  // 🔹 FIXED: Use 'items' instead of 'item'
        name: item.name || "N/A",
        description: item.description || "N/A",
        images: item.images || [],
      },
      createdBy: req.user._id,
    });
        await newAd.save();

    // Emit event for real-time update
    io.emit("donationAdCreated", newAd);

    res.status(201).json({ success: true, message: "Donation ad created successfully", data: newAd });
  } catch (error) {
    console.error("Error creating donation ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
