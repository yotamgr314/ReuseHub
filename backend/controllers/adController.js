// backend/controllers/adController.js
const BaseAd = require("../models/baseAdSchema");

exports.getAllAds = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    let filter = {}; // 🔹 Default: No filter (fetch all ads)
    if (req.query.kind) {
      if (!["donationAd", "wishAd"].includes(req.query.kind)) {
        return res.status(400).json({ success: false, message: "Invalid ad type. Allowed values: donationAd, wishAd" });
      }
      filter.kind = req.query.kind; // 🔹 Apply kind filter (optional)
    }

    const totalCount = await BaseAd.countDocuments(filter);

    const ads = await BaseAd.find(filter)
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: ads.length,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: ads,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



exports.getAdById = async (req, res) => {
  try {
    const ad = await BaseAd.findById(req.params.id).populate("createdBy", "firstName lastName");
    
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    console.error("Error fetching ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



exports.deleteAd = async (req, res) => {
  try {
    const ad = await BaseAd.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    if (ad.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this ad" });
    }

    await ad.remove();
    res.status(200).json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



exports.getMyAds = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    let filter = { createdBy: req.user._id };

    if (req.query.kind) {
      if (!["donationAd", "wishAd"].includes(req.query.kind)) {
        return res.status(400).json({ success: false, message: "Invalid ad type. Allowed values: donationAd, wishAd" });
      }
      filter.kind = req.query.kind; // 🔹 Apply kind filter (optional)
    }

    const myAds = await BaseAd.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: myAds.length, data: myAds });
  } catch (error) {
    console.error("Error fetching user ads:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

