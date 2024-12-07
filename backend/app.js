//IMPORTS SECTION
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db.js");

const userRouter = require("./routes/user.routes.js");
const donationAdRouter = require("./routes/donation.ad.routes.js");

// NEW
const adsRouter = require("./routes/ads.routes.js");

//CONFIGURATION SECTION
dotenv.config(); /*Load environment variables from .env file  */

connectDB(); /*NOTE: calls a function which establish the connection to our mongoDB database */

const app =
  express(); /*NOTE calls express constructor, via its instance we will gain access to many express framework methods related to creating a web app,
                         for example: 
                         01) restfull API request routes such as : app.get/POST/DELETE/PUT 
                         02) accessing request parameters such as : req parameters such as : req.param.id, req.query.name, req.body.
                         03) define middlewares such as: app.use(express.json()), app.use(cors()).
                         04) handling static files such as : app.use('/static',express.static('pbulic')).
                         05) error handling such as : app.use((err,req,res,next))
                                         
*/

//MIDDLEWARES SECTION
app.use(
  cors()
); /* NOTE :CORS is a security mechanism implemented by browsers to restrict how resources on a web page can be requested from another domain. 
                    By default, browsers block requests made to a server from a different origin (protocol, domain, or port) than the one hosting the web page.
                    for example:
                    If your frontend is deployed one domain e.g., Render and my backend (Express server) is deployed on another domain - e.g. my college server, the browser will block requests made to your API unless CORS is enabled.
                */

app.use(express.json()); // NOTE This middleware parses incoming JSON payloads from the request body and makes them accessible via req.body. It's essential for handling POST or PUT requests where the client sends data in JSON format.

//ROUTES SECTION
app.use("/api/users", userRouter);
app.use("/api/donationAds", donationAdRouter);
app.use("/api/ads", adsRouter); // NOTE: a combined route for combined requests of donations and wishlists.

app.get("/", (req, res) => {
  // NOTE Default route - must always be the last route or else all the requests will enter him.
  // because once request has hit the server, it will enter the first route which fits to him.
  // hense: if two rights fits - needs to mannage it via middleware.

  res.send("Welcome to the Distributed Cloud Services API");
});

module.exports = app; // Change 'export default' to 'module.exports'
