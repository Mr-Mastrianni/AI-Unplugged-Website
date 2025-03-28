// Exit-Intent Popup with Special Offer
document.addEventListener('DOMContentLoaded', function() {
    // Check if the popup has been shown in this session
    if (sessionStorage.getItem('exitPopupShown') !== 'true') {
        // Create the exit popup elements
        createExitPopup();
        
        // Set up exit detection
        setupExitIntent();
    }
});

// Create exit popup elements
function createExitPopup() {
    // Create main popup container
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'exit-popup-overlay';
    popupOverlay.setAttribute('aria-hidden', 'true');
    popupOverlay.setAttribute('role', 'dialog');
    popupOverlay.setAttribute('aria-labelledby', 'exit-popup-title');
    popupOverlay.setAttribute('aria-describedby', 'exit-popup-description');
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.id = 'exit-popup-content';
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.id = 'exit-popup-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close popup');
    
    // Popup header with title
    const popupHeader = document.createElement('div');
    popupHeader.id = 'exit-popup-header';
    
    const popupTitle = document.createElement('h2');
    popupTitle.id = 'exit-popup-title';
    popupTitle.textContent = 'Wait! Don\'t Miss This Offer';
    
    // Popup body
    const popupBody = document.createElement('div');
    popupBody.id = 'exit-popup-body';
    
    const popupDescription = document.createElement('p');
    popupDescription.id = 'exit-popup-description';
    popupDescription.innerHTML = 'Get <strong>30% off</strong> your first month of any AI solution when you sign up for a free consultation today.';
    
    // Special offer highlight
    const specialOffer = document.createElement('div');
    specialOffer.id = 'special-offer';
    specialOffer.innerHTML = '<span id="discount-code">AIWELCOME30</span><button id="copy-code" aria-label="Copy code">Copy Code</button>';
    
    // Call to action
    const ctaSection = document.createElement('div');
    ctaSection.id = 'exit-popup-cta';
    
    const ctaButton = document.createElement('a');
    ctaButton.href = 'contact.html';
    ctaButton.className = 'btn btn-primary';
    ctaButton.textContent = 'Schedule a Free Consultation';
    
    const noThanks = document.createElement('button');
    noThanks.id = 'exit-no-thanks';
    noThanks.textContent = 'No, thanks';
    noThanks.setAttribute('aria-label', 'Close popup');
    
    // Assemble the popup
    popupHeader.appendChild(popupTitle);
    
    popupBody.appendChild(popupDescription);
    popupBody.appendChild(specialOffer);
    
    ctaSection.appendChild(ctaButton);
    ctaSection.appendChild(noThanks);
    
    popupContent.appendChild(closeButton);
    popupContent.appendChild(popupHeader);
    popupContent.appendChild(popupBody);
    popupContent.appendChild(ctaSection);
    
    popupOverlay.appendChild(popupContent);
    
    // Add to the page but keep hidden initially
    document.body.appendChild(popupOverlay);
    
    // Add styles
    addExitPopupStyles();
    
    // Add event listeners
    closeButton.addEventListener('click', hideExitPopup);
    noThanks.addEventListener('click', hideExitPopup);
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            hideExitPopup();
        }
    });
    
    // Copy button functionality
    const copyButton = document.getElementById('copy-code');
    const discountCode = document.getElementById('discount-code');
    
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(discountCode.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy Code';
            }, 2000);
        });
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (popupOverlay.getAttribute('aria-hidden') === 'false' && e.key === 'Escape') {
            hideExitPopup();
        }
    });
}

// Add styles for the exit popup
function addExitPopupStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #exit-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        #exit-popup-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        #exit-popup-content {
            background-color: white;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            padding: 30px;
            position: relative;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.4s ease, opacity 0.4s ease;
        }
        
        #exit-popup-overlay.active #exit-popup-content {
            transform: translateY(0);
            opacity: 1;
        }
        
        #exit-popup-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            transition: color 0.2s ease;
        }
        
        #exit-popup-close:hover {
            color: #333;
        }
        
        #exit-popup-title {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 24px;
            color: var(--primary-color);
            text-align: center;
        }
        
        #exit-popup-description {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 25px;
            text-align: center;
        }
        
        #special-offer {
            background-color: #f8f9fa;
            border: 2px dashed var(--primary-color);
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        #discount-code {
            font-family: monospace;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            padding: 8px 12px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        #copy-code {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s ease;
        }
        
        #copy-code:hover {
            background-color: #3367d6;
        }
        
        #exit-popup-cta {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        
        #exit-popup-cta .btn {
            width: 100%;
            padding: 12px 20px;
            font-size: 16px;
            text-align: center;
        }
        
        #exit-no-thanks {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.2s ease;
        }
        
        #exit-no-thanks:hover {
            color: #333;
        }
        
        /* Dark mode support */
        body.dark-mode #exit-popup-content {
            background-color: #2a2a2a;
            color: #e0e0e0;
        }
        
        body.dark-mode #exit-popup-title {
            color: var(--dark-primary-color);
        }
        
        body.dark-mode #special-offer {
            background-color: #3a3a3a;
            border-color: var(--dark-primary-color);
        }
        
        body.dark-mode #discount-code {
            background-color: #444;
            border-color: #555;
            color: #fff;
        }
        
        body.dark-mode #exit-popup-close, 
        body.dark-mode #exit-no-thanks {
            color: #aaa;
        }
        
        body.dark-mode #exit-popup-close:hover, 
        body.dark-mode #exit-no-thanks:hover {
            color: #fff;
        }
        
        /* Responsive styles */
        @media (max-width: 480px) {
            #exit-popup-content {
                padding: 20px;
            }
            
            #exit-popup-title {
                font-size: 20px;
            }
            
            #exit-popup-description {
                font-size: 14px;
            }
            
            #discount-code {
                font-size: 16px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Set up exit intent detection
function setupExitIntent() {
    // For desktop: detect when mouse leaves the window
    document.addEventListener('mouseout', function(e) {
        // If the mouse is leaving the window at the top
        if (e.clientY < 5 && !e.relatedTarget && !e.toElement) {
            showExitPopup();
        }
    });
    
    // For mobile: detect when user navigates back/forward quickly
    let mobileTimer;
    let lastY = 0;
    
    // Set scroll and touch start positions
    window.addEventListener('touchstart', function(e) {
        lastY = e.touches[0].clientY;
        clearTimeout(mobileTimer);
    });
    
    // Detect rapid upward scroll (common when trying to close a page on mobile)
    window.addEventListener('touchmove', function(e) {
        const y = e.touches[0].clientY;
        const scrollingUp = y > lastY;
        const fastMovement = Math.abs(y - lastY) > 30;
        
        if (scrollingUp && fastMovement && window.scrollY < 200) {
            mobileTimer = setTimeout(function() {
                showExitPopup();
            }, 100);
        }
        
        lastY = y;
    });
    
    // Also trigger after the user has been on the page for a while
    setTimeout(function() {
        const hasScrolled = window.scrollY > 300;
        const hasReadPage = document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 300;
        
        // Only show popup if user has engaged with the page
        if (hasScrolled && !hasReadPage) {
            showExitPopup();
        }
    }, 30000); // 30 seconds
}

// Show exit popup
function showExitPopup() {
    // Avoid showing multiple times in the same session
    if (sessionStorage.getItem('exitPopupShown') === 'true') {
        return;
    }
    
    // Mark as shown
    sessionStorage.setItem('exitPopupShown', 'true');
    
    // Get popup elements
    const popupOverlay = document.getElementById('exit-popup-overlay');
    
    // Show popup
    popupOverlay.classList.add('active');
    popupOverlay.setAttribute('aria-hidden', 'false');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Set focus to the popup for accessibility
    setTimeout(function() {
        document.getElementById('exit-popup-title').focus();
    }, 100);
}

// Hide exit popup
function hideExitPopup() {
    const popupOverlay = document.getElementById('exit-popup-overlay');
    
    popupOverlay.classList.remove('active');
    popupOverlay.setAttribute('aria-hidden', 'true');
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

// For development/testing - force show popup
window.showExitPopupTest = function() {
    sessionStorage.removeItem('exitPopupShown');
    showExitPopup();
}; 