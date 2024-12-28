// Import of necessary modules
const { Schema, model, Types } = require('mongoose');
const { categoryEnum, conditionEnum } = require('./enum');
const { locationSchema } = require('./location')


// Schema for ad, that can be created by user (Donation Ad and Wishlist Ad)
const adSchema = new Schema({

  // Type of donation (Donation Ad is 0, Wishlist Ad is 1)
  adType: { type: Boolean, requred: true },

  // ID of user that created ad (referencing the 'User' model)
  userId: { type: Types.ObjectId, required: true, ref: 'User' },

  // Title of the ad containing the name of the item specified in it
  title: { type: String, requred: true },

  // Short description of the item
  description: { type: String, requred: true },

  // Category of the item (must be one of the values in categoryEnum from 'enum.js')
  category: { type: String, enum: categoryEnum, requred: true },

  // Condition of the item (must be one of the values in conditionEnum from 'enum.js')
  condition: { type: String, enum: conditionEnum, requred: true },

  // Location schema storing 2 coordinates: x-axis and y-axis
  location: { type: locationSchema, requred: true },

  // List of image URLs associated with ad (default is an empty array)
  images: { type: [String], default: [] },

  // Date when the ad was created
  creation_date: { type: Date, default: Date.now, requred: true }

}, { collection: 'ads', strict: true });

const Ad = model('Ad', adSchema);

module.exports = Ad;