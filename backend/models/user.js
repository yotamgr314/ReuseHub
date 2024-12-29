// Import of necessary modules
const { Schema, model } = require('mongoose');
const { badgeSchema } = require('./badge');
const { wishlistSchema } = require('./wishlist');
const Ad = require('./ad');

// Schema of user
const userSchema = new Schema({

  // First name of user, added during registration
  firstName: { type: String, required: true },

  // Last name of user, added during registration
  lastName: { type: String, required: true },

  // Email of user, used to sign in into platform
  email: { type: String, required: true },

  // Pasword of user, stored in encrypted format
  password: { type: String, required: true },

  // Phone number of user (Not required)
  phoneNumber: { type: String },

  // List of badges obtained by user
  badges: { type: [badgeSchema], default: [], required: true },

  // List of Donation Ads created by user
  ads: { type: [Ad], default: [], required: true },

  // List of Wishlist Ads created by user
  wishlist: { type: [wishlistSchema], default: [], required: true },

  // Rating, representing activity of user on platform
  rating: { type: Number, default: 0, required: true },

  // Date of user's account creation
  registrationDate: { type: Date, default: Date.now, required: true }

}, { collection: 'users', strict: true });

const User = model('User', userSchema);

module.exports = User;