const donationAdModel = require("../models/donationAdSchema");

exports.createDonationAd = async (req, res) => {
  try {
    // Validate input
    const { title, description, location, createdBy, items, claimRequests } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: "Invalid coordinates. Must be an array with exactly 2 numbers [longitude, latitude].",
      });
    }

    // Create and save the donation ad
    const newDonationAd = new donationAdModel({
      title,
      description,
      location,
      createdBy,
      items,
      claimRequests,
    });

    const savedDonationAd = await newDonationAd.save(); // Use the corrected variable name

    // Emit the event via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("donationAdCreated", savedDonationAd);
    }

    // Return a successful response
    res.status(201).json({ success: true, data: savedDonationAd });
  } catch (error) {
    console.error("Error creating donation ad:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
