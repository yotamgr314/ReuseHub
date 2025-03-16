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

/**
 * Updates an Offer's status or approvals.
 * Supports direct 'Rejected' status, or flow of adOwnerApproval/userWhoMadeTheOfferApproval => 'Accepted'
 */
exports.updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      adOwnerApproval,
      userWhoMadeTheOfferApproval,
      ratings,
      offerStatus,
    } = req.body;
    
    // 1) Find the Offer and its related Ad
    const offer = await Offer.findById(id).populate("adId");
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    const ad = offer.adId;
    if (!ad) {
      return res.status(404).json({ success: false, message: "Referenced Ad not found." });
    }

    // Logs to debug who is approving and who is the sender
    console.log("🔹 The user (req.user) who is attempting to update offer:", req.user._id);
    console.log("🔹 ad.createdBy is:", ad.createdBy.toString());
    console.log("🔹 offer.sender is:", offer.sender.toString());

    // A) If request wants to set offerStatus === "Rejected"
    if (offerStatus === "Rejected") {
      offer.offerStatus = "Rejected";
      await offer.save();
      console.log("🔹 Offer is now Rejected");
      return res.status(200).json({
        success: true,
        message: "Offer rejected successfully",
        data: offer,
      });
    }

    // B) If approvals exist -> Offer becomes Accepted
    if (typeof adOwnerApproval !== "undefined") {
      offer.offerConfirmation.adOwnerApproval = adOwnerApproval;
    }
    if (typeof userWhoMadeTheOfferApproval !== "undefined") {
      offer.offerConfirmation.userWhoMadeTheOfferApproval = userWhoMadeTheOfferApproval;
    }

    // If at least one side approved -> Offer is accepted
    if (offer.offerConfirmation.adOwnerApproval || offer.offerConfirmation.userWhoMadeTheOfferApproval) {
      console.log("🔹 The user (req.user) who approved is:", req.user._id);
      console.log("🔹 offer.sender is:", offer.sender.toString());
      console.log("🔹 ad.createdBy is:", ad.createdBy.toString());

      offer.offerStatus = "Accepted";

      // Award 10 points to the sender
      const updatedSender = await User.findByIdAndUpdate(
        offer.sender,
        { $inc: { ratingPoints: 10 } },
        { new: true }
      );
      if (updatedSender) {
        await updateUserBadge(updatedSender);
      }

      // 3a) Process ratings if provided
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

      // 3b) Decrement ad.amount
      ad.amount -= offer.offerAmount;

      let noteMessage = "Note: once the offer is approved it will get auto-deleted from the system.";

      // 3d) If the ad is fully donated, complete donation flow
      if (ad.amount < 1) {
        ad.adStatus = "Donation Completed";

        // Award additional 10 points each to donor and receiver
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

        noteMessage += " As well as your Ad.";

        // Reject pending offers for this ad
        await Offer.updateMany(
          { adId: ad._id, offerStatus: "Pending" },
          { offerStatus: "Rejected" }
        );
        await Offer.deleteMany({ adId: ad._id });
        await BaseAd.findByIdAndDelete(ad._id);

        const io = req.app.get("io");
        io.to(offer.sender.toString()).emit("offerApproved", {
          offerTitle: ad.adTitle,
          receiverName: req.user.firstName + " " + req.user.lastName,
          awardedPoints: 10,
          message: `Congrats, the donation Ad Claim request "${ad.adTitle}" you sent to user ${req.user.firstName} was approved. You are awarded 10 points.`,
        });

        return res.status(200).json({
          success: true,
          message: `Donation completed; ad and related offers removed. ${noteMessage}`,
        });
      } else {
        // Donation is still active
        await ad.save();
        await offer.save();
      }

      // Emit socket event to notify the sender
      const io = req.app.get("io");
      io.to(offer.sender.toString()).emit("offerApproved", {
        offerTitle: ad.adTitle,
        receiverName: req.user.firstName + " " + req.user.lastName,
        awardedPoints: 10,
        message: `Congrats, the offer "${ad.adTitle}" sent to user ${req.user.firstName} was approved. You are awarded 10 points.`,
      });
    } else {
      // If no approvals yet, just save
      await offer.save();
    }
    
    return res.status(200).json({
      success: true,
      message: "Offer updated successfully! Note: once the offer is approved it will get auto-deleted from the system.",
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
          select: "text sender timestamp",
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

/**
 * Get pending offers sent by the logged-in user (for ads not created by the user).
 */
exports.getSentOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      sender: req.user._id,
      offerStatus: { $in: ["Pending", "Rejected"] }
    })
      .populate("adId", "adTitle adStatus amount createdBy")
      .populate("receiver", "firstName lastName")
      .populate({
        path: "chat",
        populate: { path: "messages", select: "text sender timestamp" }
      });

    // סינון edge-case: לא להציג הצעות על מודעות שהמשתמש עצמו יצר
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

/**
 * Get pending offers received by the logged-in user (for ads that the user created).
 */
exports.getReceivedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      receiver: req.user._id,
      offerStatus: "Pending"
    })
      .populate("adId", "adTitle adStatus amount createdBy")
      .populate("sender", "firstName lastName")
      .populate({
        path: "chat",
        populate: { path: "messages", select: "text sender timestamp" }
      });

    // סינון edge-case: לא להציג הצעות אם השולח הוא המשתמש עצמו
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
