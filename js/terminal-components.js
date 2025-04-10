// Terminal UI Components Generator
// This file provides functions to easily add terminal-style UI components to any page

document.addEventListener('DOMContentLoaded', function() {
    // Find elements with data attributes and automatically apply terminal UI
    applyTerminalStyling();
});

/**
 * Applies terminal styling to elements with data-terminal-* attributes
 */
function applyTerminalStyling() {
    // Terminal headers (data-terminal-header="title")
    document.querySelectorAll('[data-terminal-header]').forEach(element => {
        const title = element.getAttribute('data-terminal-header');
        if (!title) return;
        
        element.innerHTML = createTerminalHeader(title);
    });
    
    // Terminal windows (data-terminal-window="title")
    document.querySelectorAll('[data-terminal-window]').forEach(element => {
        const title = element.getAttribute('data-terminal-window');
        const content = element.innerHTML;
        
        // Get optional attributes
        const theme = element.getAttribute('data-theme') || 'matrix';
        const animate = element.getAttribute('data-animate') !== 'false';
        
        element.innerHTML = createTerminalWindow(title, content, theme, animate);
    });
    
    // Matrix backgrounds (data-matrix-bg)
    document.querySelectorAll('[data-matrix-bg]').forEach(element => {
        if (!element.querySelector('.matrix-bg')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('matrix-bg');
            element.prepend(canvas);
        }
    });
}

/**
 * Creates a terminal header with title and buttons
 * @param {string} title - The title to display
 * @returns {string} HTML for terminal header
 */
function createTerminalHeader(title) {
    return `
    <div class="section-terminal-header">
        <div class="terminal-buttons">
            <div class="terminal-button red"></div>
            <div class="terminal-button yellow"></div>
            <div class="terminal-button green"></div>
        </div>
        <div class="section-terminal-title">${title}</div>
        <div class="terminal-buttons opacity-0">
            <div class="terminal-button"></div>
        </div>
    </div>`;
}

/**
 * Creates a complete terminal window with header and content
 * @param {string} title - The title for the terminal
 * @param {string} content - The HTML content
 * @param {string} theme - Color theme: 'matrix', 'cyberpunk', 'hacker', 'retro'
 * @param {boolean} animate - Whether to animate the content typing
 * @returns {string} HTML for complete terminal window
 */
function createTerminalWindow(title, content, theme = 'matrix', animate = true) {
    const id = 'terminal-' + Math.random().toString(36).substr(2, 9);
    
    // Define colors based on theme
    let themeColors = {
        matrix: {
            text: 'var(--terminal-green)',
            border: 'var(--terminal-green)'
        },
        cyberpunk: {
            text: 'var(--terminal-cyan)',
            border: 'var(--terminal-purple)'
        },
        hacker: {
            text: 'var(--terminal-red)',
            border: 'var(--terminal-red)'
        },
        retro: {
            text: '#ffbf00',
            border: '#ffbf00'
        }
    };
    
    const colors = themeColors[theme] || themeColors.matrix;
    
    // Create window HTML
    const html = `
    <div class="section-terminal" style="border-color: ${colors.border}">
        <div class="section-terminal-header">
            <div class="terminal-buttons">
                <div class="terminal-button red"></div>
                <div class="terminal-button yellow"></div>
                <div class="terminal-button green"></div>
            </div>
            <div class="section-terminal-title" style="color: ${colors.text}">${title}</div>
            <div class="terminal-buttons opacity-0">
                <div class="terminal-button"></div>
            </div>
        </div>
        
        <div id="${id}" class="p-8 terminal-content">
            ${content}
        </div>
    </div>`;
    
    // Add animation script if needed
    if (animate) {
        setTimeout(() => {
            const terminalContent = document.getElementById(id);
            if (terminalContent) {
                const originalContent = terminalContent.innerHTML;
                simulateTyping(terminalContent, originalContent);
            }
        }, 500);
    }
    
    return html;
}

/**
 * Creates a terminal-style command line input
 * @param {string} placeholder - The placeholder text for the input
 * @param {Function} onCommand - Callback function for command execution
 * @returns {string} HTML for command line input
 */
function createCommandLine(placeholder = 'Type a command...', onCommand = null) {
    const id = 'cmd-' + Math.random().toString(36).substr(2, 9);
    
    const html = `
    <div class="terminal-cmd-line">
        <span class="text-terminal-green mr-2">$</span>
        <input id="${id}" type="text" placeholder="${placeholder}" 
               class="bg-transparent border-none focus:outline-none text-terminal-green w-full">
    </div>`;
    
    // Add functionality after rendering
    setTimeout(() => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const cmd = input.value.trim();
                    input.value = '';
                    
                    if (onCommand && typeof onCommand === 'function') {
                        onCommand(cmd);
                    }
                }
            });
        }
    }, 100);
    
    return html;
}

/**
 * Simulates typing effect in a terminal
 * @param {HTMLElement} element - The element to type in
 * @param {string} text - The text to type
 * @param {number} speed - Typing speed in milliseconds
 */
function simulateTyping(element, text, speed = 30) {
    if (!element) return;
    
    // Store original HTML and clear the element
    const originalHTML = text;
    element.innerHTML = '';
    
    // Create temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    // Function to type text nodes only, preserving HTML structure
    function typeElement(parentElement, element, callback) {
        // Clone all child nodes
        const nodes = Array.from(element.childNodes);
        let currentIndex = 0;
        
        function processNextNode() {
            if (currentIndex >= nodes.length) {
                if (callback) callback();
                return;
            }
            
            const node = nodes[currentIndex++];
            
            if (node.nodeType === Node.TEXT_NODE) {
                // For text nodes, type character by character
                const text = node.textContent;
                let charIndex = 0;
                
                const textNode = document.createTextNode('');
                parentElement.appendChild(textNode);
                
                function typeNextChar() {
                    if (charIndex < text.length) {
                        textNode.textContent += text[charIndex++];
                        setTimeout(typeNextChar, speed);
                    } else {
                        setTimeout(processNextNode, speed);
                    }
                }
                
                typeNextChar();
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // For element nodes, create the element then process its children
                const newElement = document.createElement(node.tagName);
                
                // Copy attributes
                Array.from(node.attributes).forEach(attr => {
                    newElement.setAttribute(attr.name, attr.value);
                });
                
                parentElement.appendChild(newElement);
                
                // Process child nodes
                typeElement(newElement, node, processNextNode);
            } else {
                // Other node types, just copy
                parentElement.appendChild(node.cloneNode(true));
                setTimeout(processNextNode, speed);
            }
        }
        
        processNextNode();
    }
    
    // Start typing
    typeElement(element, tempDiv, function() {
        // Add blinking cursor at the end
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.style.display = 'inline-block';
        cursor.style.width = '8px';
        cursor.style.height = '15px';
        cursor.style.backgroundColor = 'var(--terminal-green)';
        cursor.style.animation = 'blink 1s infinite';
        element.appendChild(cursor);
    });
}

/**
 * Creates a matrix background canvas and initializes it
 * @param {string} targetSelector - CSS selector for the target container
 */
function addMatrixBackground(targetSelector) {
    const container = document.querySelector(targetSelector);
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-bg');
    container.prepend(canvas);
    
    // Initialize matrix effect on this canvas
    initMatrixCanvas(canvas);
}

/**
 * Initializes matrix rain effect on a canvas
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function initMatrixCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Set canvas size
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    
    // Characters to use in the rain
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    // Prepare droplets
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height);
    }
    
    // Draw function
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    const intervalId = setInterval(draw, 33);
    
    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        }
    });
    
    resizeObserver.observe(parent);
} 