const Offer = require("../models/offerSchema");
const BaseAd = require("../models/baseAdSchema");

exports.sendOffer = async (req, res) => {
  try {
    const { adId, offerAmount } = req.body;

    if (!adId) return res.status(400).json({ success: false, message: "Ad ID is required." });
    if (!offerAmount || offerAmount < 1) return res.status(400).json({ success: false, message: "Offer amount must be at least 1." });

    // Check if the Ad exists
    const ad = await BaseAd.findById(adId);
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found." });

    // ✅ Prevent user from offering more than available items
    if (offerAmount > ad.amount) {
      return res.status(400).json({ success: false, message: `Only ${ad.amount} items are available for donation.` });
    }

    // ✅ Create a new offer
    const newOffer = new Offer({
      sender: req.user._id,
      receiver: ad.createdBy,
      adId: ad._id,
      offerAmount,
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



exports.updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adOwnerApproval, userWhoMadeTheOfferApproval } = req.body;
    
    const offer = await Offer.findById(id).populate("adId");
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found." });

    const ad = offer.adId;
    if (!ad) return res.status(404).json({ success: false, message: "Referenced Ad not found." });

    // Update approval status
    if (adOwnerApproval !== undefined) offer.offerConfirmation.adOwnerApproval = adOwnerApproval;
    if (userWhoMadeTheOfferApproval !== undefined) offer.offerConfirmation.userWhoMadeTheOfferApproval = userWhoMadeTheOfferApproval;

    // Check if both approvals are true
    if (offer.offerConfirmation.adOwnerApproval || offer.offerConfirmation.userWhoMadeTheOfferApproval) {
      offer.offerStatus = "Accepted";

      // Reduce the Ad's item amount based on the offer
      ad.amount -= offer.offerAmount;
      
      if (ad.amount < 1) {
        // Mark the Ad as "Donation Completed"
        ad.adStatus = "Donation Completed";

        // Reject all pending offers related to this Ad
        await Offer.updateMany(
          { adId: ad._id, offerStatus: "Pending" },
          { offerStatus: "Rejected" }
        );

        // Delete all offers related to the completed Ad
        await Offer.deleteMany({ adId: ad._id });

        // Remove the Ad from the system
        await BaseAd.findByIdAndDelete(ad._id);

      } else {
        await ad.save(); // Save the updated ad amount
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Offer updated successfully!",
      data: offer,
    });
  } catch (error) {
    console.error("Error updating offer:", error);
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
      message: "Offer deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
