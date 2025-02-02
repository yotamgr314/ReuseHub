const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// NOTE: Embedded badge schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "ReuseRanger" },
  description: { type: String },
  icon: { type: String }, // URL to badge icon
  earnedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "A user must have a name"] },

  lastName: { type: String, required: [true, "A user must have a lastName"] },

  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
  },

  password: { type: String, required: true },

  phone: { type: String },

  ratingPoints: { type: Number, default: 0 },

  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaseAd" }], // Wishlist and Donation Ads included

  badges: {
    type: [badgeSchema],
    default: [
      {
        name: "ReuseRanger",
        description: "Default badge for new users",
        icon: "https://www.awicons.com/free-icons/download/application-icons/dragon-soft-icons-by-artua.com/png/512/User.png",
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

// **Pre-save Hook** — Automatically hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  NOTE: Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // NOTE : this reffers to the specific user document who called this method. NOTE: this.password refeeres to the hashed password stored in the DB.
};

module.exports = mongoose.model("User", userSchema);
