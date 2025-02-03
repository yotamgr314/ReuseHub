const WishAd = require("../models/wishAdSchema");

// ✅ Create a new wish ad
exports.createWishAd = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    const { adTitle, adDescription, category, urgency, location, item, amount } = req.body;

    if (!adTitle) return res.status(400).json({ success: false, message: "Ad title is required." });
    if (!adDescription) return res.status(400).json({ success: false, message: "Ad description is required." });
    if (!category) return res.status(400).json({ success: false, message: "Category is required." });
    if (!urgency) return res.status(400).json({ success: false, message: "Urgency level is required." });
    if (!item || !item.name) return res.status(400).json({ success: false, message: "Item name is required." });

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: "Amount must be at least 1." });
    }

    // Validate location
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Location must include coordinates as [longitude, latitude]." });
    }

    // ✅ Create a new wish ad
    const newAd = new WishAd({
      adTitle,
      adDescription,
      category,
      urgency,
      item,
      amount,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      createdBy: req.user._id,
    });

    await newAd.save();

    res.status(201).json({
      success: true,
      message: "Wish ad created successfully",
      data: newAd,
    });
  } catch (error) {
    console.error("Error creating wish ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
