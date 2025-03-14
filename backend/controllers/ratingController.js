// backend/controllers/ratingController.js

const User = require("../models/userSchema");
const Offer = require("../models/offerSchema");
const { updateUserBadge } = require("../utils/badgeHelper"); // or wherever your badge logic is

exports.submitRating = async (req, res) => {
  try {
    const { offerId, ratings } = req.body;
    if (!offerId || !ratings) {
      return res.status(400).json({ success: false, message: "Offer ID and ratings are required." });
    }

    // For example: timeliness, itemCondition, descriptionAccuracy
    const criteria = ["timeliness", "itemCondition", "descriptionAccuracy"];
    let total = 0, count = 0;

    criteria.forEach((key) => {
      if (ratings[key] !== undefined) {
        total += Number(ratings[key]);
        count++;
      }
    });

    const averageRating = count > 0 ? total / count : 0;

    // Find the Offer to see which user is being rated
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    const userToRate = await User.findById(offer.sender);
    if (!userToRate) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Add average rating points to user’s total
    userToRate.ratingPoints += averageRating;
    await userToRate.save();

    // Update user’s badge if needed
    await updateUserBadge(userToRate);

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      averageRating
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


