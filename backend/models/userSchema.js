//backend/models/userSchema.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// NOTE: Embedded badge schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'ReuseRanger' }, 
  description: { type: String }, 
  icon: { type: String }, // URL to badge icon
  earnedAt: { type: Date, default: Date.now }, 
});


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "A user must have a first name"] },
  lastName: { type: String, required: [true, "A user must have a last name"] },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
  },
  password: { type: String, required: true },
  
  
  phone: { type: String },
  ratingPoints: { type: Number, default: 0 }, // NOTE: Used for leaderboard sorting
  badges: { 
    type: [badgeSchema], 
    default: [
      {
        name: 'ReuseRanger', 
        description: 'Default badge for new users', 
        icon: 'https://www.awicons.com/free-icons/download/application-icons/dragon-soft-icons-by-artua.com/png/512/User.png'
      }
    ] 
  },
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaseAd" }], // or do i need array of donationOffer, and a seperate array of wishlist... idk since both wishlist and donation offfer inherits from BaseAd.
  createdAt: { type: Date, default: Date.now },
});

// **Pre-save Hook** — Automatically hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password"))
    {
      return next(); // Only hash if password is new or changed
    } 
  const salt = await bcrypt.genSalt(12); // adding a generated unique string into the end of the user input password, 12 is the salting strongness, 12 is best practice imo.
  this.password = await bcrypt.hash(this.password, salt);// hashing the this newly password. 
  next();
});

//  NOTE: Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // NOTE : this reffers to the specific user document who called this method. NOTE: this.password refeeres to the hashed password stored in the DB.
};
// NOTE: bcrypt.compare() its an bycript API method, it takes the plain password, rehashes it using the same salt from the stored password, and compares the two hashes (the one in the DB and the newly hashed input password.)


module.exports = mongoose.model("User", userSchema);

