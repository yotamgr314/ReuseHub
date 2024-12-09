const donationAdModel = require("../models/donationAdSchema"); 


exports.createDonationAd = async(req,res) => {
    try{
        // NOTE: INPUT VALIDATION.
        const { title, description, location, createdBy, items, claimRequests } = req.body; // NOTE: destructing required key values from the req.body.

        if(!title)
        {
            return res.status(400).json({message: "Title eis required"});
        }

        if(!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) 
        {
            return res.status(400).json({message: "Invalid coordinates. Must be an array with exactly 2 numbers [longitude, latitude]." });
        }


        // NOTE: CONSTRUCTING A DONATION AD WITH EXPLICIT PARAMETERS VALUES USING THE "NEW" MONGOOSE SAVED WORD
        const newDonationAd = new donationAdModel({title: title, description: description, location: location, createdBy: createdBy, items: items,});
          

        // NOTE SAVING THE AD INTO THE DB USING MONGOOSE "SAVE" SAVED WORD.
        const savedDonationAD = await newDonationAd.save(); // saves the newly donation ad into the database using mongoose functions.
        
        // NOTE SOCKET.IO EVENT EMITTING.
        const io = req.app.get("io"); // access socket.io instance stored in the app object. 
        io.emit("donationAdCreated", savedDonationAD); // firing a websocket event called donationAdCreated to all connected clients, and the donation ad constructed object.

        res.status(201).json({ success: true, data: savedDonationAd }); // sending a successful response to the frontend.
       

    }catch(error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


module.exports = {createDonationAd};













