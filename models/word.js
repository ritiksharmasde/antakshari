const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    length: { type: Number, required: true }
});

module.exports = mongoose.model('Word', wordSchema);
