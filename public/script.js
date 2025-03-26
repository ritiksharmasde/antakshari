let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let timer;
const timerDuration = 30;

function startTimer() {
    let timeLeft = timerDuration;
    document.getElementById('timer-text').textContent = `${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            declareWinner();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function declareWinner() {
    const resultDisplay = document.getElementById('game-result');
    if (player1Score > player2Score) {
        resultDisplay.textContent = "Player 1 Wins!";
    } else if (player2Score > player1Score) {
        resultDisplay.textContent = "Player 2 Wins!";
    } else {
        resultDisplay.textContent = "It's a Tie!";
    }
    document.getElementById('word-input').disabled = true;
}

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
    .then(response => response.json())
    .then(data => {
        if (data.message) {
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
            resetTimer();
        } else {
            resultDisplay.textContent = data.error;
        }

        document.getElementById('word-input').value = '';
    })
    .catch(error => {
        resultDisplay.textContent = 'An error occurred!';
    });
}

startTimer();
