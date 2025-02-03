const Offer = require("../models/offerSchema");
const BaseAd = require("../models/baseAdSchema");

// Create an Offer
exports.createOffer = async (req, res) => {
  try {
    const { adId } = req.body;

    if (!adId) return res.status(400).json({ success: false, message: "Ad ID is required." });

    // Check if the ad exists
    const ad = await BaseAd.findById(adId);
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found." });

    // Check if ad is already completed
    if (ad.adStatus === "Donation Completed")
    {
      return res.status(400).json({ success: false, message: "This ad has already been completed." });
    }

    // ✅ Create a new offer
    const newOffer = new Offer({
      sender: req.user._id,
      receiver: ad.createdBy,
      adId: ad._id,
      offerStatus: "Pending",
    });

    await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Offer sent successfully",
      data: newOffer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// Gets offers list that was sent to a specific
exports.getUserOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ receiver: req.user._id })
      .populate("sender", "firstName lastName")
      .populate("adId", "adTitle adStatus amount");

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ✅ Delete an Offer (Only if ad is deleted or canceled)
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found." });

    await offer.remove();

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
