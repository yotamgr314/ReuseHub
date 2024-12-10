const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const protectMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))  // NOTE: checks if the authenticate header exists. 
 {                                                                                  // NOTE: Authorization header looks like that: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    try {
      token = req.headers.authorization.split(' ')[1]; // NOTE: parsing the JWT token. 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // NOTE: a JWT api method which decodes some of the components the JWT token was built from, aka user email, and algorithem used to hash, and more..
      req.user = await User.findOne({email: decoded.email}).select('-password'); // NOTE: excludes the user password from the response.
      next(); // NOTE: super important - continuing with the next router / middleware it was called upon. 
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = protectMiddleware;
