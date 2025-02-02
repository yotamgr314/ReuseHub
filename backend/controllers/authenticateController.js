const UserModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body; // destruct the parameters from the request body.

    // body parameters validation
    if (!firstName) {
        return res.status(400).json({ message: "Name is required" });
      }

    if (!lastName) {
        return res.status(400).json({ message: "Name is required" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 5) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

    if (phone && isNaN(phone)) {
        return res.status(400).json({ message: "Phone number must be a valid number" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }



    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // constructing the user instance.
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return a successful response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT Token
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
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
