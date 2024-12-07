// const donationMongooseAdModel = require('../models/donation.ad.model.js');

// // CREATES DONATION AD.
// exports.createDonationAd = async(req,res) => {
//     try{
//         const newDonationAd = await donationMongooseAdModel.create(req.body);
//         res.status(201).json(newDonationAd); // Respond with the saved user as json file.

//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         });
//     }
// };

// // GET ALL THE DONATION ADS.
// exports.getDonationAds = async(req, res) => {
//     try{
//         const donationAds = await donationMongooseAdModel.find();
//         if(donationAds.length == 0) {
//             return res.status(200).json([]);
//         }

//         res.status(200).json(donationAds);

//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         });
//     }
// };

// // DELETE A DONATION AD BY ITS ID.
// exports.deleteDonationAdById = async(req, res) => {
//     try{
//         const donationAdToDelete = await donationMongooseAdModel.findById(req.params.id);

//         if (!donationAdToDelete) {
//             return res.status(404).json({
//                 message: `Donation Ad with the following ID was not found: ${req.params.id}`
//             });
//         }

//         await donationMongooseAdModel.findByIdAndDelete(req.params.id); /* NOTE : built in mongoose method which deletes from DB by ID. */

//         res.status(200).json({
//             message: `Donation Ad with ID ${req.params.id} was successfully deleted`
//         });

//     } catch(err) {
//         res.status(500).json({ message: `Server error: ${err.message}` });
//     }
// };

// // GET A DONATION AD BY ITS ID.
// exports.getDonationAdById = async (req, res) => {
//     try {
//         const donationAd = await donationMongooseAdModel.findById(req.params.id);

//         // If no donation ad is found, return a 404 response
//         if (!donationAd) {
//             return res.status(404).json({
//                 message: `Donation Ad with ID ${req.params.id} was not found`,
//             });
//         }

//         // Return the found donation ad with a 200 status
//         res.status(200).json(donationAd);
//     } catch (err) {
//         // Catch and handle any server errors
//         res.status(500).json({
//             message: `Server error: ${err.message}`,
//         });
//     }
// };
