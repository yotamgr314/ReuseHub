// Import of necessary modules
const { Schema } = require('mongoose');


// Schema of messages send in chat
const messageSchema = new Schema({

    // ID of user that send specific message
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    
    // Text content of message
    text: { type: String, required: true}

    // Tuning off auto creation of ID
}, { _id: false, strict: true });

module.exports = messageSchema;