// Timeline Game for Geologic Time Scale
// This is a standalone version that doesn't rely on external functions

function initializeTimelineGame(gameContainer) {
    console.log('Timeline Game initializing...');
    
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    // Game state
    let score = 0;
    let timeLeft = 120;
    let gameActive = false;
    let timer;
    let events = [];
    let placedEvents = [];
    let currentEvent = null;
    
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
            .timeline-container {
                position: relative;
                width: 100%;
                padding: 20px 0;
            }
            .timeline-line {
                position: relative;
                height: 8px;
                background: linear-gradient(to right, #ff5722, #0A75BC);
                border-radius: 4px;
                margin: 40px 0;
            }
            .timeline-marker {
                position: absolute;
                top: -15px;
                transform: translateX(-50%);
                background-color: white;
                border: 2px solid #333;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                z-index: 2;
            }
            .timeline-label {
                position: absolute;
                top: -45px;
                transform: translateX(-50%);
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                width: 100px;
            }
            .event-card {
                background-color: white;
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .event-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .event-card.selected {
                border-color: #ff5722;
                background-color: #fff3e0;
            }
            .event-card.correct {
                border-color: #4caf50;
                background-color: #e8f5e9;
            }
            .event-card.incorrect {
                border-color: #f44336;
                background-color: #ffebee;
            }
            .events-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 20px;
            }
            .timeline-dropzones {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            .timeline-dropzone {
                position: absolute;
                height: 100%;
                background-color: rgba(255,255,255,0.1);
                border: 1px dashed transparent;
                transition: all 0.3s ease;
            }
            .timeline-dropzone:hover {
                background-color: rgba(255,255,255,0.3);
                border-color: #aaa;
            }
            .timeline-dropzone.active {
                background-color: rgba(255,87,34,0.2);
                border-color: #ff5722;
            }
            .placed-event {
                position: absolute;
                bottom: 15px;
                transform: translateX(-50%);
                background-color: white;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 10px;
                width: 150px;
                text-align: center;
                font-size: 12px;
                z-index: 3;
            }
            .placed-event.correct {
                border-color: #4caf50;
                background-color: #e8f5e9;
            }
            .placed-event.incorrect {
                border-color: #f44336;
                background-color: #ffebee;
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
            .game-message.incorrect {
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
            .current-event-container {
                margin: 20px 0;
                padding: 15px;
                background-color: #f5f5f5;
                border-radius: 8px;
                text-align: center;
            }
            .current-event-title {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .current-event-description {
                font-style: italic;
            }
            .theme-highlight {
                color: #ff5722;
                font-weight: bold;
            }
        `;
        gameContainer.appendChild(gameStyles);
        
        // Create game header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <h3>Geologic Timeline Challenge</h3>
            <p>Place events in the correct order on the geologic timeline!</p>
            <div class="game-controls">
                <div class="score">Score: <span id="score">0</span></div>
                <div class="timer">Time: <span id="time-left">120</span>s</div>
                <button id="start-game" class="btn btn-primary">Start Game</button>
            </div>
        `;
        gameContainer.appendChild(header);
        
        // Create game board
        const gameBoard = document.createElement('div');
        gameBoard.className = 'game-board';
        gameBoard.innerHTML = `
            <div class="current-event-container" id="current-event-container">
                <div class="current-event-title">Select an event to place on the timeline</div>
                <div class="current-event-description" id="current-event-description"></div>
            </div>
            
            <div class="timeline-container">
                <div class="timeline-line">
                    <div class="timeline-marker" style="left: 0%;">P</div>
                    <div class="timeline-label" style="left: 0%;">Precambrian<br>4.6 BYA</div>
                    
                    <div class="timeline-marker" style="left: 12%;">C</div>
                    <div class="timeline-label" style="left: 12%;">Cambrian<br>541 MYA</div>
                    
                    <div class="timeline-marker" style="left: 20%;">O</div>
                    <div class="timeline-label" style="left: 20%;">Ordovician<br>485 MYA</div>
                    
                    <div class="timeline-marker" style="left: 28%;">S</div>
                    <div class="timeline-label" style="left: 28%;">Silurian<br>444 MYA</div>
                    
                    <div class="timeline-marker" style="left: 36%;">D</div>
                    <div class="timeline-label" style="left: 36%;">Devonian<br>419 MYA</div>
                    
                    <div class="timeline-marker" style="left: 44%;">C</div>
                    <div class="timeline-label" style="left: 44%;">Carboniferous<br>359 MYA</div>
                    
                    <div class="timeline-marker" style="left: 52%;">P</div>
                    <div class="timeline-label" style="left: 52%;">Permian<br>299 MYA</div>
                    
                    <div class="timeline-marker" style="left: 60%;">T</div>
                    <div class="timeline-label" style="left: 60%;">Triassic<br>252 MYA</div>
                    
                    <div class="timeline-marker" style="left: 68%;">J</div>
                    <div class="timeline-label" style="left: 68%;">Jurassic<br>201 MYA</div>
                    
                    <div class="timeline-marker" style="left: 76%;">K</div>
                    <div class="timeline-label" style="left: 76%;">Cretaceous<br>145 MYA</div>
                    
                    <div class="timeline-marker" style="left: 84%;">P</div>
                    <div class="timeline-label" style="left: 84%;">Paleogene<br>66 MYA</div>
                    
                    <div class="timeline-marker" style="left: 92%;">N</div>
                    <div class="timeline-label" style="left: 92%;">Neogene<br>23 MYA</div>
                    
                    <div class="timeline-marker" style="left: 100%;">Q</div>
                    <div class="timeline-label" style="left: 100%;">Quaternary<br>Present</div>
                    
                    <div class="timeline-dropzones" id="timeline-dropzones">
                        <!-- Dropzones will be added here -->
                    </div>
                    
                    <div id="placed-events">
                        <!-- Placed events will be added here -->
                    </div>
                </div>
            </div>
            
            <div class="events-container" id="events-container">
                <!-- Event cards will be added here -->
            </div>
            
            <div class="game-message" id="game-message"></div>
        `;
        gameContainer.appendChild(gameBoard);
        
        // Create game footer with combined themes
        const footer = document.createElement('div');
        footer.className = 'game-footer';
        footer.innerHTML = `
            <p class="theme-text">Navigate through time like <span class="theme-highlight">The Walking Dead</span> survivors navigate through the apocalypse, 
            with the precision of <span class="theme-highlight">Dexter's</span> analysis and the teamwork of the <span class="theme-highlight">NY Mets</span>!</p>
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
        timeLeft = 120;
        gameActive = true;
        events = [];
        placedEvents = [];
        currentEvent = null;
        
        document.getElementById('score').textContent = score;
        document.getElementById('time-left').textContent = timeLeft;
        document.getElementById('game-message').textContent = '';
        document.getElementById('game-message').className = 'game-message';
        
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        
        // Initialize events
        initializeEvents();
        
        // Create dropzones
        createDropzones();
        
        // Create event cards
        createEventCards();
        
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
    
    // Initialize timeline events
    function initializeEvents() {
        const allEvents = [
            {
                name: "First multicellular life",
                description: "Complex multicellular organisms first appear in the fossil record",
                period: "Precambrian",
                position: 10,
                date: "600 million years ago"
            },
            {
                name: "Cambrian Explosion",
                description: "Rapid diversification of complex animal life",
                period: "Cambrian",
                position: 12,
                date: "541 million years ago"
            },
            {
                name: "First land plants",
                description: "Plants begin to colonize land",
                period: "Ordovician",
                position: 24,
                date: "470 million years ago"
            },
            {
                name: "First fish with jaws",
                description: "Evolution of jawed fish",
                period: "Silurian",
                position: 30,
                date: "430 million years ago"
            },
            {
                name: "First amphibians",
                description: "Vertebrates begin to colonize land",
                period: "Devonian",
                position: 38,
                date: "370 million years ago"
            },
            {
                name: "Formation of coal forests",
                description: "Vast swamp forests that would later form coal deposits",
                period: "Carboniferous",
                position: 46,
                date: "350 million years ago"
            },
            {
                name: "First reptiles",
                description: "Evolution of amniotes that can reproduce on land",
                period: "Carboniferous",
                position: 48,
                date: "320 million years ago"
            },
            {
                name: "Permian-Triassic extinction",
                description: "The largest mass extinction event in Earth's history",
                period: "Permian",
                position: 56,
                date: "252 million years ago"
            },
            {
                name: "First dinosaurs",
                description: "Appearance of early dinosaurs",
                period: "Triassic",
                position: 62,
                date: "230 million years ago"
            },
            {
                name: "First mammals",
                description: "Small, nocturnal creatures evolve from reptiles",
                period: "Triassic",
                position: 64,
                date: "220 million years ago"
            },
            {
                name: "First birds",
                description: "Evolution of feathered dinosaurs into birds",
                period: "Jurassic",
                position: 70,
                date: "150 million years ago"
            },
            {
                name: "Cretaceous-Paleogene extinction",
                description: "Asteroid impact that killed the dinosaurs",
                period: "Cretaceous",
                position: 80,
                date: "66 million years ago"
            },
            {
                name: "First primates",
                description: "Evolution of early primates",
                period: "Paleogene",
                position: 86,
                date: "55 million years ago"
            },
            {
                name: "First hominids",
                description: "Appearance of human-like apes",
                period: "Neogene",
                position: 94,
                date: "6 million years ago"
            },
            {
                name: "First Homo sapiens",
                description: "Evolution of modern humans",
                period: "Quaternary",
                position: 99,
                date: "300,000 years ago"
            }
        ];
        
        // Shuffle and select 8 events for the game
        events = shuffleArray(allEvents).slice(0, 8);
    }
    
    // Create dropzones on the timeline
    function createDropzones() {
        const dropzonesContainer = document.getElementById('timeline-dropzones');
        dropzonesContainer.innerHTML = '';
        
        // Create 10 dropzones across the timeline
        for (let i = 0; i < 10; i++) {
            const dropzone = document.createElement('div');
            dropzone.className = 'timeline-dropzone';
            dropzone.style.left = `${i * 10}%`;
            dropzone.style.width = '10%';
            dropzone.dataset.position = i * 10;
            
            dropzone.addEventListener('click', function() {
                if (!currentEvent) return;
                
                placeEvent(parseInt(this.dataset.position));
            });
            
            dropzonesContainer.appendChild(dropzone);
        }
    }
    
    // Create event cards
    function createEventCards() {
        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = '';
        
        events.forEach((event, index) => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <strong>${event.name}</strong>
                <p>${event.description}</p>
            `;
            card.dataset.index = index;
            
            card.addEventListener('click', function() {
                if (this.classList.contains('correct') || this.classList.contains('incorrect')) return;
                
                // Remove selected class from all cards
                document.querySelectorAll('.event-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Set current event
                currentEvent = events[index];
                document.getElementById('current-event-description').textContent = 
                    `Place "${currentEvent.name}" on the timeline`;
                
                // Highlight dropzones
                document.querySelectorAll('.timeline-dropzone').forEach(dropzone => {
                    dropzone.classList.add('active');
                });
            });
            
            eventsContainer.appendChild(card);
        });
    }
    
    // Place an event on the timeline
    function placeEvent(position) {
        if (!currentEvent) return;
        
        const placedEventsContainer = document.getElementById('placed-events');
        const selectedCard = document.querySelector('.event-card.selected');
        
        if (!selectedCard) return;
        
        // Create placed event element
        const placedEvent = document.createElement('div');
        placedEvent.className = 'placed-event';
        placedEvent.style.left = `${position}%`;
        placedEvent.textContent = currentEvent.name;
        
        // Check if placement is correct (within 10% of actual position)
        const isCorrect = Math.abs(position - currentEvent.position) <= 10;
        
        if (isCorrect) {
            placedEvent.classList.add('correct');
            selectedCard.classList.add('correct');
            score += 10;
            document.getElementById('score').textContent = score;
            document.getElementById('game-message').textContent = 'Correct placement! +10 points';
            document.getElementById('game-message').className = 'game-message correct';
        } else {
            placedEvent.classList.add('incorrect');
            selectedCard.classList.add('incorrect');
            document.getElementById('game-message').textContent = 
                `Incorrect! This event belongs in the ${currentEvent.period} period (${currentEvent.date})`;
            document.getElementById('game-message').className = 'game-message incorrect';
        }
        
        // Add to placed events
        placedEventsContainer.appendChild(placedEvent);
        placedEvents.push({
            event: currentEvent,
            position: position,
            isCorrect: isCorrect
        });
        
        // Reset current event
        currentEvent = null;
        document.getElementById('current-event-description').textContent = '';
        
        // Remove active class from dropzones
        document.querySelectorAll('.timeline-dropzone').forEach(dropzone => {
            dropzone.classList.remove('active');
        });
        
        // Check if all events are placed
        if (placedEvents.length === events.length) {
            setTimeout(() => {
                endGame();
            }, 2000);
        }
    }
    
    // End the game
    function endGame() {
        clearInterval(timer);
        gameActive = false;
        
        // Count correct placements
        const correctPlacements = placedEvents.filter(pe => pe.isCorrect).length;
        
        // Calculate percentage score
        const percentage = Math.round((correctPlacements / events.length) * 100);
        
        // Add time bonus if all placements are correct
        let timeBonus = 0;
        if (correctPlacements === events.length) {
            timeBonus = timeLeft;
            score += timeBonus;
            document.getElementById('score').textContent = score;
        }
        
        // Display results
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = `
            <h4>Timeline Challenge Complete!</h4>
            <p>Your final score: ${score}</p>
            <p>Correct placements: ${correctPlacements}/${events.length} (${percentage}%)</p>
            ${timeBonus > 0 ? `<p>Time bonus: +${timeBonus} points</p>` : ''}
            <p>${getScoreMessage(percentage)}</p>
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
    function getScoreMessage(percentage) {
        if (percentage >= 90) {
            return "Amazing! You've mastered Earth's timeline like a true survivor! The Walking Dead crew, Dexter, and the NY Mets would all be impressed!";
        } else if (percentage >= 70) {
            return "Great job! You've navigated through time with the precision of Dexter and the teamwork of the NY Mets!";
        } else if (percentage >= 50) {
            return "Not bad! You're surviving the geologic timeline like The Walking Dead crew, but there's still room for improvement!";
        } else {
            return "Keep practicing! Understanding Earth's timeline is like surviving in The Walking Dead - it takes time and persistence!";
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
    console.log('Timeline Game initialized successfully');
}

// Make sure the function is available globally
window.initializeTimelineGame = initializeTimelineGame;
