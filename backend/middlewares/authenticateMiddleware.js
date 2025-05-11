// backend/middlewares/authenticateMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const protectMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
  {
    try {
      token = req.headers.authorization.split(' ')[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 


      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user)
      {
        console.log("User not found in database.");
        return res.status(401).json({ message: "User not found, authentication failed." });
      }

      next();
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log("No token found in request headers.");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protectMiddleware;