const DonationAd = require("../models/donationAdSchema");

// ✅ Create a new donation ad
exports.createDonationAd = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    const { adTitle, adDescription, category, items, donationMethod, itemCondition, location } = req.body;

    if (!adTitle) return res.status(400).json({ success: false, message: "Ad title is required." });
    if (!adDescription) return res.status(400).json({ success: false, message: "Ad description is required." });
    if (!category) return res.status(400).json({ success: false, message: "Category is required." });
    if (!donationMethod) return res.status(400).json({ success: false, message: "Donation method is required." });
    if (!itemCondition) return res.status(400).json({ success: false, message: "Item condition is required." });
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: "At least one item is required." });

    // ✅ Validate location coordinates (longitude, latitude)
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Location must include coordinates as [longitude, latitude]." });
    }

    // ✅ Validate that all items are identical
    const referenceItem = items[0];
    const areItemsIdentical = items.every(item =>
      item.name === referenceItem.name &&
      item.description === referenceItem.description &&
      JSON.stringify(item.images) === JSON.stringify(referenceItem.images)
    );
    if (!areItemsIdentical) return res.status(400).json({ success: false, message: "All items in the donation must be identical." });

    // ✅ Create a new donation ad
    const newAd = new DonationAd({
      adTitle,
      adDescription,
      category,
      items,
      donationMethod,
      itemCondition,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      createdBy: req.user._id,
    });

    await newAd.save();

    res.status(201).json({
      success: true,
      message: "Donation ad created successfully",
      data: newAd,
    });
  } catch (error) {
    console.error("Error creating donation ad:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

