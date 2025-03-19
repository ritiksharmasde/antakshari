const express = require('express');
const router = express.Router();
const Word = require('../models/word');  // Word schema

// Store game state in memory (for simplicity)
let currentWord = '';
let score = 0;

// Utility Function — Get Random Word
async function getRandomWord() {
    const count = await Word.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomWord = await Word.findOne().skip(randomIndex);
    return randomWord.word;
}

// **Route 1:** Start Game
router.get('/start', async (req, res) => {
    try {
        currentWord = await getRandomWord();
        score = 0;
        res.json({
            message: 'Game started!',
            startingWord: currentWord,
            score: score
        });
    } catch (error) {
        res.status(500).json({ error: 'Error starting the game.' });
    }
});

// **Route 2:** Play Game (Submit Word)
router.post('/play', async (req, res) => {
    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: 'Please provide a word.' });
    }

    const trimmedWord = word.trim().toLowerCase();
    const isValid = await Word.findOne({ word: trimmedWord });

    if (!isValid) {
        return res.status(400).json({ 
            error: 'Invalid word! Try again.', 
            currentWord 
        });
    }

    const lastLetter = currentWord.slice(-1).toLowerCase();
    const firstLetter = trimmedWord[0].toLowerCase();

    if (firstLetter !== lastLetter) {
        return res.status(400).json({
            error: `Invalid word! Must start with '${lastLetter}'.`,
            currentWord
        });
    }

    score += trimmedWord.length;
    currentWord = await getRandomWord();

    res.json({
        message: 'Correct word!',
        nextWord: currentWord,
        score: score
    });
});


// **Route 3:** Get Current Status
router.get('/status', (req, res) => {
    res.json({
        currentWord: currentWord || 'Game not started',
        score: score
    });
});

module.exports = router;
