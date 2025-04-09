// Matching Game for Rock Correlation
// This is a standalone version that doesn't rely on external functions

function initializeMatchingGame(gameContainer) {
    console.log('Matching Game initializing...');
    
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    // Game state
    let score = 0;
    let timeLeft = 60;
    let gameActive = false;
    let timer;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let totalPairs = 6;
    
    // Create game UI
    function createGameUI() {
        // Clear existing content
        gameContainer.innerHTML = '';
        
        // Add game styles
        const gameStyles = document.createElement('style');
        gameStyles.textContent = `
            .game-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .game-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 15px 0;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 8px;
            }
            .game-board {
                position: relative;
                margin: 20px 0;
                border: 2px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                background-color: #f9f9f9;
                padding: 20px;
            }
            .memory-game {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                perspective: 1000px;
            }
            .memory-card {
                height: 120px;
                position: relative;
                transform-style: preserve-3d;
                transform: scale(1);
                transition: transform 0.5s;
                cursor: pointer;
            }
            .memory-card.flip {
                transform: rotateY(180deg);
            }
            .memory-card.matched {
                transform: rotateY(180deg) scale(0.95);
                opacity: 0.8;
                cursor: default;
            }
            .front-face, .back-face {
                width: 100%;
                height: 100%;
                padding: 10px;
                position: absolute;
                border-radius: 8px;
                backface-visibility: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
            }
            .front-face {
                transform: rotateY(180deg);
                background-color: #FF5722;
                color: white;
            }
            .back-face {
                background-color: #0A75BC;
                color: white;
                border: 3px solid #FF5722;
            }
            .game-info {
                padding: 15px;
                background-color: #fff;
                border-top: 1px solid #ddd;
                margin-top: 20px;
                text-align: center;
            }
            .game-message {
                text-align: center;
                padding: 10px;
                margin-top: 10px;
                border-radius: 4px;
            }
            .game-message.correct {
                background-color: #e8f5e9;
                color: #2e7d32;
            }
            .game-message.wrong {
                background-color: #ffebee;
                color: #c62828;
            }
            .game-footer {
                margin-top: 20px;
                text-align: center;
            }
            .theme-text {
                font-style: italic;
                color: #666;
            }
            .game-results {
                margin-top: 15px;
                padding: 15px;
                background-color: #f5f5f5;
                border-radius: 8px;
                display: none;
            }
            .game-results.active {
                display: block;
            }
        `;
        gameContainer.appendChild(gameStyles);
        
        // Create game header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <h3>Rock Layer Matcher</h3>
            <p>Match the rock layers with their descriptions in this NY Mets themed memory game!</p>
            <div class="game-controls">
                <div class="score">Score: <span id="score">0</span></div>
                <div class="timer">Time: <span id="time-left">60</span>s</div>
                <button id="start-game" class="btn btn-primary">Start Game</button>
            </div>
        `;
        gameContainer.appendChild(header);
        
        // Create game board
        const gameBoard = document.createElement('div');
        gameBoard.className = 'game-board';
        gameBoard.innerHTML = `
            <div class="memory-game" id="memory-game">
                <!-- Cards will be added here -->
            </div>
            <div class="game-info">
                <div id="game-message" class="game-message">Click Start to begin the game</div>
            </div>
        `;
        gameContainer.appendChild(gameBoard);
        
        // Create game footer with NY Mets theme
        const footer = document.createElement('div');
        footer.className = 'game-footer';
        footer.innerHTML = `
            <p class="theme-text">Match rock layers like the NY Mets match their plays! 
            Use the Mets' blue and orange colors to guide you to victory!</p>
            <div class="game-results" id="game-results"></div>
        `;
        gameContainer.appendChild(footer);
        
        // Add event listeners
        document.getElementById('start-game').addEventListener('click', startGame);
    }
    
    // Start the game
    function startGame() {
        if (gameActive) return;
        
        // Reset game state
        score = 0;
        timeLeft = 60;
        gameActive = true;
        matches = 0;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        
        document.getElementById('score').textContent = score;
        document.getElementById('time-left').textContent = timeLeft;
        document.getElementById('game-message').textContent = 'Find matching pairs of rock layers and descriptions!';
        document.getElementById('game-message').className = 'game-message';
        
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        
        // Create memory cards
        createMemoryCards();
        
        // Start the timer
        timer = setInterval(function() {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Change the start button to a reset button
        const startButton = document.getElementById('start-game');
        startButton.textContent = 'Reset Game';
        startButton.removeEventListener('click', startGame);
        startButton.addEventListener('click', resetGame);
    }
    
    // Create memory cards
    function createMemoryCards() {
        const memoryGame = document.getElementById('memory-game');
        memoryGame.innerHTML = '';
        
        // Rock layer pairs (name and description)
        const rockPairs = [
            { name: 'Limestone', description: 'Formed from the remains of marine organisms' },
            { name: 'Sandstone', description: 'Formed from compressed sand deposits' },
            { name: 'Shale', description: 'Formed from compressed mud and clay' },
            { name: 'Granite', description: 'Igneous rock formed from cooling magma' },
            { name: 'Coal', description: 'Formed from compressed plant material' },
            { name: 'Basalt', description: 'Volcanic rock formed from lava flows' }
        ];
        
        // Create array with pairs
        let cards = [];
        rockPairs.forEach(pair => {
            cards.push({
                content: pair.name,
                type: 'name',
                match: pair.name
            });
            cards.push({
                content: pair.description,
                type: 'description',
                match: pair.name
            });
        });
        
        // Shuffle cards
        cards = shuffleArray(cards);
        
        // Create card elements
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.match = card.match;
            cardElement.dataset.type = card.type;
            
            cardElement.innerHTML = `
                <div class="front-face">${card.content}</div>
                <div class="back-face">NY Mets Rock Layer</div>
            `;
            
            cardElement.addEventListener('click', flipCard);
            memoryGame.appendChild(cardElement);
        });
    }
    
    // Flip card function
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (!gameActive) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flip');
        
        if (!firstCard) {
            // First click
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }
    
    // Check if the two flipped cards match
    function checkForMatch() {
        lockBoard = true;
        
        // Check if cards match
        let isMatch = firstCard.dataset.match === secondCard.dataset.match && 
                     firstCard.dataset.type !== secondCard.dataset.type;
        
        if (isMatch) {
            // It's a match!
            disableCards();
            score += 10;
            matches++;
            document.getElementById('score').textContent = score;
            document.getElementById('game-message').textContent = 'Match found! +10 points';
            document.getElementById('game-message').className = 'game-message correct';
            
            // Check if all pairs are matched
            if (matches === totalPairs) {
                // Add time bonus
                const timeBonus = timeLeft * 2;
                score += timeBonus;
                document.getElementById('score').textContent = score;
                
                // End game with slight delay to show the last match
                setTimeout(() => {
                    endGame(true);
                }, 1000);
            }
        } else {
            // Not a match
            unflipCards();
            score = Math.max(0, score - 2);
            document.getElementById('score').textContent = score;
            document.getElementById('game-message').textContent = 'Not a match! -2 points';
            document.getElementById('game-message').className = 'game-message wrong';
        }
    }
    
    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Unflip non-matching cards
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            resetBoard();
        }, 1500);
    }
    
    // Reset board after a turn
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
    
    // End the game
    function endGame(completed = false) {
        clearInterval(timer);
        gameActive = false;
        
        // Display results
        const resultsDiv = document.getElementById('game-results');
        
        if (completed) {
            resultsDiv.innerHTML = `
                <h4>Game Completed!</h4>
                <p>Your final score: ${score}</p>
                <p>Time bonus: ${timeLeft * 2} points</p>
                <p>${getScoreMessage(score)}</p>
            `;
        } else {
            resultsDiv.innerHTML = `
                <h4>Time's Up!</h4>
                <p>Your final score: ${score}</p>
                <p>Pairs matched: ${matches}/${totalPairs}</p>
                <p>${getScoreMessage(score)}</p>
            `;
        }
        
        resultsDiv.style.display = 'block';
        
        // Change the reset button back to start
        const resetButton = document.getElementById('start-game');
        resetButton.textContent = 'Play Again';
        resetButton.removeEventListener('click', resetGame);
        resetButton.addEventListener('click', startGame);
    }
    
    // Reset the game
    function resetGame() {
        clearInterval(timer);
        createGameUI();
    }
    
    // Get a message based on the score
    function getScoreMessage(score) {
        if (score >= 100) {
            return "Amazing! You're a rock correlation champion! The NY Mets would be proud!";
        } else if (score >= 70) {
            return "Great job! You've got the memory skills of a star baseball player!";
        } else if (score >= 40) {
            return "Not bad! Keep practicing and you'll be hitting home runs in no time!";
        } else {
            return "Keep trying! Even the NY Mets have off days. You'll get better with practice!";
        }
    }
    
    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        
        return array;
    }
    
    // Initialize the game
    createGameUI();
    console.log('Matching Game initialized successfully');
}

// Make sure the function is available globally
window.initializeMatchingGame = initializeMatchingGame;
