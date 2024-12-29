// Import of necessary modules
const { Schema } = require('mongoose');


// Location schema storing 2 coordinates: x-axis and y-axis
const locationSchema = new Schema({

    // X-axis coordinate
    x: { type: Number, requred: true },

    // Y-axis coordinate
    y: { type: Number, requred: true }

    // Tuning off auto creation of ID
}, { _id: false, strict: true });

module.exports = locationSchema;