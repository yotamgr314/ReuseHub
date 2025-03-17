// backend/controllers/authenticateController.js
const UserModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: "first name is required." });
    }
    if (!lastName) {
      return res.status(400).json({ message: "last name is required." });
    }
    if (!email) {
      return res.status(400).json({ message: "email is required." });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 5) {
      return res.status(400).json({ message: "Password must be at least 5 characters long." });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create the new user; if a file was uploaded, use its file path for profilePic
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password,
      profilePic: req.file ? "/uploads/" + req.file.filename : "",
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) 
    {
      return res.status(400).json({ message: "password is required." });
    }

    if(!email)
    {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user)
    {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
    {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};