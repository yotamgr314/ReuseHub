const userModel = require("../models/userSchema"); 

exports.createUser = async (req, res) => {
  try {
    // Destruct the request body parameters
    const { name, email, password, phone } = req.body;

    // VALIDATE REQUIRED FIELDS ARE BEING SENT
    if (!name) {
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

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (phone && isNaN(phone)) {
      return res.status(400).json({ message: "Phone number must be a valid number" });
    }

    // INPUT VALIDATOR
    const existingUser = await userModel.findOne({ email }); // findOne is a builtIn mongoose function.
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // CONSTRUCTING THE USER INSTANCE.
    const user = new userModel({
      name,
      email,
      password, // The password will be hashed by the pre-save hook in the schema
      phone
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Return a successful response
    res.status(201).json({
      success: true,
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        ratingPoints: savedUser.ratingPoints,
        badges: savedUser.badges,
        createdAt: savedUser.createdAt
      }
    });

  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
