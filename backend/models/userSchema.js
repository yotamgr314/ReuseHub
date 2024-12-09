const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Badge name (e.g., Top Donor, Eco Warrior)
  description: { type: String }, // Short description of what the badge represents
  icon: { type: String }, // URL to badge icon
  earnedAt: { type: Date, default: Date.now }, // When the badge was earned
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A user must have a name"] },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
  },
  password: { type: String, required: true },
  profilePicture: { type: String }, // URL to the user's profile picture
  phone: { type: String },
  ratingPoints: { type: Number, default: 0 }, // Used for leaderboard sorting
  badges: [badgeSchema], // **List of embedded badges**
  createdAt: { type: Date, default: Date.now },
});

// **Pre-save Hook** — Automatically hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new or changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  **Method to compare password**
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'A user must have a name']
//     },
//     email: {
//         type: String,
//         required: [true, 'A user must have an email'],
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//     },
//     profilePicture: {

//         type: String /* for the url containing the photo */
//     },
//     phone: {
//         type: Number
//     },
//     ratingPoints: {

//         type: Number,
//         default: 0
//     },
//     badges: [
//         {
//             name: {
//                 type: String,
//                 required: true
//             },
//             description: {
//                 type: String
//             },
//             icon: {
//                 type: String /* for the url containing the badge icon */
//             },
//             earnedAt: {
//                 type: Date,
//                 default: Date.now
//             }
//         }

//     ],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },

// }, {collection:'users'});

// const User = mongoose.model('User', userSchema); // Define the model.

// module.exports = User; // Export the model.
