const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Embedded badge schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "ReuseRanger" },
  description: { type: String, maxlength: 200 },
  icon: { type: String, match: /^https?:\/\/.*\.(jpg|jpeg|png|svg)$/i },
  earnedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: true, minlength: 5 },
    profilePic: { type: String, default: "" }, // NEW field for profile picture URL
    ratingPoints: { type: Number, default: 0, min: 0 },
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaseAd" }],
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
  },
  { timestamps: true }
);

// Pre-save hook for hashing the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
