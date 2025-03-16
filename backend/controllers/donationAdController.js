const DonationAd = require("../models/donationAdSchema");
const User = require("../models/userSchema");
const { updateUserBadge } = require("../utils/badgeHelper");

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

    // המר את location לערך JSON אם הוא מגיע כמחרוזת
    const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;

    if (!parsedLocation || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Invalid location coordinates. Must be [longitude, latitude]." });
    }

    // עיבוד התמונות שהועלו ושמירת הנתיבים שלהן
    const imagePaths = req.files ? req.files.map((file) => "/uploads/" + file.filename) : [];

    const newAd = new DonationAd({
      adTitle,
      adDescription,
      category,
      amount,
      donationMethod,
      itemCondition,
      location: {
        type: "Point",
        coordinates: parsedLocation.coordinates,
      },
      items: {
        name: item.name || "N/A",
        description: item.description || "N/A",
        images: imagePaths.length > 0 ? imagePaths : item.images || [],
      },
      createdBy: req.user._id,
    });

    await newAd.save();
    
    // Inside createDonationAd, after await newAd.save():
    await User.findByIdAndUpdate(req.user._id, { $inc: { ratingPoints: 5 } });
    const updatedUser = await User.findById(req.user._id);
    await updateUserBadge(updatedUser);


    // Emit event for real-time update
    io.emit("donationAdCreated", newAd);

    res.status(201).json({ success: true, message: "Donation ad created successfully", data: newAd });
  } catch (error) {
    console.error("Error creating donation ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};