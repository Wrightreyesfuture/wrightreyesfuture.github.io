// Update the games to use the generated images
document.addEventListener('DOMContentLoaded', function() {
    // Import the image generation functions
    const imageGenerator = require('./generate-images.js');
    
    // Generate images for each game
    const earthLayersImage = imageGenerator.createEarthLayersImage();
    const geologicTimeScaleImage = imageGenerator.createGeologicTimeScaleImage();
    const rockCorrelationImage = imageGenerator.createRockCorrelationImage();
    const radioactiveDecayImage = imageGenerator.createRadioactiveDecayImage();
    
    // Add images to the DOM
    const gameContainers = document.querySelectorAll('.game-container');
    
    gameContainers.forEach(container => {
        const gameType = container.getAttribute('data-game-type');
        let img = document.createElement('img');
        img.className = 'game-image';
        
        switch(gameType) {
            case 'rock-hunter':
                img.src = earthLayersImage;
                img.alt = 'Earth Layers Diagram';
                break;
            case 'matching-game':
                img.src = rockCorrelationImage;
                img.alt = 'Rock Correlation Diagram';
                break;
            case 'quiz-show':
                img.src = radioactiveDecayImage;
                img.alt = 'Radioactive Decay Diagram';
                break;
            case 'timeline-game':
                img.src = geologicTimeScaleImage;
                img.alt = 'Geologic Time Scale';
                break;
        }
        
        // Insert image at the beginning of the game container
        if (container.firstChild) {
            container.insertBefore(img, container.firstChild);
        } else {
            container.appendChild(img);
        }
    });
});
