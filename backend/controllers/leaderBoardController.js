const User = require("../models/userSchema");

exports.getLeaderboard = async (req, res) => {
  try {
    // Retrieve users sorted by ratingPoints (highest first)
    const users = await User.find({})
      .select("firstName lastName ratingPoints badges")
      .sort({ ratingPoints: -1 });
    
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
