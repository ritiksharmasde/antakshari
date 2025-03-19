let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1; // Start with Player 1

function playGame() {
    const word = document.getElementById('word-input').value.trim();
    const resultDisplay = document.getElementById('game-result');

    if (!word) {
        resultDisplay.textContent = 'Please enter a valid word!';
        return;
    }

    fetch('http://localhost:3000/game/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid Word!');
        }
        return response.json();
    })
    .then(data => {
        resultDisplay.textContent = `Valid word! Next turn.`;

        if (currentPlayer === 1) {
            player1Score += 10;
            document.getElementById('player1-score').textContent = player1Score;
            currentPlayer = 2;
            document.getElementById('turn-indicator').textContent = "Player 2's Turn";
        } else {
            player2Score += 10;
            document.getElementById('player2-score').textContent = player2Score;
            currentPlayer = 1;
            document.getElementById('turn-indicator').textContent = "Player 1's Turn";
        }

        document.getElementById('word-input').value = ''; // Clear input
    })
    .catch(error => {
        resultDisplay.textContent = error.message;
    });
}
