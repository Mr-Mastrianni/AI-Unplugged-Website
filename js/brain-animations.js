// Brain Animations for AI Unplugged Website
// This file implements the createAIBrain and createAnimatedBrain functions

// Create AI Brain Visualization
function createAIBrain() {
    const container = document.getElementById('ai-brain');
    if (!container) return;

    // Add loading indicator
    container.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><span>Initializing AI Brain...</span></div>';

    // Create brain container
    const brainContainer = document.createElement('div');
    brainContainer.className = 'brain-container';
    
    // Create brain outline
    const brainOutline = document.createElement('div');
    brainOutline.className = 'brain-outline';
    brainContainer.appendChild(brainOutline);
    
    // Create brain center
    const brainCenter = document.createElement('div');
    brainCenter.className = 'brain-center';
    brainContainer.appendChild(brainCenter);
    
    // Create neural pathways
    const pathwayCount = 8;
    for (let i = 0; i < pathwayCount; i++) {
        const pathway = document.createElement('div');
        pathway.className = 'brain-pathway';
        
        // Position pathways in a circular pattern
        const angle = (i / pathwayCount) * Math.PI * 2;
        const radius = 80;
        const x = Math.cos(angle) * radius + 140;
        const y = Math.sin(angle) * radius + 140;
        
        pathway.style.left = `${x}px`;
        pathway.style.top = `${y}px`;
        pathway.style.animationDelay = `${i * 0.5}s`;
        
        brainContainer.appendChild(pathway);
        
        // Create neurons along each pathway
        const neuronCount = 3;
        for (let j = 0; j < neuronCount; j++) {
            const neuron = document.createElement('div');
            neuron.className = 'brain-neuron';
            
            // Position neurons along the pathway
            const neuronRadius = 30 + j * 20;
            const nx = Math.cos(angle) * neuronRadius + 140;
            const ny = Math.sin(angle) * neuronRadius + 140;
            
            neuron.style.left = `${nx}px`;
            neuron.style.top = `${ny}px`;
            neuron.style.animationDelay = `${i * 0.5 + j * 0.2}s`;
            
            brainContainer.appendChild(neuron);
        }
    }
    
    // Create synapses (connections between neurons)
    const synapseCount = 20;
    for (let i = 0; i < synapseCount; i++) {
        const synapse = document.createElement('div');
        synapse.className = 'brain-synapse';
        
        // Random position within the brain
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 70 + 30;
        const x = Math.cos(angle) * radius + 140;
        const y = Math.sin(angle) * radius + 140;
        
        // Random size
        const size = Math.random() * 40 + 20;
        
        synapse.style.left = `${x}px`;
        synapse.style.top = `${y}px`;
        synapse.style.width = `${size}px`;
        synapse.style.height = `${size}px`;
        synapse.style.animationDelay = `${Math.random() * 5}s`;
        
        brainContainer.appendChild(synapse);
    }
    
    // Create pulse effects
    const pulseCount = 5;
    for (let i = 0; i < pulseCount; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'brain-pulse';
        
        pulse.style.animationDelay = `${i * 1.5}s`;
        
        brainContainer.appendChild(pulse);
    }
    
    // Clear loading indicator and add brain container
    container.innerHTML = '';
    container.appendChild(brainContainer);
    
    // Add data transmission animation
    const dataTransmission = document.createElement('div');
    dataTransmission.className = 'data-transmission';
    container.appendChild(dataTransmission);
    
    // Add interaction
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create a ripple effect on mouse move
        const ripple = document.createElement('div');
        ripple.className = 'brain-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        container.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
}

// Create Animated Brain Network
function createAnimatedBrain() {
    const container = document.querySelector('.animated-brain');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Configuration
    const neuronCount = 30;
    const connectionCount = 50;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Create neurons
    const neurons = [];
    for (let i = 0; i < neuronCount; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        
        // Random size between 4px and 10px
        const size = Math.random() * 6 + 4;
        neuron.style.width = `${size}px`;
        neuron.style.height = `${size}px`;
        
        // Position within container
        const x = Math.random() * (containerWidth - size);
        const y = Math.random() * (containerHeight - size);
        neuron.style.left = `${x}px`;
        neuron.style.top = `${y}px`;
        
        // Store position data
        neuron.dataset.x = x;
        neuron.dataset.y = y;
        neuron.dataset.size = size;
        
        // Add pulse animation with random delay
        neuron.style.animation = `pulse ${Math.random() * 2 + 2}s infinite alternate`;
        neuron.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(neuron);
        neurons.push(neuron);
    }
    
    // Create connections between neurons
    for (let i = 0; i < connectionCount; i++) {
        // Select two random neurons
        const neuron1 = neurons[Math.floor(Math.random() * neurons.length)];
        const neuron2 = neurons[Math.floor(Math.random() * neurons.length)];
        
        // Don't connect a neuron to itself
        if (neuron1 === neuron2) continue;
        
        // Get positions
        const x1 = parseFloat(neuron1.dataset.x) + parseFloat(neuron1.dataset.size) / 2;
        const y1 = parseFloat(neuron1.dataset.y) + parseFloat(neuron1.dataset.size) / 2;
        const x2 = parseFloat(neuron2.dataset.x) + parseFloat(neuron2.dataset.size) / 2;
        const y2 = parseFloat(neuron2.dataset.y) + parseFloat(neuron2.dataset.size) / 2;
        
        // Calculate distance and angle
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create connection
        const connection = document.createElement('div');
        connection.className = 'connection';
        
        // Position and rotate
        connection.style.width = `${distance}px`;
        connection.style.height = '1px';
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Add data pulse animation
        connection.innerHTML = '<div class="data-pulse"></div>';
        
        // Random animation delay
        const dataPulse = connection.querySelector('.data-pulse');
        if (dataPulse) {
            dataPulse.style.animationDelay = `${Math.random() * 5}s`;
        }
        
        container.appendChild(connection);
    }
    
    // Add interaction
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Make neurons react to mouse proximity
        neurons.forEach(neuron => {
            const x = parseFloat(neuron.dataset.x) + parseFloat(neuron.dataset.size) / 2;
            const y = parseFloat(neuron.dataset.y) + parseFloat(neuron.dataset.size) / 2;
            
            const dx = mouseX - x;
            const dy = mouseY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If mouse is close, make the neuron glow
            if (distance < 50) {
                neuron.style.boxShadow = `0 0 ${20 - distance / 5}px var(--terminal-glow)`;
                neuron.style.opacity = '1';
            } else {
                neuron.style.boxShadow = '';
                neuron.style.opacity = '0.6';
            }
        });
    });
}

// Add CSS for brain animations
function addBrainAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* AI Brain Animation Styles */
        .brain-container {
            position: relative;
            width: 280px;
            height: 280px;
            margin: 0 auto;
            border-radius: 50%;
            animation: container-pulse 6s ease-in-out infinite;
        }
        
        .brain-outline {
            position: absolute;
            width: 220px;
            height: 220px;
            top: 30px;
            left: 30px;
            border-radius: 45% 45% 45% 45% / 45% 45% 45% 45%;
            border: 2px solid rgba(0, 255, 0, 0.3);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
            animation: rotate 20s linear infinite;
        }
        
        .brain-center {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 90px;
            left: 90px;
            background: radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 4s ease-in-out infinite;
        }
        
        .brain-pathway {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: rgba(0, 255, 0, 0.7);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            animation: pathway-pulse 3s ease-in-out infinite;
        }
        
        .brain-neuron {
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: rgba(0, 255, 0, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
            animation: neuron-pulse 2s ease-in-out infinite;
        }
        
        .brain-synapse {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(0, 255, 0, 0.2);
            animation: synapse-pulse 4s ease-in-out infinite;
        }
        
        .brain-pulse {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 90px;
            left: 90px;
            border-radius: 50%;
            border: 1px solid rgba(0, 255, 0, 0.5);
            animation: pulse-expand 3s ease-out infinite;
        }
        
        .brain-ripple {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background-color: transparent;
            border: 1px solid rgba(0, 255, 0, 0.8);
            animation: ripple 1s ease-out forwards;
        }
        
        .data-transmission {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .data-pulse {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: rgba(0, 255, 0, 0.8);
            border-radius: 50%;
            animation: data-pulse 3s linear infinite;
        }
        
        .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--terminal-green);
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 255, 0, 0.3);
            border-top: 3px solid rgba(0, 255, 0, 0.8);
            border-radius: 50%;
            margin-bottom: 10px;
            animation: spin 1s linear infinite;
        }
        
        /* Animations */
        @keyframes container-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(0, 255, 0, 0.5); }
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes pathway-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        @keyframes neuron-pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes synapse-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes pulse-expand {
            0% { transform: scale(0); opacity: 0.8; }
            100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(50); opacity: 0; }
        }
        
        @keyframes data-pulse {
            0% { left: 0; opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Animated Brain Network Styles */
        .animated-brain {
            position: relative;
            height: 300px;
            width: 100%;
            overflow: hidden;
        }
        
        .neuron {
            position: absolute;
            background-color: var(--terminal-green, #00ff00);
            border-radius: 50%;
            opacity: 0.6;
            box-shadow: 0 0 10px var(--terminal-glow, rgba(0, 255, 0, 0.5));
        }
        
        .connection {
            position: absolute;
            background-color: var(--terminal-green, #00ff00);
            opacity: 0.3;
            transform-origin: left center;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize brain animations when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add styles for brain animations
    addBrainAnimationStyles();
});
