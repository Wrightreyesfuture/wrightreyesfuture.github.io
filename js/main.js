// Main JavaScript file for Earth Science Tutor
// This file handles the initialization of all games and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JS loaded');
    
    // Initialize progress tracking
    initializeProgressTracking();
    
    // Initialize flashcards
    initializeFlashcards();
    
    // Initialize games based on the page
    initializeGames();
    
    // Add tab switching functionality
    initializeTabSwitching();
});

// Initialize progress tracking
function initializeProgressTracking() {
    try {
        console.log('Initializing progress tracking');
        
        // Update progress bar based on localStorage
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const sections = ['learn', 'quiz', 'game'];
            let completedSections = 0;
            
            sections.forEach(section => {
                if (localStorage.getItem(`${section}-complete`) === 'true') {
                    completedSections++;
                }
            });
            
            const progressPercentage = Math.round((completedSections / sections.length) * 100);
            
            progressFill.style.width = `${progressPercentage}%`;
            progressText.textContent = `${progressPercentage}% Complete`;
        }
    } catch (error) {
        console.error('Error initializing progress tracking:', error);
    }
}

// Initialize flashcards
function initializeFlashcards() {
    try {
        console.log('Initializing flashcards');
        
        const flashcards = document.querySelectorAll('.flashcard');
        if (flashcards.length === 0) return;
        
        let currentCardIndex = 0;
        
        flashcards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
            }
            
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
        });
        
        const nextCardBtn = document.querySelector('.next-card');
        const prevCardBtn = document.querySelector('.prev-card');
        
        if (nextCardBtn) {
            nextCardBtn.addEventListener('click', function() {
                flashcards[currentCardIndex].style.display = 'none';
                currentCardIndex = (currentCardIndex + 1) % flashcards.length;
                flashcards[currentCardIndex].style.display = 'block';
                flashcards[currentCardIndex].classList.remove('flipped');
                updateCardCounter();
            });
        }
        
        if (prevCardBtn) {
            prevCardBtn.addEventListener('click', function() {
                flashcards[currentCardIndex].style.display = 'none';
                currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
                flashcards[currentCardIndex].style.display = 'block';
                flashcards[currentCardIndex].classList.remove('flipped');
                updateCardCounter();
            });
        }
        
        function updateCardCounter() {
            const counter = document.querySelector('.card-counter');
            if (counter) {
                counter.textContent = `${currentCardIndex + 1}/${flashcards.length}`;
            }
        }
    } catch (error) {
        console.error('Error initializing flashcards:', error);
    }
}

// Initialize games based on the page
function initializeGames() {
    try {
        console.log('Checking for games to initialize');
        
        // Find game containers
        const rockHunterContainer = document.querySelector('[data-game-type="rock-hunter"]');
        const matchingGameContainer = document.querySelector('[data-game-type="matching-game"]');
        const quizShowContainer = document.querySelector('[data-game-type="quiz-show"]');
        const timelineGameContainer = document.querySelector('[data-game-type="timeline-game"]');
        
        // Initialize Rock Hunter game if container exists and function is available
        if (rockHunterContainer && typeof window.initializeRockHunter === 'function') {
            console.log('Initializing Rock Hunter game');
            window.initializeRockHunter(rockHunterContainer);
        }
        
        // Initialize Matching Game if container exists and function is available
        if (matchingGameContainer && typeof window.initializeMatchingGame === 'function') {
            console.log('Initializing Matching Game');
            window.initializeMatchingGame(matchingGameContainer);
        }
        
        // Initialize Quiz Show if container exists and function is available
        if (quizShowContainer && typeof window.initializeQuizShow === 'function') {
            console.log('Initializing Quiz Show');
            window.initializeQuizShow(quizShowContainer);
        }
        
        // Initialize Timeline Game if container exists and function is available
        if (timelineGameContainer && typeof window.initializeTimelineGame === 'function') {
            console.log('Initializing Timeline Game');
            window.initializeTimelineGame(timelineGameContainer);
        }
    } catch (error) {
        console.error('Error initializing games:', error);
    }
}

// Initialize tab switching
function initializeTabSwitching() {
    try {
        console.log('Initializing tab switching');
        
        // Function to switch tabs
        window.switchTab = function(tabId) {
            console.log('Switching to tab:', tabId);
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to selected tab and content
            const selectedTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
            const selectedContent = document.getElementById(`${tabId}-content`);
            
            if (selectedTab && selectedContent) {
                selectedTab.classList.add('active');
                selectedContent.classList.add('active');
                
                // Reinitialize games if switching to game tab
                if (tabId === 'game') {
                    setTimeout(initializeGames, 100);
                }
            } else {
                console.error(`Tab or content not found for: ${tabId}`);
            }
        };
        
        // Add click event to tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                window.switchTab(tabId);
            });
        });
        
        // Function to mark section as complete
        window.markSectionComplete = function(section) {
            console.log('Marking section complete:', section);
            
            // Save progress to localStorage
            localStorage.setItem(`${section}-complete`, 'true');
            
            // Update progress
            initializeProgressTracking();
            
            // Show confirmation
            alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section marked as complete!`);
            
            // Move to next section
            const sections = ['learn', 'quiz', 'game'];
            const currentIndex = sections.indexOf(section);
            
            if (currentIndex < sections.length - 1) {
                window.switchTab(sections[currentIndex + 1]);
            }
        };
    } catch (error) {
        console.error('Error initializing tab switching:', error);
    }
}
