const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Game Logic Route
app.post('/game/play', (req, res) => {
    console.log('Incoming Data:', req.body);  // <-- Add this for debugging
    const { word } = req.body;

    if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Invalid word submission!' });
    }

    const validWords = ['a', 'apple', 'banana', 'cat', 'dog'];
    if (validWords.includes(word.toLowerCase())) {
        res.json({ message: 'Valid word!' });
    } else {
        res.status(400).json({ error: 'Invalid Word!' });
    }
});
app.use(cors({ origin: '*' })); // <-- Add this for unrestricted access during testing

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
