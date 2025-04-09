// Quiz Show Game for Radioactive Dating
// This is a standalone version that doesn't rely on external functions

function initializeQuizShow(gameContainer) {
    console.log('Quiz Show game initializing...');
    
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    // Game state
    let score = 0;
    let currentQuestion = 0;
    let gameActive = false;
    let questions = [];
    
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
            .quiz-show-container {
                background-color: #1a1a1a;
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            }
            .quiz-question {
                font-size: 1.2em;
                margin-bottom: 20px;
                padding: 15px;
                background-color: #333;
                border-radius: 8px;
                border-left: 5px solid #ff5722;
            }
            .quiz-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }
            .quiz-option {
                padding: 15px;
                background-color: #444;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            .quiz-option:hover {
                background-color: #555;
                transform: translateY(-2px);
            }
            .quiz-option.selected {
                background-color: #ff5722;
                color: white;
            }
            .quiz-option.correct {
                background-color: #4caf50;
                color: white;
            }
            .quiz-option.incorrect {
                background-color: #f44336;
                color: white;
            }
            .quiz-feedback {
                padding: 15px;
                margin: 15px 0;
                border-radius: 8px;
                display: none;
            }
            .quiz-feedback.correct {
                background-color: rgba(76, 175, 80, 0.2);
                border: 1px solid #4caf50;
                display: block;
            }
            .quiz-feedback.incorrect {
                background-color: rgba(244, 67, 54, 0.2);
                border: 1px solid #f44336;
                display: block;
            }
            .quiz-navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .quiz-progress {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            .progress-bar {
                height: 10px;
                background-color: #444;
                border-radius: 5px;
                margin: 10px 0;
                overflow: hidden;
                flex-grow: 1;
                margin: 0 10px;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff5722, #ff9800);
                width: 0%;
                border-radius: 5px;
                transition: width 0.5s ease;
            }
            .game-info {
                padding: 15px;
                background-color: #fff;
                border-top: 1px solid #ddd;
                margin-top: 20px;
                text-align: center;
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
            .dexter-theme {
                color: #ff5722;
                font-weight: bold;
            }
        `;
        gameContainer.appendChild(gameStyles);
        
        // Create game header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <h3>Radioactive Decay Quiz Show</h3>
            <p>Test your knowledge of radioactive dating in this <span class="dexter-theme">Dexter</span>-themed forensic investigation!</p>
            <div class="game-controls">
                <div class="score">Score: <span id="score">0</span></div>
                <button id="start-game" class="btn btn-primary">Start Game</button>
            </div>
        `;
        gameContainer.appendChild(header);
        
        // Create game board
        const gameBoard = document.createElement('div');
        gameBoard.className = 'game-board';
        gameBoard.innerHTML = `
            <div class="quiz-show-container">
                <div class="quiz-progress">
                    <span>Question: <span id="current-question">0</span>/<span id="total-questions">0</span></span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                </div>
                <div id="question-container">
                    <div class="quiz-question" id="question-text">
                        Click Start to begin the forensic investigation of Earth's history!
                    </div>
                    <div class="quiz-options" id="options-container">
                        <!-- Options will be added here -->
                    </div>
                </div>
                <div class="quiz-feedback" id="feedback">
                    <!-- Feedback will be shown here -->
                </div>
                <div class="quiz-navigation">
                    <button id="prev-question" class="btn" disabled>Previous</button>
                    <button id="next-question" class="btn" disabled>Next</button>
                </div>
            </div>
        `;
        gameContainer.appendChild(gameBoard);
        
        // Create game footer with Dexter theme
        const footer = document.createElement('div');
        footer.className = 'game-footer';
        footer.innerHTML = `
            <p class="theme-text">Just like <span class="dexter-theme">Dexter</span> uses forensic science to solve cases, 
            geologists use radioactive dating to solve Earth's mysteries!</p>
            <div class="game-results" id="game-results"></div>
        `;
        gameContainer.appendChild(footer);
        
        // Add event listeners
        document.getElementById('start-game').addEventListener('click', startGame);
        document.getElementById('prev-question').addEventListener('click', showPreviousQuestion);
        document.getElementById('next-question').addEventListener('click', showNextQuestion);
    }
    
    // Start the game
    function startGame() {
        if (gameActive) return;
        
        // Reset game state
        score = 0;
        currentQuestion = 0;
        gameActive = true;
        document.getElementById('score').textContent = score;
        
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        
        // Initialize questions
        initializeQuestions();
        
        // Show first question
        showQuestion(0);
        
        // Update UI
        document.getElementById('current-question').textContent = 1;
        document.getElementById('total-questions').textContent = questions.length;
        document.getElementById('progress-fill').style.width = `${(1 / questions.length) * 100}%`;
        
        // Enable/disable navigation buttons
        document.getElementById('prev-question').disabled = true;
        document.getElementById('next-question').disabled = false;
        
        // Change the start button to a reset button
        const startButton = document.getElementById('start-game');
        startButton.textContent = 'Reset Game';
        startButton.removeEventListener('click', startGame);
        startButton.addEventListener('click', resetGame);
    }
    
    // Initialize quiz questions
    function initializeQuestions() {
        questions = [
            {
                question: "Which radioactive isotope is commonly used to date very old rocks?",
                options: [
                    "Carbon-14",
                    "Uranium-238",
                    "Potassium-40",
                    "Tritium"
                ],
                correctIndex: 1,
                explanation: "Uranium-238 has a half-life of about 4.5 billion years, making it suitable for dating very old rocks."
            },
            {
                question: "What is the half-life of a radioactive isotope?",
                options: [
                    "The time it takes for half of the atoms to decay",
                    "The time it takes for all atoms to decay",
                    "The time it takes for the isotope to become stable",
                    "The time it takes for the isotope to form"
                ],
                correctIndex: 0,
                explanation: "The half-life is the time it takes for half of the radioactive atoms in a sample to decay."
            },
            {
                question: "Which dating method would be most appropriate for dating a 10,000-year-old human artifact?",
                options: [
                    "Uranium-lead dating",
                    "Potassium-argon dating",
                    "Carbon-14 dating",
                    "Rubidium-strontium dating"
                ],
                correctIndex: 2,
                explanation: "Carbon-14 dating is effective for organic materials up to about 50,000 years old."
            },
            {
                question: "What is the parent isotope in potassium-argon dating?",
                options: [
                    "Argon-40",
                    "Potassium-40",
                    "Argon-39",
                    "Potassium-39"
                ],
                correctIndex: 1,
                explanation: "Potassium-40 is the parent isotope that decays to form Argon-40 (the daughter isotope)."
            },
            {
                question: "Why can't radiocarbon dating be used to date rocks?",
                options: [
                    "Rocks are too old for carbon-14 dating",
                    "Rocks don't contain carbon",
                    "Carbon-14 doesn't decay in rocks",
                    "Both A and B"
                ],
                correctIndex: 3,
                explanation: "Most rocks are too old for carbon-14 dating (which is limited to about 50,000 years), and many rocks don't contain carbon."
            },
            {
                question: "In radioactive decay, what happens to the nucleus of an atom?",
                options: [
                    "It gains electrons",
                    "It loses electrons",
                    "It changes to a different element",
                    "It remains the same element but changes mass"
                ],
                correctIndex: 2,
                explanation: "During radioactive decay, the nucleus changes, often resulting in the transformation into a different element."
            },
            {
                question: "What is an isochron in radiometric dating?",
                options: [
                    "A line representing constant time",
                    "A type of radioactive isotope",
                    "A specialized dating instrument",
                    "The half-life of an isotope"
                ],
                correctIndex: 0,
                explanation: "An isochron is a line on a graph that represents rocks or minerals that are the same age but have different initial compositions."
            },
            {
                question: "Which of these would NOT be suitable for radiocarbon dating?",
                options: [
                    "Wooden tools",
                    "Animal bones",
                    "Ancient pottery",
                    "Plant fibers"
                ],
                correctIndex: 2,
                explanation: "Ancient pottery is made from clay minerals, not organic material, so it doesn't contain carbon-14 for dating."
            }
        ];
        
        // Shuffle questions
        questions = shuffleArray(questions);
        
        // Limit to 5 questions for the game
        questions = questions.slice(0, 5);
    }
    
    // Show a specific question
    function showQuestion(index) {
        if (index < 0 || index >= questions.length) return;
        
        currentQuestion = index;
        const question = questions[index];
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Clear feedback
        const feedback = document.getElementById('feedback');
        feedback.textContent = '';
        feedback.className = 'quiz-feedback';
        
        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.dataset.index = i;
            
            optionElement.addEventListener('click', function() {
                if (this.classList.contains('selected') || 
                    this.classList.contains('correct') || 
                    this.classList.contains('incorrect')) return;
                
                // Remove selected class from all options
                document.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Check answer
                checkAnswer(i);
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Update progress
        document.getElementById('current-question').textContent = index + 1;
        document.getElementById('progress-fill').style.width = `${((index + 1) / questions.length) * 100}%`;
        
        // Enable/disable navigation buttons
        document.getElementById('prev-question').disabled = index === 0;
        document.getElementById('next-question').disabled = index === questions.length - 1;
    }
    
    // Check the selected answer
    function checkAnswer(selectedIndex) {
        const question = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        const feedback = document.getElementById('feedback');
        
        // Highlight correct and incorrect answers
        options.forEach((option, i) => {
            if (i === question.correctIndex) {
                option.classList.add('correct');
            } else if (i === selectedIndex) {
                option.classList.add('incorrect');
            }
        });
        
        // Show feedback
        if (selectedIndex === question.correctIndex) {
            score += 10;
            document.getElementById('score').textContent = score;
            feedback.textContent = `Correct! +10 points. ${question.explanation}`;
            feedback.className = 'quiz-feedback correct';
        } else {
            feedback.textContent = `Incorrect. The correct answer is: ${question.options[question.correctIndex]}. ${question.explanation}`;
            feedback.className = 'quiz-feedback incorrect';
        }
        
        // Check if all questions are answered
        const allAnswered = Array.from(document.querySelectorAll('.quiz-option')).some(option => 
            option.classList.contains('correct') || option.classList.contains('incorrect')
        );
        
        // If last question and answered, show results
        if (currentQuestion === questions.length - 1 && allAnswered) {
            setTimeout(() => {
                endGame();
            }, 2000);
        }
    }
    
    // Show previous question
    function showPreviousQuestion() {
        if (currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    }
    
    // Show next question
    function showNextQuestion() {
        if (currentQuestion < questions.length - 1) {
            showQuestion(currentQuestion + 1);
        } else {
            // Check if all questions are answered
            const allAnswered = questions.every((_, i) => {
                const options = document.querySelectorAll(`.quiz-option[data-index="${i}"]`);
                return Array.from(options).some(option => 
                    option.classList.contains('correct') || option.classList.contains('incorrect')
                );
            });
            
            if (allAnswered) {
                endGame();
            }
        }
    }
    
    // End the game
    function endGame() {
        gameActive = false;
        
        // Calculate percentage score
        const maxScore = questions.length * 10;
        const percentage = Math.round((score / maxScore) * 100);
        
        // Display results
        const resultsDiv = document.getElementById('game-results');
        resultsDiv.innerHTML = `
            <h4>Investigation Complete!</h4>
            <p>Your final score: ${score}/${maxScore} (${percentage}%)</p>
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
        createGameUI();
    }
    
    // Get a message based on the score
    function getScoreMessage(percentage) {
        if (percentage >= 90) {
            return "Amazing! You're a master forensic geologist, even Dexter would be impressed with your precision!";
        } else if (percentage >= 70) {
            return "Great job! Your radioactive dating skills would make you a valuable asset in Dexter's lab!";
        } else if (percentage >= 50) {
            return "Not bad! You've got the basics down, but Dexter would recommend more practice with the evidence!";
        } else {
            return "Keep studying! Even Dexter had to learn the forensic basics before solving complex cases!";
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
    console.log('Quiz Show game initialized successfully');
}

// Make sure the function is available globally
window.initializeQuizShow = initializeQuizShow;
