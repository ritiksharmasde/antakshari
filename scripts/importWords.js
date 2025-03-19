const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Word = require('../models/word');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Word Import Logic
async function importWords() {
    const wordFilePath = path.join(__dirname, 'words_alpha.txt'); // Add your downloaded file here
    const wordList = fs.readFileSync(wordFilePath, 'utf8').split('\n');

    const wordsToInsert = wordList.map(word => ({
        word: word.trim().toLowerCase(),
        length: word.trim().length
    })).filter(entry => entry.word); // Remove empty entries

    try {
        await Word.insertMany(wordsToInsert, { ordered: false });
        console.log(`Successfully imported ${wordsToInsert.length} words.`);
    } catch (error) {
        console.error('Error importing words:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Run the import script
importWords();
