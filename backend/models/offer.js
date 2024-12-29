// Import of necessary modules
const { Schema, model, Types } = require('mongoose');
const { messageSchema } = require('./message');
const { statusEnum } = require('./enum');


// Schema of offer between two users about specific ad
const offerSchema = new Schema({

    // ID of user that want to donate an item
    donorId: { type: Types.ObjectId, ref: 'User', required: true },

    // ID of user that want to receive an item
    recipientId: { type: Types.ObjectId, ref: 'User', required: true },

    // ID of ad that contains item of interest
    adId: { type: Types.ObjectId, ref: 'Ad', required: true },

    // Status of the offer (must be one of the values in statusEnum from 'enum.js')
    status: { type: String, enum: statusEnum, requred: true },

    // List of messages send by both users in chat
    chat: { type: [messageSchema], default: [], required: true },

    // The date on which users scheduled an appointment
    appointment: { type: Date},

    // Deate of the offer creation
    creationDate: { type: Date, default: Date.now, required: true }

}, { collection: 'offers', strict: true });

const Offer = model('Offer', offerSchema);

module.exports = Offer;