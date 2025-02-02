//IMPORTS MODELS SECTION.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db.js");

// IMPORT CONTROLLERS SECTION.
const adController = require("../controllers/ad-controller");
const wishAdController = require("../controllers/wishAd-controller");
const donationAdController = require("../controllers/donationAd-controller");
const offerController = require("../controllers/offer-controller");
const userController = require("../controllers/user-controller");
const authController = require("../controllers/authenticate-controller");
const chatController = require("../controllers/chat-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

//CONFIGURATION SECTION
dotenv.config(); /*Load environment variables from .env file  */

connectDB(); /*NOTE: calls a function which establish the connection to our mongoDB database */

const app =express(); /*NOTE calls express constructor, via its instance we will gain access to many express framework methods related to creating a web app,
                         for example: 
                         01) restfull API request routes such as : app.get/POST/DELETE/PUT 
                         02) accessing request parameters such as : req parameters such as : req.param.id, req.query.name, req.body.
                         03) define middlewares such as: app.use(express.json()), app.use(cors()).
                         04) handling static files such as : app.use('/static',express.static('pbulic')).
                         05) error handling such as : app.use((err,req,res,next))
                                         
*/
//MIDDLEWARES SECTION
app.use(cors()); /* NOTE :CORS is a security mechanism implemented by browsers to restrict how resources on a web page can be requested from another domain. 
                    By default, browsers block requests made to a server from a different origin (protocol, domain, or port) than the one hosting the web page.
                    for example:
                    If your frontend is deployed one domain e.g., Render and my backend (Express server) is deployed on another domain - e.g. my college server, the browser will block requests made to your API unless CORS is enabled.
                */
app.use(express.json());// NOTE This middleware parses incoming JSON payloads from the request body and makes them accessible via req.body. It's essential for handling POST or PUT requests where the client sends data in JSON format.


// General ADS routes.
router.get("api/ads", adController.getAllAds); // http://localhost:3000/
router.get("api/ads/map", adController.getAdsForMap);
router.get("api/ads/:id", adController.getAdById);
router.delete("api/ads/:id", authenticateMiddleware, adController.deleteAd);
router.put("api/ads/:id", authenticateMiddleware, adController.updateAd);


// wishedAd routes
router.get("api/wishAds", wishAdController.getAllWishAds);
router.get("api/wishAds/user/:userId", wishAdController.getWishAdsByUser);
router.post("api/wishAds", authenticateMiddleware, wishAdController.createWishAd);
router.put("api/wishAds/:id", authenticateMiddleware, wishAdController.updateWishAd);
router.delete("api/wishAds/:id", authenticateMiddleware, wishAdController.deleteWishAd);


// donationAd routes
router.get("api/donations", donationAdController.getAllDonationAds);
router.get("api/donations/user/:userId", donationAdController.getDonationAdsByUser);
router.post("api/donations", authenticateMiddleware, donationAdController.createDonationAd);
router.put("api/donations/:id", authenticateMiddleware, donationAdController.updateDonationAd);
router.delete("api/donations/:id", authenticateMiddleware, donationAdController.deleteDonationAd);

// offer Routes
router.get("api/offers/user/:userId", offerController.getOffersForUser);
router.post("api/offers", authenticateMiddleware, offerController.createOffer);
router.put("api/offers/:id/status", authenticateMiddleware, offerController.updateOfferStatus);
router.delete("api/offers/:id", authenticateMiddleware, offerController.deleteOffer);


// chat routes
router.post("api/offers/:id/chat", authenticateMiddleware, chatController.addChatMessage);
router.get("/offers/:id/chat", authenticateMiddleware, chatController.getChatHistory);

// leaderboard routes
router.get("api/leaderboard", userController.getLeaderboard);
router.get("api/leaderboard/badge/:badgeName", userController.getUsersByBadge);
router.post("api/users/rate", authenticateMiddleware, userController.rateUser);


// Authenticate && user management routes
router.post("api/auth/register", authController.register);
router.post("api/auth/login", authController.login);
router.get("api/users/:id", authenticateMiddleware, userController.getUserById);
router.put("api/users/:id", authenticateMiddleware, userController.updateUser);
router.delete("api/users/:id", authenticateMiddleware, userController.deleteUser);



app.get("/", (req, res) => {
  res.send("Welcome to the ReuseHub project API");
});

module.exports = app;
