const mongoose = require("mongoose");

const getAllAds = async (req, res) => {
  try {
    // 🟢 קבלת פרמטרים מה-query (page, limit)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🟢 שליפת מודעות מאוסף "ads" (DonationAd + WishlistAd)
    const ads = await mongoose
      .model("BaseAd", require("../models/baseAdSchema"))
      .find()
      .sort({ createdAt: -1 }) // סדר לפי יצירה (מהחדש לישן)
      .skip(skip)
      .limit(limit);

    // 🟢 חישוב כמות המודעות הכוללת במערכת
    const totalCount = await mongoose
      .model("BaseAd", require("../models/baseAdSchema"))
      .countDocuments();

    res.status(200).json({
      success: true,
      count: ads.length,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: ads,
    });
  } catch (error) {
    console.error(`Error fetching ads: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getAllAds };
