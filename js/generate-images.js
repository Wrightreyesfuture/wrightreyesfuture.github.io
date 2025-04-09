// Create simple Earth Science images for games
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Function to create Earth layers image
function createEarthLayersImage() {
    canvas.width = 600;
    canvas.height = 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer circle (Earth)
    ctx.beginPath();
    ctx.arc(300, 300, 250, 0, Math.PI * 2);
    ctx.fillStyle = '#64B5F6'; // Blue for crust/surface
    ctx.fill();
    
    // Draw continents
    ctx.fillStyle = '#81C784'; // Green for land
    // North America
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.bezierCurveTo(180, 200, 150, 250, 180, 300);
    ctx.bezierCurveTo(200, 320, 230, 310, 250, 290);
    ctx.bezierCurveTo(270, 270, 260, 220, 240, 190);
    ctx.bezierCurveTo(230, 170, 210, 170, 200, 180);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.moveTo(250, 320);
    ctx.bezierCurveTo(240, 350, 230, 380, 240, 410);
    ctx.bezierCurveTo(260, 430, 280, 420, 290, 390);
    ctx.bezierCurveTo(295, 360, 290, 330, 270, 310);
    ctx.bezierCurveTo(260, 300, 255, 310, 250, 320);
    ctx.fill();
    
    // Europe/Africa
    ctx.beginPath();
    ctx.moveTo(320, 200);
    ctx.bezierCurveTo(340, 210, 360, 230, 370, 260);
    ctx.bezierCurveTo(380, 300, 370, 350, 350, 400);
    ctx.bezierCurveTo(330, 420, 310, 410, 300, 380);
    ctx.bezierCurveTo(290, 340, 300, 300, 310, 260);
    ctx.bezierCurveTo(315, 230, 310, 210, 320, 200);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.arc(400, 380, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inner layers
    // Mantle
    ctx.beginPath();
    ctx.arc(300, 300, 180, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8A65'; // Orange for mantle
    ctx.fill();
    
    // Outer core
    ctx.beginPath();
    ctx.arc(300, 300, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#EF5350'; // Red for outer core
    ctx.fill();
    
    // Inner core
    ctx.beginPath();
    ctx.arc(300, 300, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#FDD835'; // Yellow for inner core
    ctx.fill();
    
    // Draw labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Crust', 150, 150);
    ctx.fillText('Mantle', 200, 220);
    ctx.fillText('Outer Core', 250, 280);
    ctx.fillText('Inner Core', 290, 310);
    
    // Draw lines connecting labels to layers
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(150, 155);
    ctx.lineTo(200, 180);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(200, 225);
    ctx.lineTo(240, 240);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(250, 285);
    ctx.lineTo(280, 290);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(290, 315);
    ctx.lineTo(310, 310);
    ctx.stroke();
    
    return canvas.toDataURL('image/png');
}

// Function to create geologic time scale image
function createGeologicTimeScaleImage() {
    canvas.width = 800;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Geologic Time Scale', canvas.width / 2, 40);
    
    // Draw time scale
    const timelineY = 150;
    const timelineLength = 700;
    const startX = 50;
    
    // Main timeline
    ctx.beginPath();
    ctx.moveTo(startX, timelineY);
    ctx.lineTo(startX + timelineLength, timelineY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // Eras and periods
    const eras = [
        { name: 'Precambrian', start: 4600, end: 541, color: '#A1887F' },
        { name: 'Paleozoic', start: 541, end: 252, color: '#7986CB' },
        { name: 'Mesozoic', start: 252, end: 66, color: '#81C784' },
        { name: 'Cenozoic', start: 66, end: 0, color: '#FFB74D' }
    ];
    
    const totalTime = 4600;
    
    // Draw eras
    eras.forEach(era => {
        const startPos = startX + (1 - era.start / totalTime) * timelineLength;
        const endPos = startX + (1 - era.end / totalTime) * timelineLength;
        const width = endPos - startPos;
        
        // Era block
        ctx.fillStyle = era.color;
        ctx.fillRect(startPos, timelineY - 30, width, 60);
        
        // Era label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        if (width > 50) {
            ctx.fillText(era.name, startPos + width / 2, timelineY + 5);
            ctx.font = '12px Arial';
            ctx.fillText(`${era.start}-${era.end} mya`, startPos + width / 2, timelineY + 25);
        }
    });
    
    // Major events
    const events = [
        { name: 'Earth Forms', time: 4600, icon: '🌍' },
        { name: 'First Life', time: 3500, icon: '🦠' },
        { name: 'First Multicellular Life', time: 1200, icon: '🧫' },
        { name: 'Cambrian Explosion', time: 541, icon: '🦐' },
        { name: 'First Fish', time: 500, icon: '🐟' },
        { name: 'First Land Plants', time: 470, icon: '🌱' },
        { name: 'First Amphibians', time: 370, icon: '🐸' },
        { name: 'First Reptiles', time: 320, icon: '🦎' },
        { name: 'First Dinosaurs', time: 230, icon: '🦖' },
        { name: 'First Mammals', time: 200, icon: '🐀' },
        { name: 'First Birds', time: 150, icon: '🦅' },
        { name: 'Dinosaur Extinction', time: 66, icon: '☄️' },
        { name: 'First Primates', time: 55, icon: '🐒' },
        { name: 'First Humans', time: 2.5, icon: '👨‍👩‍👧‍👦' },
        { name: 'Present Day', time: 0, icon: '📱' }
    ];
    
    // Draw events
    let lastY = timelineY - 80;
    let direction = -1; // -1 for up, 1 for down
    
    events.forEach((event, index) => {
        const xPos = startX + (1 - event.time / totalTime) * timelineLength;
        
        // Alternate above and below timeline
        const yOffset = 80 * direction;
        const yPos = timelineY + yOffset;
        
        // Line to event
        ctx.beginPath();
        ctx.moveTo(xPos, timelineY);
        ctx.lineTo(xPos, yPos);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Event dot
        ctx.beginPath();
        ctx.arc(xPos, timelineY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        // Event text
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = direction < 0 ? 'right' : 'left';
        ctx.fillText(`${event.icon} ${event.name}`, xPos + (direction < 0 ? -10 : 10), yPos);
        ctx.font = '12px Arial';
        ctx.fillText(`${event.time} mya`, xPos + (direction < 0 ? -10 : 10), yPos + 20);
        
        // Alternate direction if there's enough space
        if (Math.abs(xPos - lastY) > 60) {
            direction *= -1;
            lastY = xPos;
        }
    });
    
    return canvas.toDataURL('image/png');
}

// Function to create rock correlation image
function createRockCorrelationImage() {
    canvas.width = 800;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rock Layer Correlation', canvas.width / 2, 40);
    
    // Draw rock columns
    const columnWidth = 120;
    const columnHeight = 350;
    const startY = 100;
    const columns = 4;
    const spacing = 160;
    
    // Rock layer properties
    const layers = [
        { name: 'Sandstone', height: 60, color: '#E3D7A3', pattern: 'dots' },
        { name: 'Limestone', height: 80, color: '#C2B6A1', pattern: 'solid' },
        { name: 'Shale', height: 50, color: '#7D7463', pattern: 'lines' },
        { name: 'Coal', height: 30, color: '#333333', pattern: 'solid' },
        { name: 'Granite', height: 70, color: '#F5A9A9', pattern: 'speckled' },
        { name: 'Basalt', height: 60, color: '#5D5D5D', pattern: 'solid' }
    ];
    
    // Draw each column
    for (let i = 0; i < columns; i++) {
        const xPos = 120 + i * spacing;
        let currentY = startY;
        
        // Column label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Location ${i + 1}`, xPos + columnWidth / 2, currentY - 10);
        
        // Shuffle layers for this column but keep some correlation
        const columnLayers = [...layers];
        if (i > 0) {
            // Randomly reorder some layers to show different sequences
            for (let j = 0; j < 2; j++) {
                const idx1 = Math.floor(Math.random() * columnLayers.length);
                const idx2 = Math.floor(Math.random() * columnLayers.length);
                [columnLayers[idx1], columnLayers[idx2]] = [columnLayers[idx2], columnLayers[idx1]];
            }
            
            // Randomly adjust heights
            columnLayers.forEach(layer => {
                layer.height = layer.height * (0.8 + Math.random() * 0.4);
            });
        }
        
        // Draw layers
        columnLayers.forEach(layer => {
            // Layer rectangle
            ctx.fillStyle = layer.color;
            ctx.fillRect(xPos, currentY, columnWidth, layer.height);
            
            // Add pattern
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            
            if (layer.pattern === 'dots') {
                for (let x = xPos + 10; x < xPos + columnWidth; x += 10) {
                    for (let y = currentY + 10; y < currentY + layer.height; y += 10) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            } else if (layer.pattern === 'lines') {
                for (let y = currentY + 5; y < currentY + layer.height; y += 8) {
                    ctx.beginPath();
                    ctx.moveTo(xPos, y);
                    ctx.lineTo(xPos + columnWidth, y);
                    ctx.stroke();
                }
            } else if (layer.pattern === 'speckled') {
                for (let j = 0; j < 100; j++) {
                    const x = xPos + Math.random() * columnWidth;
                    const y = currentY + Math.random() * layer.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
            }
            
            // Layer border
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(xPos, currentY, columnWidth, layer.height);
            
            // Layer label
            if (layer.height > 20) {
                ctx.fillStyle = layer.color === '#333333' ? '#fff' : '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(layer.name, xPos + columnWidth / 2, currentY + layer.height / 2 + 5);
            }
            
            currentY += layer.height;
        });
        
        // Draw column border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(xPos, startY, columnWidth, columnHeight);
    }
    
    // Draw correlation lines
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    
    // Draw a few correlation lines
    const correlations = [
        { layer: 'Limestone', y: 160 },
        { layer: 'Coal', y: 240 },
        { layer: 'Basalt', y: 320 }
    ];
    
    correlations.forEach(corr => {
        ctx.beginPath();
        ctx.moveTo(120, corr.y);
        ctx.lineTo(120 + (columns - 1) * spacing + columnWidth, corr.y);
        ctx.stroke();
        
        // Label
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.font = 'italic 14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${corr.layer} marker bed`, 110, corr.y + 5);
    });
    
    ctx.setLineDash([]);
    
    // Legend
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(550, 380, 220, 100);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(550, 380, 220, 100);
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Rock Correlation Legend:', 560, 400);
    
    ctx.font = '12px Arial';
    ctx.fillText('- Red dashed lines show correlated layers', 560, 420);
    ctx.fillText('- Layers may vary in thickness', 560, 440);
    ctx.fillText('- Some layers may be missing in locations', 560, 460);
    
    return canvas.toDataURL('image/png');
}

// Function to create radioactive decay image
function createRadioactiveDecayImage() {
    canvas.width = 800;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Radioactive Decay and Half-Life', canvas.width / 2, 40);
    
    // Draw decay graph
    const graphWidth = 400;
    const graphHeight = 300;
    const startX = 100;
    const startY = 400;
    
    // Axes
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - graphHeight);
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + graphWidth, startY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time (half-lives)', startX + graphWidth / 2, startY + 30);
    
    ctx.save();
    ctx.translate(startX - 30, startY - graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Remaining Parent Isotope (%)', 0, 0);
    ctx.restore();
    
    // Draw decay curve
    ctx.beginPath();
    ctx.moveTo(startX, startY - graphHeight);
    
    for (let x = 0; x <= graphWidth; x++) {
        const t = x / graphWidth * 5; // 0 to 5 half-lives
        const y = Math.pow(0.5, t);
        ctx.lineTo(startX + x, startY - y * graphHeight);
    }
    
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Fill area under curve
    ctx.lineTo(startX + graphWidth, startY);
    ctx.lineTo(startX, startY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(229, 57, 53, 0.2)';
    ctx.fill();
    
    // Draw half-life markers
    for (let i = 0; i <= 5; i++) {
        const x = startX + (i / 5) * graphWidth;
        const y = startY - Math.pow(0.5, i) * graphHeight;
        
        // Vertical grid line
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY - graphHeight);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Horizontal grid line
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + graphWidth, y);
        ctx.stroke();
        
        // X-axis tick
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + 5);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Y-axis tick
        ctx.beginPath();
        ctx.moveTo(startX - 5, y);
        ctx.lineTo(startX, y);
        ctx.stroke();
        
        // X-axis label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), x, startY + 20);
        
        // Y-axis label
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(Math.pow(0.5, i) * 100)}%`, startX - 10, y + 5);
        
        // Half-life point marker
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#E53935';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Draw isotope visualization
    const atomSize = 10;
    const atomSpacing = 25;
    const rows = 5;
    const cols = 10;
    const startAtomX = 550;
    const startAtomY = 150;
    
    // Draw parent and daughter isotopes for each half-life
    for (let hl = 0; hl <= 3; hl++) {
        const yOffset = hl * 80;
        
        // Half-life label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`After ${hl} half-lives:`, startAtomX, startAtomY + yOffset - 20);
        
        // Calculate number of parent and daughter isotopes
        const parentFraction = Math.pow(0.5, hl);
        const parentCount = Math.round(rows * cols * parentFraction);
        const daughterCount = rows * cols - parentCount;
        
        // Draw atoms
        let count = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = startAtomX + c * atomSpacing;
                const y = startAtomY + yOffset + r * atomSpacing;
                
                // Determine if this is a parent or daughter isotope
                const isParent = count < parentCount;
                
                // Draw atom
                ctx.beginPath();
                ctx.arc(x, y, atomSize, 0, Math.PI * 2);
                ctx.fillStyle = isParent ? '#2196F3' : '#4CAF50';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                count++;
            }
        }
        
        // Percentage label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${Math.round(parentFraction * 100)}% parent (blue), ${Math.round((1 - parentFraction) * 100)}% daughter (green)`, startAtomX, startAtomY + yOffset + rows * atomSpacing + 15);
    }
    
    return canvas.toDataURL('image/png');
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createEarthLayersImage,
        createGeologicTimeScaleImage,
        createRockCorrelationImage,
        createRadioactiveDecayImage
    };
}
