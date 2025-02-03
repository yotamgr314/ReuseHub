const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const protectMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))  // NOTE: checks if the authenticate header exists, (Authorization header looks like that: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)
  {
    try {
      token = req.headers.authorization.split(' ')[1]; // NOTE: parsing the JWT token. 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //a JWT api method which decodes some of the components the JWT token was built from, aka user email..


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
