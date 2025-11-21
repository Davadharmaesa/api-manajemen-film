const mongoose = require('mongoose');

const directorsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    birthYear: { type: Number, required: true }
}, {timestamps: true});

const Directors = mongoose.model('Directors', directorsSchema);
module.exports = Directors;