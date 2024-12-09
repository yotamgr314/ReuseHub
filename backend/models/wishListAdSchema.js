const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");
const itemSchema = require("./itemSchema");

const wishlistAdSchema = new mongoose.Schema({
  items: [
    {
      type: itemSchema,
      validate: {
        validator: function (items) {
          return items.every((item) => item.itemType === "WishlistAd"); // Ensure all items have itemType as "WishlistAd"
        },
        message: "All items must have itemType 'WishlistAd'.",
      },
    },
  ],
  urgency: { type: String, enum: ["Low", "Medium", "High"] }
});

const WishlistAd = baseAdSchema.discriminator('WishlistAd', wishlistAdSchema); // 🔥 Use BaseAd.discriminator
module.exports = WishlistAd;



// WishListAdSchema.index({
//   location: "2dsphere",
// }); /* NOTE: EXPLAINED DOWNSTAIRS. */

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
