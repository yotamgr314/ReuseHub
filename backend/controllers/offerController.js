// backend/controllers/offerController.js

const Offer = require("../models/offerSchema");
const BaseAd = require("../models/baseAdSchema");
const Chat = require("../models/chatSchema");
const User = require("../models/userSchema");
const { updateUserBadge } = require("../utils/badgeHelper");

/**
 * Creates a new Offer (unchanged).
 */
exports.sendOffer = async (req, res) => {
  try {
    const { adId, offerAmount, message } = req.body;
    console.log("📩 Received sendOffer request:", { adId, offerAmount, message });

    if (!adId) {
      return res.status(400).json({ success: false, message: "Ad ID is required." });
    }
    if (!offerAmount || offerAmount < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Offer amount must be at least 1." });
    }

    const ad = await BaseAd.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found." });
    }

    const newOffer = new Offer({
      sender: req.user._id,
      receiver: ad.createdBy,
      adId: ad._id,
      offerAmount,
      offerStatus: "Pending",
    });

    await newOffer.save();
    console.log("✅ Offer saved:", newOffer);

    // Create and link chat
    const newChat = new Chat({
      offerId: newOffer._id,
      participants: [req.user._id, ad.createdBy],
      messages: message ? [{ sender: req.user._id, text: message }] : [],
    });

    await newChat.save();
    console.log("✅ Chat saved:", newChat);

    newOffer.chat = newChat._id;
    await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Offer and chat created successfully",
      data: { newOffer, newChat },
    });
  } catch (error) {
    console.error("❌ Error creating offer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adOwnerApproval, userWhoMadeTheOfferApproval, ratings } = req.body;
    
    // 1) Find the Offer and its related Ad
    const offer = await Offer.findById(id).populate("adId");
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    const ad = offer.adId;
    if (!ad) {
      return res.status(404).json({ success: false, message: "Referenced Ad not found." });
    }

    // 2) Update offer confirmations
    if (typeof adOwnerApproval !== "undefined") {
      offer.offerConfirmation.adOwnerApproval = adOwnerApproval;
    }
    if (typeof userWhoMadeTheOfferApproval !== "undefined") {
      offer.offerConfirmation.userWhoMadeTheOfferApproval = userWhoMadeTheOfferApproval;
    }

    // 3) If either side approves, process the offer as "Accepted"
    if (offer.offerConfirmation.adOwnerApproval || offer.offerConfirmation.userWhoMadeTheOfferApproval) {
      offer.offerStatus = "Accepted";

      // 3a) Process ratings if provided (default missing values to 0)
      if (ratings) {
        const criteria = ["timeliness", "itemCondition", "descriptionAccuracy"];
        let total = 0;
        let count = 0;
        criteria.forEach((key) => {
          const val = parseInt(ratings[key] ?? 0, 10);
          if (!isNaN(val)) {
            total += val;
            count++;
          }
        });
        const avgRating = count > 0 ? total / count : 0;
        if (avgRating > 0) {
          const userToRate = await User.findById(offer.sender);
          if (userToRate) {
            userToRate.ratingPoints += avgRating;
            await userToRate.save();
            await updateUserBadge(userToRate);
          }
        }
      }

      // 3b) Decrement ad.amount by the offerAmount
      ad.amount -= offer.offerAmount;

      // 3c) Prepare a note that applies in every case
      let noteMessage = "Note: once the offer is approved it will get auto-deleted from the system.";

      // 3d) If the ad is fully donated, complete donation flow
      if (ad.amount < 1) {
        ad.adStatus = "Donation Completed";

        // Award +10 points each to donor and receiver, update badges
        const donor = await User.findByIdAndUpdate(
          ad.createdBy,
          { $inc: { ratingPoints: 10 } },
          { new: true }
        );
        const receiver = await User.findByIdAndUpdate(
          offer.sender,
          { $inc: { ratingPoints: 10 } },
          { new: true }
        );
        if (donor) await updateUserBadge(donor);
        if (receiver) await updateUserBadge(receiver);

        // Append extra note if the offer covers full quantity (donation completed)
        noteMessage += " As well as your Ad.";

        // Reject pending offers and remove all offers for this ad
        await Offer.updateMany(
          { adId: ad._id, offerStatus: "Pending" },
          { offerStatus: "Rejected" }
        );
        await Offer.deleteMany({ adId: ad._id });

        // Remove the ad from the system
        await BaseAd.findByIdAndDelete(ad._id);

        return res.status(200).json({
          success: true,
          message: `Donation completed; ad and related offers removed. ${noteMessage}`,
        });
      } else {
        // Donation is still active: save changes
        await ad.save();
        await offer.save();
      }
    } else {
      // If no approvals yet, simply save the offer changes
      await offer.save();
    }
    
    return res.status(200).json({
      success: true,
      message: `Offer updated successfully! ${"Note: once the offer is approved it will get auto-deleted from the system."}`,
      data: offer,
    });
  } catch (error) {
    console.error("Error updating offer:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Gets the list of Offers for the logged-in user (unchanged).
 */
exports.getUserOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ receiver: req.user._id })
      .populate("sender", "firstName lastName")
      .populate("adId", "adTitle adStatus amount")
      .populate({
        path: "chat",
        populate: {
          path: "messages",
          select: "text sender timestamp", // Select only required fields
        },
      });

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

/**
 * Deletes an Offer (unchanged).
 */
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    await offer.remove();

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Get pending offers sent by the logged-in user (only for ads not created by the user)
exports.getSentOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      sender: req.user._id,
      offerStatus: "Pending"
    })
      .populate("adId", "adTitle adStatus amount createdBy")
      .populate("receiver", "firstName lastName");

    // לסנן הצעות שמופיעות על מודעות שהמשתמש עצמו פתח (לא אמורות לקרות אך לטחון למקרה)
    const filteredOffers = offers.filter(offer => 
      offer.adId && offer.adId.createdBy.toString() !== req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      count: filteredOffers.length,
      data: filteredOffers
    });
  } catch (error) {
    console.error("Error fetching sent offers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get pending offers received by the logged-in user (for ads that the user created)
exports.getReceivedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      receiver: req.user._id,
      offerStatus: "Pending"
    })
      .populate("adId", "adTitle adStatus amount createdBy")
      .populate("sender", "firstName lastName");

    // לסנן הצעות אם במקרה השולח הוא המשתמש (לא אמור לקרות)
    const filteredOffers = offers.filter(offer => 
      offer.sender && offer.sender._id.toString() !== req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      count: filteredOffers.length,
      data: filteredOffers
    });
  } catch (error) {
    console.error("Error fetching received offers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
