/**
 * Terminal Theme Initialization for AI Unplugged Website
 * This script initializes all terminal effects and behaviors across the website
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing terminal theme...');
  
  // Initialize matrix backgrounds for all elements with .matrix-bg class
  initMatrixBackgrounds();
  
  // Initialize all terminal animation effects
  initAnimations();
  
  // Initialize terminal interactive components
  initTerminalInteractions();
  
  // Initialize typing effects
  initTypingEffects();
  
  // Initialize glitch elements
  initGlitchElements();
  
  console.log('Terminal theme initialized successfully');
});

/**
 * Initializes matrix rain animation on all canvas elements with the matrix-bg class
 */
function initMatrixBackgrounds() {
  const matrixCanvases = document.querySelectorAll('.matrix-bg');
  
  matrixCanvases.forEach(canvas => {
    if (canvas.tagName.toLowerCase() === 'canvas') {
      const ctx = canvas.getContext('2d');
      const parent = canvas.parentElement;
      
      // Set canvas dimensions to match parent
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      
      // Set up matrix effect variables
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ';
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = [];
      
      // Initialize all columns with random starting positions
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -canvas.height;
      }
      
      // Primary matrix green color
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      // Animation function
      function drawMatrix() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set color for characters
        ctx.fillStyle = '#00ff41';
        
        // Draw characters
        for (let i = 0; i < columns; i++) {
          // Random character
          const char = characters.charAt(Math.floor(Math.random() * characters.length));
          
          // Draw the character
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          
          // Reset if it's at the bottom of the canvas or randomly
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
            drops[i] = 0;
          }
          
          // Move the drop down
          drops[i]++;
        }
        
        requestAnimationFrame(drawMatrix);
      }
      
      // Start the animation
      drawMatrix();
    }
  });
}

/**
 * Initializes scroll animations for elements with animation classes
 */
function initAnimations() {
  // Get all elements with animation classes
  const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-up');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class when element comes into view
        entry.target.style.opacity = '';
        entry.target.style.transform = '';
        
        // Stop observing the element
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element comes into view
  });
  
  // Observe each element
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Initializes terminal interactive components like FAQ accordions
 */
function initTerminalInteractions() {
  // Initialize FAQ accordions
  const faqItems = document.querySelectorAll('.terminal-faq');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.terminal-faq-question');
    
    question.addEventListener('click', () => {
      // Toggle the open class
      item.classList.toggle('open');
    });
  });
  
  // Initialize terminal buttons if they have functionality
  const terminalButtons = document.querySelectorAll('.terminal-button');
  
  terminalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      
      // Handle terminal button clicks
      if (button.classList.contains('red')) {
        // Close button functionality
        const terminal = button.closest('.section-terminal');
        if (terminal) {
          terminal.style.display = 'none';
        }
      }
    });
  });
}

/**
 * Initializes typing effects for elements with .typing-effect class
 */
function initTypingEffects() {
  const typingElements = document.querySelectorAll('.typing-effect');
  
  typingElements.forEach(element => {
    const text = element.getAttribute('data-text') || element.textContent;
    const speed = parseInt(element.getAttribute('data-speed') || 50);
    
    // Clear the element's content
    element.textContent = '';
    
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Add the cursor when typing is complete
        element.classList.add('typing-complete');
      }
    }
    
    // Start the typing effect
    typeWriter();
  });
}

/**
 * Initializes glitch effect for elements with .glitch class
 */
function initGlitchElements() {
  const glitchElements = document.querySelectorAll('.glitch');
  
  glitchElements.forEach(element => {
    // Store original text as data attribute if not already set
    if (!element.hasAttribute('data-text')) {
      element.setAttribute('data-text', element.textContent);
    }
  });
}

/**
 * Responsive behavior for window resize
 */
window.addEventListener('resize', function() {
  // Reinitialize matrix backgrounds on resize
  initMatrixBackgrounds();
}); 