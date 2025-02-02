const BaseAd = require("../models/baseAdSchema");

exports.getAllAds = async (req, res) => {
  try {
    // 🟢 קבלת פרמטרים מה-query (page, limit)
    let page = parseInt(req.query.page) || 1; // Default to page 1
    let limit = parseInt(req.query.limit) || 10; // Default to 10 ads per page
    let skip = (page - 1) * limit;


    const totalCount = await BaseAd.countDocuments();

    // Fetch ads with pagination & sorting
    const ads = await BaseAd.find()
      .populate("createdBy", "firstName lastName") // Include user info
      .sort({ createdAt: -1 }) // Sort by newest first
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

