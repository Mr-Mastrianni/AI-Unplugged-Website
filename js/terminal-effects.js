/**
 * Terminal Effects for AI Unplugged Website
 * This script contains all visual effects for the cyber terminal theme
 */

// Matrix Rain Effect
function initMatrixRain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const columns = Math.floor(canvas.width / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height);
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00FF41';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * 20, drops[i] * 1);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Apply terminal theme to all sections with the terminal-section class
function applyTerminalTheme() {
    const sections = document.querySelectorAll('.terminal-section');
    
    sections.forEach((section, index) => {
        // Add matrix canvas if not already present
        if (!section.querySelector('.matrix-bg')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('matrix-bg');
            canvas.id = `matrix-bg-${index}`;
            section.appendChild(canvas);
            
            // Initialize matrix effect
            initMatrixRain(`matrix-bg-${index}`);
        }
        
        // Add terminal header if not already present
        if (!section.querySelector('.terminal-header')) {
            const sectionTitle = section.getAttribute('data-terminal-title') || 'Terminal';
            const header = document.createElement('div');
            header.classList.add('terminal-header');
            header.innerHTML = `
                <div class="terminal-buttons">
                    <div class="terminal-button-red"></div>
                    <div class="terminal-button-yellow"></div>
                    <div class="terminal-button-green"></div>
                </div>
                <div class="terminal-title">${sectionTitle}</div>
            `;
            section.prepend(header);
        }
    });
}

// Typing effect for terminal text
function createTypingEffect(element, text, speed = 50, cursorBlink = true) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.textContent = '█';
    if (cursorBlink) cursor.classList.add('cursor-blink');
    element.appendChild(cursor);
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

// Initialize FAQ section in terminal style
function initTerminalFAQ() {
    const faqItems = document.querySelectorAll('.terminal-faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            
            // Toggle active class for the question
            item.classList.toggle('active');
            
            // Toggle show class for the answer
            answer.classList.toggle('show');
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const checkVisibility = () => {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initial check
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
}

// Command line terminal
function initCommandTerminal(terminalId) {
    const terminal = document.getElementById(terminalId);
    if (!terminal) return;
    
    const outputArea = terminal.querySelector('.command-output') || terminal;
    const inputField = terminal.querySelector('.command-input');
    
    if (!inputField) return;
    
    const commandHistory = [];
    let historyIndex = -1;
    
    // Add initial message
    const initialMessage = document.createElement('div');
    initialMessage.textContent = 'Terminal initialized. Type "help" for available commands.';
    outputArea.appendChild(initialMessage);
    
    // Commands dictionary
    const commands = {
        help: () => {
            return `
                Available commands:
                - help: Display this message
                - clear: Clear terminal
                - about: About AI Unplugged
                - contact: Contact information
                - ls: List available resources
                - theme [name]: Change terminal theme (matrix, neon, default)
            `;
        },
        clear: () => {
            outputArea.innerHTML = '';
            return '';
        },
        about: () => {
            return 'AI Unplugged is dedicated to providing cutting-edge AI solutions and education resources.';
        },
        contact: () => {
            return 'Email: info@aiunplugged.com | Phone: 555-123-4567';
        },
        ls: () => {
            return `
                resources/
                ├── courses/
                ├── tutorials/
                ├── projects/
                └── documentation/
            `;
        },
        theme: (args) => {
            const theme = args[0] || '';
            if (theme === 'matrix') {
                document.body.classList.remove('terminal-neon');
                document.body.classList.add('terminal-matrix');
                return 'Theme changed to matrix.';
            } else if (theme === 'neon') {
                document.body.classList.remove('terminal-matrix');
                document.body.classList.add('terminal-neon');
                return 'Theme changed to neon.';
            } else if (theme === 'default') {
                document.body.classList.remove('terminal-matrix', 'terminal-neon');
                return 'Theme changed to default.';
            } else {
                return 'Available themes: matrix, neon, default';
            }
        }
    };
    
    // Process command
    function processCommand(commandText) {
        const [command, ...args] = commandText.trim().split(' ');
        
        if (command === '') return '';
        
        if (commands[command]) {
            return commands[command](args);
        } else {
            return `Command not found: ${command}. Type "help" for available commands.`;
        }
    }
    
    // Add command to history
    function addToHistory(command) {
        if (command.trim() !== '') {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
    }
    
    // Display output
    function displayOutput(input, output) {
        const inputLine = document.createElement('div');
        inputLine.classList.add('command-prompt');
        inputLine.textContent = '> ' + input;
        outputArea.appendChild(inputLine);
        
        if (output.trim() !== '') {
            const outputLine = document.createElement('div');
            outputLine.classList.add('command-output-text');
            outputLine.innerHTML = output.replace(/\n/g, '<br>').replace(/\s{2,}/g, '&nbsp;&nbsp;');
            outputArea.appendChild(outputLine);
        }
        
        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    // Event listener for command input
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value;
            addToHistory(command);
            
            const output = processCommand(command);
            displayOutput(command, output);
            
            inputField.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputField.value = '';
            }
        }
    });
    
    // Focus input field on terminal click
    terminal.addEventListener('click', () => {
        inputField.focus();
    });
    
    // Initial focus
    inputField.focus();
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize all terminal effects
function initTerminalEffects() {
    // Apply terminal theme to all sections
    applyTerminalTheme();
    
    // Initialize FAQ
    initTerminalFAQ();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize command terminal if present
    initCommandTerminal('command-terminal');
    
    // Apply typing effect to elements with data-typing attribute
    document.querySelectorAll('[data-typing]').forEach(element => {
        if (isInViewport(element)) {
            createTypingEffect(element, element.getAttribute('data-typing'), parseInt(element.getAttribute('data-typing-speed')) || 50);
        }
    });
    
    // Apply typing effect on scroll
    window.addEventListener('scroll', () => {
        document.querySelectorAll('[data-typing]:not(.typed)').forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('typed');
                createTypingEffect(element, element.getAttribute('data-typing'), parseInt(element.getAttribute('data-typing-speed')) || 50);
            }
        });
    });
    
    console.log('Terminal effects initialized');
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initTerminalEffects);

// Export functions for external use
window.terminalEffects = {
    initMatrixRain,
    createTypingEffect,
    initCommandTerminal,
    applyTerminalTheme
}; 