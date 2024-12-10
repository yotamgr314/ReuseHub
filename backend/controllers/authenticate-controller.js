const userModel = require("../models/userSchema"); 
const generateToken = require('../utils/jwt-token-generate');

//  Register new user
exports.registerUser = async (req, res) => {
  // destructing parameters from the req.body
  const { name, email, password } = req.body;

  // check if user exists.
  const userExists = await userModel.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // constructing a new user.
  const user = new userModel({ name, email, password });
  const savedUser = await user.save();

  res.status(201).json({ 
    id: savedUser._id, 
    name: savedUser.name, 
    email: savedUser.email, 
    token: generateToken(savedUser.email) // calls the generateToken function we imported from jwt-token-generate.js, this function returns a JWT token, and then we send it to the frontend.
  });
};



// LOGIN METHOD 
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await userModel.findOne({ email });
    
    if (user && (await user.matchPassword(password))) { 
      res.json({ 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        token: generateToken(user.email) // sends the JWT token to the frontend after a successful user registration.
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  };
  