const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' })); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true }
});
const Word = mongoose.model('Word', wordSchema);

let lastWord = null; 
app.post('/game/play', async (req, res) => {
    console.log('Incoming Data:', req.body);  

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Empty request body!' });
    }

    const { word } = req.body;
    console.log('Received Word:', word); 

    if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Invalid word submission!' });
    }

    try {
        const foundWord = await Word.findOne({ word: word.toLowerCase() });

        if (!foundWord) {
            return res.status(400).json({ error: 'Invalid Word! Not in database.' });
        }

        if (lastWord && lastWord.slice(-1).toLowerCase() !== word[0].toLowerCase()) {
            return res.status(400).json({ error: 'Word does not follow Antakshari rules!' });
        }

        lastWord = word.toLowerCase();
        return res.json({ message: 'Valid word!', nextStartLetter: lastWord.slice(-1) });

    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Server error!' });
    }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
