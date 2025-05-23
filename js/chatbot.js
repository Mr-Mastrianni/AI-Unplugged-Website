// Simple AI Chatbot for AI Unplugged website
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot UI
    createChatbotUI();

    // Initialize chatbot functionality
    initChatbot();

    // Initialize matrix effect
    initMatrixEffect();

    // Show welcome tooltip after a short delay
    setTimeout(() => {
        const chatbotButton = document.querySelector('.chatbot-button');
        if (chatbotButton) {
            chatbotButton.classList.add('show-tooltip');

            // Hide tooltip after a few seconds
            setTimeout(() => {
                chatbotButton.classList.remove('show-tooltip');
            }, 5000);
        }
    }, 3000);
});

// Create chatbot UI elements
function createChatbotUI() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.setAttribute('aria-live', 'polite');
    chatbotContainer.setAttribute('role', 'dialog');
    chatbotContainer.setAttribute('aria-labelledby', 'chatbot-header');

    // Create chatbot button
    const chatbotButton = document.createElement('div');
    chatbotButton.className = 'chatbot-button';
    chatbotButton.innerHTML = '<i class="fas fa-robot chatbot-icon"></i><span class="chatbot-badge">1</span>';
    chatbotButton.setAttribute('aria-label', 'Open chat assistant - 1 new message');
    chatbotButton.setAttribute('role', 'button');
    chatbotButton.setAttribute('tabindex', '0');

    // Create chatbot window
    const chatbotWindow = document.createElement('div');
    chatbotWindow.className = 'chatbot-window';

    // Create matrix background
    const matrixBackground = document.createElement('canvas');
    matrixBackground.className = 'matrix-background';
    matrixBackground.id = 'chatbot-matrix';

    // Create chatbot header with terminal-style buttons
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <div class="terminal-buttons">
            <div class="terminal-button red"></div>
            <div class="terminal-button yellow"></div>
            <div class="terminal-button green"></div>
        </div>
        <div class="chatbot-title glitch" data-text="AI TERMINAL // v1.0.3">
            <i class="fas fa-terminal"></i>AI TERMINAL // v1.0.3
        </div>
        <div class="chatbot-close">
            <i class="fas fa-times"></i>
        </div>
    `;

    // Create chatbot messages container
    const chatbotMessages = document.createElement('div');
    chatbotMessages.className = 'chatbot-messages';
    chatbotMessages.setAttribute('aria-live', 'polite');

    // Create chatbot input container
    const chatbotInputContainer = document.createElement('div');
    chatbotInputContainer.className = 'chatbot-input-container';
    chatbotInputContainer.innerHTML = `
        <input type="text" class="chatbot-input" placeholder="Enter command..." aria-label="Type your message">
        <button class="chatbot-send" aria-label="Send message">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;

    // Assemble chatbot elements
    chatbotWindow.appendChild(matrixBackground);
    chatbotWindow.appendChild(chatbotHeader);
    chatbotWindow.appendChild(chatbotMessages);
    chatbotWindow.appendChild(chatbotInputContainer);

    chatbotContainer.appendChild(chatbotButton);
    chatbotContainer.appendChild(chatbotWindow);

    // Add chatbot to page
    document.body.appendChild(chatbotContainer);
}

// Initialize matrix background effect
function initMatrixEffect() {
    const canvas = document.getElementById('chatbot-matrix');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let chatbotWindow = document.querySelector('.chatbot-window');

    // Resize observer to handle window size changes
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === chatbotWindow) {
                canvas.width = chatbotWindow.offsetWidth;
                canvas.height = chatbotWindow.offsetHeight;
            }
        }
    });

    resizeObserver.observe(chatbotWindow);

    // Initial size
    canvas.width = chatbotWindow.offsetWidth;
    canvas.height = chatbotWindow.offsetHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    const binary = '01';

    const alphabet = katakana + latin + nums + symbols + binary;

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const rainDrops = Array(Math.ceil(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    // Only run the animation when the chatbot is active
    let matrixInterval;

    // Watch for chatbot visibility changes
    const chatbotVisibilityObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target.classList.contains('active')) {
                // Start matrix animation when chatbot is visible
                if (!matrixInterval) {
                    matrixInterval = setInterval(draw, 30);
                }
            } else {
                // Stop matrix animation when chatbot is hidden
                if (matrixInterval) {
                    clearInterval(matrixInterval);
                    matrixInterval = null;
                }
            }
        });
    });

    chatbotVisibilityObserver.observe(chatbotWindow, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Initialize chatbot functionality
function initChatbot() {
    const chatbotButton = document.querySelector('.chatbot-button');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.querySelector('.chatbot-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');

    // Toggle chatbot window when button is clicked
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        chatbotInput.focus();

        // Hide the notification badge when chatbot is opened
        const badge = chatbotButton.querySelector('.chatbot-badge');
        if (badge) {
            badge.style.display = 'none';
        }

        // If opening the chatbot for the first time, show welcome message
        if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
            showWelcomeMessage();
        }
    });

    // Support for keyboard navigation
    chatbotButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            chatbotWindow.classList.toggle('active');
            chatbotInput.focus();

            // Hide the notification badge when chatbot is opened
            const badge = chatbotButton.querySelector('.chatbot-badge');
            if (badge) {
                badge.style.display = 'none';
            }

            // If opening the chatbot for the first time, show welcome message
            if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
                showWelcomeMessage();
            }
        }
    });

    // Close chatbot window when close button is clicked
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Send message when send button is clicked
    chatbotSend.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addUserMessage(message);

        // Clear input
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Generate and display response after a delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateResponse(message);
            addBotMessage(response.message);

            // Add quick reply buttons if available
            if (response.quickReplies && response.quickReplies.length > 0) {
                addQuickReplies(response.quickReplies);
            }
        }, 1000 + Math.random() * 1000); // Random delay for natural feel
    }

    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';

        // Simulate typing effect
        let i = 0;
        const typingSpeed = 15; // Speed in milliseconds
        const typeChar = () => {
            if (i < message.length) {
                messageElement.textContent += message.charAt(i);
                i++;
                setTimeout(typeChar, typingSpeed);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        };

        chatbotMessages.appendChild(messageElement);
        typeChar();

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.setAttribute('role', 'status');
        typingIndicator.setAttribute('aria-label', 'AI is typing');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }

        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to add quick reply buttons
    function addQuickReplies(replies) {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.addEventListener('click', () => {
                addUserMessage(reply);
                quickRepliesContainer.remove();

                // Show typing indicator
                showTypingIndicator();

                // Generate and display response after a delay
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = generateResponse(reply);
                    addBotMessage(response.message);

                    // Add quick reply buttons if available
                    if (response.quickReplies && response.quickReplies.length > 0) {
                        addQuickReplies(response.quickReplies);
                    }
                }, 1000 + Math.random() * 1000);
            });

            quickRepliesContainer.appendChild(button);
        });

        chatbotMessages.appendChild(quickRepliesContainer);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show welcome message
    function showWelcomeMessage() {
        setTimeout(() => {
            addBotMessage("INITIALIZING AI TERMINAL...");

            setTimeout(() => {
                addBotMessage("SYSTEM ONLINE. Welcome to AI Unplugged assistant. How can I help you today?");

                // Add initial quick replies
                setTimeout(() => {
                    addQuickReplies([
                        "What services do you offer?",
                        "How do I get started?",
                        "Tell me about AI chatbots",
                        "Schedule a consultation"
                    ]);
                }, 500);
            }, 1500);
        }, 500);
    }

    // Function to generate response based on user message
    function generateResponse(message) {
        message = message.toLowerCase();

        // Define responses for different user inputs
        if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
            return {
                message: "Hello! How can I assist you with AI solutions for your business today?",
                quickReplies: ["Tell me about your services", "How much does it cost?", "Case studies"]
            };
        }
        else if (message.includes("services") || message.includes("what do you offer")) {
            return {
                message: "We offer three main AI solutions:\n1. AI Chatbots for 24/7 customer support\n2. Predictive Analytics to optimize business decisions\n3. Business Automation to streamline operations\n\nWhich would you like to learn more about?",
                quickReplies: ["AI Chatbots", "Predictive Analytics", "Business Automation"]
            };
        }
        else if (message.includes("chatbot") || message.includes("chat bot")) {
            return {
                message: "Our AI chatbots provide 24/7 customer support, understand natural language, learn from interactions, and integrate with your existing systems. They can help reduce customer service costs by up to 80% while improving response times and customer satisfaction.",
                quickReplies: ["Chatbot pricing", "How to implement", "Other services"]
            };
        }
        else if (message.includes("analytics") || message.includes("data")) {
            return {
                message: "Our predictive analytics solutions turn your existing data into actionable intelligence. We can help with inventory optimization, sales forecasting, customer behavior analysis, and more. Many clients see ROI within the first 3 months of implementation.",
                quickReplies: ["Analytics pricing", "Implementation process", "Case studies"]
            };
        }
        else if (message.includes("automation") || message.includes("automate")) {
            return {
                message: "Our business automation solutions streamline operations and reduce manual tasks. We identify repetitive processes in your business that can be automated, saving time and reducing errors. Clients typically save 15+ hours per week on administrative tasks.",
                quickReplies: ["Automation pricing", "Implementation process", "Other services"]
            };
        }
        else if (message.includes("price") || message.includes("cost") || message.includes("pricing")) {
            return {
                message: "Our pricing is customized based on your specific business needs and scale. Solutions start at $299/month for small businesses. We offer flexible payment options and guarantee ROI. Would you like to schedule a free consultation for a custom quote?",
                quickReplies: ["Schedule consultation", "Tell me more about services", "ROI calculator"]
            };
        }
        else if (message.includes("get started") || message.includes("implementation") || message.includes("process")) {
            return {
                message: "Our implementation process is simple:\n1. Free consultation to understand your needs\n2. Custom solution design\n3. Implementation (typically 2-4 weeks)\n4. Training for your team\n5. Ongoing support and optimization\n\nReady to get started?",
                quickReplies: ["Schedule consultation", "Ask more questions", "Free assessment"]
            };
        }
        else if (message.includes("schedule") || message.includes("consultation") || message.includes("talk to someone")) {
            return {
                message: "Great! To schedule a free consultation, please visit our contact page or call us at (239) 745-8189. You can also provide your email address and we'll reach out to schedule a time that works for you.",
                quickReplies: ["Visit contact page", "Ask another question"]
            };
        }
        else if (message.includes("assessment") || message.includes("readiness")) {
            return {
                message: "Our free AI Readiness Assessment helps identify where AI can make the biggest impact in your business. It takes just 5 minutes to complete and provides personalized recommendations and ROI analysis. Would you like to take the assessment now?",
                quickReplies: ["Take assessment", "Tell me more", "Ask another question"]
            };
        }
        else if (message.includes("case stud") || message.includes("examples") || message.includes("success stories")) {
            return {
                message: "We've helped businesses across various industries implement AI solutions with great results:\n- Retail store: 80% reduction in customer service costs\n- Restaurant: 25% reduction in inventory waste\n- Service business: 15 hours/week saved on admin tasks\n\nWould you like more specific case studies?",
                quickReplies: ["Retail case study", "Restaurant case study", "Service business case study"]
            };
        }
        else if (message.includes("contact") || message.includes("email") || message.includes("phone")) {
            return {
                message: "You can reach us at:\nPhone: (239) 745-8189\nEmail: ai.unplugged11@gmail.com\nOr visit our contact page to fill out a form.",
                quickReplies: ["Visit contact page", "Ask another question"]
            };
        }
        else if (message.includes("thank")) {
            return {
                message: "You're welcome! Is there anything else I can help you with today?",
                quickReplies: ["Services", "Pricing", "Contact info", "No thanks"]
            };
        }
        else if (message.includes("bye") || message.includes("goodbye") || message.includes("no thanks")) {
            return {
                message: "Thank you for chatting with AI Unplugged! If you have any more questions in the future, don't hesitate to reach out. Have a great day!",
                quickReplies: []
            };
        }
        else {
            return {
                message: "I'm not sure I understand your question. Could you try rephrasing, or select one of these common topics?",
                quickReplies: ["Services", "Pricing", "Implementation process", "Contact us", "Schedule consultation"]
            };
        }
    }
}