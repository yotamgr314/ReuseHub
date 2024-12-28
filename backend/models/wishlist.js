// Import of necessary modules
const { Schema, model, Types } = require('mongoose');
const Ad = require('./ad')


// Wishlist of specific user
const wishlistSchema = new Schema({

    // ID of wishlist owner user
    userId: { type: Types.ObjectId, required: true, ref: 'User' },

    // List of ads created by user for wishlist (default is an empty array)
    ads: { type: [Ad], required: true, default: [] }

    // Tuning off auto creation of ID
}, { _id: false, strict: true });

module.exports = wishlistSchema;