const express = require('express');

const donationAdController = require('../controllers/donation-ad-controller.js');

const donationRouter = express();/*NOTE calls express constructor, via its instance we will gain access to many express framework methods related to creating a web app,
                                    for example: 
                                    01) restfull API request routes such as : app.get/POST/DELETE/PUT 
                                    02) accessing request parameters such as : req parameters such as : req.param.id, req.query.name, req.body.
                                    03) define middlewares such as: app.use(express.json()), app.use(cors()).
                                    04) handling static files such as : app.use('/static',express.static('pbulic')).
                                    05) error handling such as : app.use((err,req,res,next))  */

// ROUTES SECTION
donationRouter.post('/', donationAdController.createDonationAd);  // POST/api/donationAds - create a donation ad.
// donationRouter.get('/:id', donation-ad-controller.getDonationAdById); // GET/api/donationAds - get an Ad by its id.
// donationRouter.delete('/:id', donation-ad-controller.deleteDonationAdById);  // DELETE/api/donation-ad-controller - delete a donation Ad by its id.

module.exports = donationRouter;
