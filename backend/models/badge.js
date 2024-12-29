// Import of necessary modules
const { Schema } = require('mongoose');


// Schema of badge obtained by user
const badgeSchema = new Schema({

    // Name of badge
    name: { type: String, required: true },

    // Short description explaining condition of receiving a badge
    description: { type: String, required: true },

    // URL to icon image stored in string format
    icon: { type: String, required: true },

    // Date of badge obtainment by specific user
    earned: { type: Date, default: Date.now, required: true }

}, { _id: false, strict: true });

module.exports = badgeSchema;