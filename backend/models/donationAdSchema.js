const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");
const itemSchema = require("./itemSchema");

const donationAdSchema = new mongoose.Schema({
  items: [
    {
      type: itemSchema,
      validate: {
        validator: function (items) {
          return items.every((item) => item.itemType === "DonationAd"); // Ensure all items have itemType as "DonationAd"
        },
        message: "All items must have itemType 'DonationAd'.",
      },
    },
  ],
  claimRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ClaimRequest" },
  ],
});

const DonationAd = baseAdSchema.discriminator('DonationAd', donationAdSchema); // 🔥 Use BaseAd.discriminator
module.exports = DonationAd;

// const mongoose = require('mongoose');

// const donationAdSchema = new mongoose.Schema({
//   name: {
//      type: String,
//       required: true
//     },
//   description: {
//     type: String
//     },
//   images: [
//     {
//         type: String // URLs for images.
//     }
//     ],
//   condition: {
//     type: String,
//     enum: ['Like New', 'Gently Used', 'Heavily Used'],
//     required: true
//     },
//   category: {
//     type: String,
//     required: true
//     },
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], required: true } // [longitude, latitude] for google maps API.
//   },
//   status: {
//     type: String,
//     enum: ['Available', 'Claimed', 'Donated'],
//     default: 'Available'
//     },
//   donor: {   /* NOTE: EXPLAINED DOWNSTAIRS */
//     type: mongoose.Schema.Types.ObjectId, /* objectId is an a unique identefifer generated automaticly by MongoDB. */
//     ref: 'User', /* ref is Mongo'sDB foreign key - Links a field in one document to another document in a different collection by storing the ObjectId of the related document
//                     later on it will allow easier querries by providing the population(); funcionality.
//                     for example:
//                     01) Replaces the ObjectId stored in a ref field with the full document from the referenced collection.
//                         which it will allow to access all the fields of the references Donor user without the need to manually write join querries!!  */
//     required: true
//     },
//   createdAt: {
//     type: Date,
//     default: Date.now }
// },
// {
//   collection: 'donationAds', // Specify the collection name explicitly.
// }

// );

// donationAdSchema.index({ location: '2dsphere' }); /* NOTE: EXPLAINED DOWNSTAIRS. */

// const DonationAd = mongoose.model('DonationAd', donationAdSchema); // Define the model.

// module.exports = DonationAd; // Export the model.

/* NOTE: Geospatial index in MONGODB:
WHY USE it - Simplicity: MongoDB’s built-in geospatial capabilities reduce the complexity of implementing location-based features.
To make geospatial queries work, i must create a geospatial index. In MongoDB, this is done using the 2dsphere index:

NOTE: A geospatial index is mongoDB way to organizes geographic data in a way that allows MongoDB to efficiently search for it. 
For example:
 efficient geospatial queries.
It enables MongoDB to quickly find and sort geographic data (e.g., latitude and longitude) for operations like proximity searches.
type examples of Gespatial indexes in MongoDB: 
01) 2dsphere Index - used for: 
    01) Used for data stored in GeoJSON format.
    02) Supports advanced geospatial queries, such as finding points near a given location or within a specific geometry.
02) 2d Index - used for: 
    01) Used for legacy geospatial data stored in simple arrays.
    02) Works only with flat, 2D Cartesian coordinates (not spherical).


NOTE: Geospatial  Queries
Geospatial queries are operations that allow you to work with geographic data in a database. These queries enable you to:
for example:
01) Find locations near a specific point (e.g., "Find all donation ads within 5 kilometers of my current location").
02) Find locations within a specific area (e.g., "Find all donation ads in a particular city or polygon").
03) Sort results by proximity (e.g., "Show the closest donation ads first"). 

examples of Geospatial queries syntax: 
$near: -Find Locations Near a Point:
$geoWithin: Find Locations Within an Area: Find documents inside a specific polygon or circle 
$nearSphere - Sort by Proximity, it Sort documents by their distance from a specific point 

*/
