const jwt = require('jsonwebtoken');

const generateToken = (emailAddress) => // generates the token that the backend will send the frontend upon login. 
{
  return jwt.sign( { emailAddress }, process.env.JWT_SECRET, { expiresIn: '1h', }); // NOTE: 01) generates a JWT token that contains payload (user data) and a secret key. NOTE: his token can be sent to the client (usually in a login response) and later verified to confirm the user's identity.
                                                                          // NOTE: 02) JWT token will automatically expire in 1 hour. NOTE - general syntax is jwt.sing(payload,secretKeyDefinedIn.envFile,optionalSetting,callbackFunction)
};                                                                        // NOTE: 03) The Payloard parameter aka the id is encoded and can be read by anyone with access to the token - use only non-sensitive data here like user id / roles / premission.
module.exports = generateToken;
