// Rock Hunter Game for Geologic History
// This is a standalone version that doesn't rely on external functions

function initializeRockHunter(gameContainer) {
    console.log('Rock Hunter game initializing...');
    
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    // Game state
    let score = 0;
    let timeLeft = 60;
    let gameActive = false;
    let timer;
    
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
            }
            .game-scene {
                position: relative;
                width: 100%;
                height: 400px;
                overflow: hidden;
            }
            .game-background {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .rock-targets {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .rock-target {
                position: absolute;
                width: 100%;
                left: 0;
                cursor: pointer;
                background-color: transparent;
                transition: background-color 0.2s;
            }
            .rock-target:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            .game-info {
                padding: 15px;
                background-color: #fff;
                border-top: 1px solid #ddd;
            }
            .current-target {
                text-align: center;
                margin-bottom: 10px;
            }
            #target-name {
                font-size: 1.2em;
                font-weight: bold;
                color: #ff5722;
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
            <h3>Rock Hunter Challenge</h3>
            <p>Find and identify rock layers in this Walking Dead themed adventure!</p>
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
            <div class="game-scene">
                <div id="game-background" class="game-background"></div>
                <div class="rock-targets"></div>
            </div>
            <div class="game-info">
                <div class="current-target">
                    <h4>Find this rock layer:</h4>
                    <div id="target-name">Click Start to begin</div>
                </div>
                <div class="game-message" id="game-message"></div>
            </div>
        `;
        gameContainer.appendChild(gameBoard);
        
        // Create game footer with Walking Dead theme
        const footer = document.createElement('div');
        footer.className = 'game-footer';
        footer.innerHTML = `
            <p class="theme-text">Survive the geologic apocalypse! Just like in The Walking Dead, 
            your knowledge of the environment is crucial for survival.</p>
            <div class="game-results" id="game-results"></div>
        `;
        gameContainer.appendChild(footer);
        
        // Add event listeners
        document.getElementById('start-game').addEventListener('click', startGame);
    }
    
    // Generate a dynamic Earth layers image
    function generateEarthLayersImage() {
        const backgroundDiv = document.getElementById('game-background');
        
        // Define layers
        const layers = [
            { name: 'Topsoil', color: '#8B4513', height: 40 },
            { name: 'Clay', color: '#D2691E', height: 50 },
            { name: 'Limestone', color: '#F5DEB3', height: 60 },
            { name: 'Sandstone', color: '#DEB887', height: 55 },
            { name: 'Shale', color: '#A9A9A9', height: 45 },
            { name: 'Coal', color: '#2F4F4F', height: 35 },
            { name: 'Granite', color: '#CD5C5C', height: 65 }
        ];
        
        // Create HTML for layers
        let layersHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100px; 
                background: linear-gradient(to bottom, #87CEEB, #4682B4);">
                <!-- Sky -->
            </div>
        `;
        
        let currentY = 100;
        layers.forEach(layer => {
            layersHTML += `
                <div style="position: absolute; top: ${currentY}px; left: 0; width: 100%; 
                    height: ${layer.height}px; background-color: ${layer.color};">
                    <span style="position: absolute; left: 20px; top: ${layer.height/2-7}px; 
                        color: white; font-weight: bold; text-shadow: 1px 1px 2px black;">
                        ${layer.name}
                    </span>
                </div>
            `;
            currentY += layer.height;
        });
        
        // Add Walking Dead themed elements
        layersHTML += `
            <!-- Zombie silhouettes -->
            <div style="position: absolute; top: 70px; left: 100px; width: 20px; height: 30px; background-color: black; border-radius: 50% 50% 0 0;"></div>
            <div style="position: absolute; top: 100px; left: 100px; width: 2px; height: 40px; background-color: black;"></div>
            <div style="position: absolute; top: 120px; left: 100px; width: 30px; height: 2px; background-color: black;"></div>
            
            <div style="position: absolute; top: 65px; left: 500px; width: 20px; height: 30px; background-color: black; border-radius: 50% 50% 0 0;"></div>
            <div style="position: absolute; top: 95px; left: 500px; width: 2px; height: 40px; background-color: black;"></div>
            <div style="position: absolute; top: 115px; left: 485px; width: 30px; height: 2px; background-color: black;"></div>
        `;
        
        backgroundDiv.innerHTML = layersHTML;
        
        return layers;
    }
    
    // Start the game
    function startGame() {
        if (gameActive) return;
        
        // Reset game state
        score = 0;
        timeLeft = 60;
        gameActive = true;
        document.getElementById('score').textContent = score;
        document.getElementById('time-left').textContent = timeLeft;
        document.getElementById('game-message').textContent = '';
        
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        
        // Generate the game scene
        const layers = generateEarthLayersImage();
        
        // Create clickable targets
        createTargets(layers);
        
        // Start with a random target
        setRandomTarget(layers);
        
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
    
    // Create clickable targets on the rock layers
    function createTargets(layers) {
        const targetsContainer = document.querySelector('.rock-targets');
        targetsContainer.innerHTML = '';
        
        let currentY = 100;
        layers.forEach(layer => {
            const target = document.createElement('div');
            target.className = 'rock-target';
            target.dataset.name = layer.name;
            target.style.top = `${currentY}px`;
            target.style.height = `${layer.height}px`;
            
            target.addEventListener('click', function() {
                if (!gameActive) return;
                
                const currentTarget = document.getElementById('target-name').textContent;
                if (layer.name === currentTarget) {
                    // Correct!
                    score += 10;
                    document.getElementById('score').textContent = score;
                    document.getElementById('game-message').textContent = 'Correct! +10 points';
                    document.getElementById('game-message').className = 'game-message correct';
                    
                    // Set a new target
                    setRandomTarget(layers);
                } else {
                    // Wrong!
                    score = Math.max(0, score - 5);
                    document.getElementById('score').textContent = score;
                    document.getElementById('game-message').textContent = 'Wrong! -5 points';
                    document.getElementById('game-message').className = 'game-message wrong';
                }
            });
            
            targetsContainer.appendChild(target);
            currentY += layer.height;
        });
    }
    
    // Set a random target for the player to find
    function setRandomTarget(layers) {
        const randomIndex = Math.floor(Math.random() * layers.length);
        const targetName = layers[randomIndex].name;
        document.getElementById('target-name').textContent = targetName;
    }
    
    // End the game
    function endGame() {
        clearInterval(timer);
        gameActive = false;
        
        // Display results
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = `
            <h4>Game Over!</h4>
            <p>Your final score: ${score}</p>
            <p>${getScoreMessage(score)}</p>
        `;
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
            return "Amazing! You're a true geologic survivor, even Rick Grimes would be impressed!";
        } else if (score >= 70) {
            return "Great job! You'd definitely survive the walker apocalypse with these rock identification skills!";
        } else if (score >= 40) {
            return "Not bad! You might survive the geologic apocalypse, but watch out for those walkers!";
        } else {
            return "Keep practicing! In The Walking Dead world, you need to know your environment to survive!";
        }
    }
    
    // Initialize the game
    createGameUI();
    console.log('Rock Hunter game initialized successfully');
}

// Make sure the function is available globally
window.initializeRockHunter = initializeRockHunter;
