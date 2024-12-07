// const DonationAd = require('../models/donation.ad.model.js');
// const WishListAd = require('../models/wishlist.ad.model.js');

// exports.getAllAds = async (req, res) => {
//   try {
//     // Fetch donation ads and populate donor details
//     const donationAds = await DonationAd.find().populate('donor', 'name email');

//     // Fetch wishlist ads and populate donor details
//     const wishlistAds = await WishListAd.find().populate('donor', 'name email');

//     // Combine ads with a `type` field to distinguish them
//     const combinedAds = [
//       ...donationAds.map((ad) => ({ ...ad.toObject(), type: 'donation' })),
//       ...wishlistAds.map((ad) => ({ ...ad.toObject(), type: 'wishlist' })),
//     ];

//     res.status(200).json(combinedAds);
//   } catch (err) {
//     res.status(500).json({ message: `Server error: ${err.message}` });
//   }
// };
