const donationAdModel = require("../models/donationAdSchema"); 


exports.createDonationAd = async(req,res) => {

    try{

    }catch(err) {
        const newDonationAd = new donationAdModel(req.body); // creates a donation ad object with the given parameters from the body request.
        const savedDonationAD = await newDonationAd.save(); // saves the newly donation ad into the database using mongoose functions.
        
        // FIRING EMIT SECTION
    

    }
}













