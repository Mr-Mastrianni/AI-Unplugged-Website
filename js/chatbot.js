// Simple AI Chatbot for AI Unplugged website
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot UI
    createChatbotUI();
    
    // Initialize chatbot functionality
    initChatbot();
});

// Create chatbot UI elements
function createChatbotUI() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.classList.add('chatbot-collapsed');
    chatbotContainer.setAttribute('aria-live', 'polite');
    chatbotContainer.setAttribute('role', 'dialog');
    chatbotContainer.setAttribute('aria-labelledby', 'chatbot-header');
    
    // Create chatbot button
    const chatbotButton = document.createElement('button');
    chatbotButton.id = 'chatbot-button';
    chatbotButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
    chatbotButton.setAttribute('aria-label', 'Open chat assistant');
    chatbotButton.setAttribute('aria-expanded', 'false');
    
    // Create chatbot content
    const chatbotContent = document.createElement('div');
    chatbotContent.id = 'chatbot-content';
    
    // Create chatbot header
    const chatbotHeader = document.createElement('div');
    chatbotHeader.id = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <h3 id="chatbot-title">AI Assistant</h3>
        <button id="chatbot-minimize" aria-label="Minimize chat">
            <i class="fas fa-minus"></i>
        </button>
    `;
    
    // Create chatbot messages container
    const chatbotMessages = document.createElement('div');
    chatbotMessages.id = 'chatbot-messages';
    chatbotMessages.setAttribute('aria-live', 'polite');
    
    // Create chatbot input area
    const chatbotInput = document.createElement('div');
    chatbotInput.id = 'chatbot-input';
    chatbotInput.innerHTML = `
        <input type="text" id="chatbot-message" placeholder="Type your question..." aria-label="Type your message">
        <button id="chatbot-send" aria-label="Send message">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;
    
    // Assemble chatbot elements
    chatbotContent.appendChild(chatbotHeader);
    chatbotContent.appendChild(chatbotMessages);
    chatbotContent.appendChild(chatbotInput);
    
    chatbotContainer.appendChild(chatbotButton);
    chatbotContainer.appendChild(chatbotContent);
    
    // Add chatbot to page
    document.body.appendChild(chatbotContainer);
    
    // Add chatbot styles
    addChatbotStyles();
}

// Add styles for the chatbot
function addChatbotStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: 'Montserrat', sans-serif;
            transition: all 0.3s ease;
        }
        
        #chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color, #4285f4);
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        
        #chatbot-button:hover {
            transform: scale(1.05);
        }
        
        #chatbot-content {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 350px;
            height: 450px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        }
        
        .chatbot-expanded #chatbot-content {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        
        #chatbot-header {
            background-color: var(--primary-color, #4285f4);
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #chatbot-title {
            margin: 0;
            font-size: 16px;
        }
        
        #chatbot-minimize {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        
        #chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .chat-message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 18px;
            margin-bottom: 5px;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .bot-message {
            background-color: #f0f0f0;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }
        
        .user-message {
            background-color: var(--primary-color, #4285f4);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }
        
        #chatbot-input {
            display: flex;
            padding: 10px 15px;
            border-top: 1px solid #eee;
        }
        
        #chatbot-message {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
        }
        
        #chatbot-send {
            background: none;
            border: none;
            color: var(--primary-color, #4285f4);
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
        }
        
        .typing-indicator {
            display: flex;
            padding: 10px 15px;
            background-color: #f0f0f0;
            border-radius: 18px;
            align-self: flex-start;
            width: fit-content;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #777;
            border-radius: 50%;
            margin: 0 2px;
            animation: typing-animation 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing-animation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-5px);
            }
        }
        
        /* Dark mode support */
        body.dark-mode #chatbot-content {
            background-color: #2a2a2a;
            color: #e0e0e0;
        }
        
        body.dark-mode #chatbot-message {
            background-color: #3a3a3a;
            border-color: #444;
            color: #e0e0e0;
        }
        
        body.dark-mode .bot-message {
            background-color: #3a3a3a;
        }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
            #chatbot-content {
                width: 300px;
                right: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize chatbot functionality
function initChatbot() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotInput = document.getElementById('chatbot-message');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Toggle chatbot visibility
    chatbotButton.addEventListener('click', function() {
        chatbotContainer.classList.toggle('chatbot-expanded');
        chatbotContainer.classList.toggle('chatbot-collapsed');
        
        const isExpanded = chatbotContainer.classList.contains('chatbot-expanded');
        chatbotButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        
        if (isExpanded) {
            // Add initial message if this is the first time opening
            if (chatbotMessages.childElementCount === 0) {
                addBotMessage("Hi there! I'm the AI Unplugged assistant. How can I help you with AI solutions for your small business?");
                
                // Add suggestions
                addSuggestionButtons();
            }
            
            // Focus on input
            chatbotInput.focus();
        }
    });
    
    // Minimize chatbot
    chatbotMinimize.addEventListener('click', function() {
        chatbotContainer.classList.remove('chatbot-expanded');
        chatbotContainer.classList.add('chatbot-collapsed');
        chatbotButton.setAttribute('aria-expanded', 'false');
    });
    
    // Send message on enter
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);
    
    // Send user message and get response
    function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            chatbotInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process user message and generate response (with delay to simulate thinking)
            setTimeout(() => {
                // Remove typing indicator
                hideTypingIndicator();
                
                // Generate and add bot response
                const response = generateResponse(message);
                addBotMessage(response);
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }
    }
    
    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'user-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'bot-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.setAttribute('aria-label', 'AI assistant is typing');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('typing-dot');
            typingIndicator.appendChild(dot);
        }
        
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Add suggestion buttons
    function addSuggestionButtons() {
        const suggestions = [
            "What AI solutions do you offer?",
            "How much does it cost?",
            "What's the implementation process?"
        ];
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('suggestion-buttons');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexWrap = 'wrap';
        buttonsContainer.style.gap = '5px';
        buttonsContainer.style.marginTop = '10px';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.textContent = suggestion;
            button.style.fontSize = '12px';
            button.style.padding = '8px 12px';
            button.style.backgroundColor = '#f0f0f0';
            button.style.border = 'none';
            button.style.borderRadius = '15px';
            button.style.cursor = 'pointer';
            button.style.marginBottom = '5px';
            button.setAttribute('aria-label', `Ask: ${suggestion}`);
            
            button.addEventListener('click', function() {
                // Add user message
                addUserMessage(suggestion);
                
                // Show typing indicator
                showTypingIndicator();
                
                // Process user message and generate response (with delay to simulate thinking)
                setTimeout(() => {
                    // Remove typing indicator
                    hideTypingIndicator();
                    
                    // Generate and add bot response
                    const response = generateResponse(suggestion);
                    addBotMessage(response);
                    
                    // Scroll to bottom
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000 + Math.random() * 1000);
            });
            
            // Dark mode support
            if (document.body.classList.contains('dark-mode')) {
                button.style.backgroundColor = '#3a3a3a';
                button.style.color = '#e0e0e0';
            }
            
            buttonsContainer.appendChild(button);
        });
        
        chatbotMessages.appendChild(buttonsContainer);
    }
    
    // Generate response based on user message
    function generateResponse(message) {
        message = message.toLowerCase();
        
        // Common responses based on keywords
        if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
            return "Hello! How can I help you with AI solutions today?";
        }
        
        if (message.includes('what') && message.includes('solution')) {
            return "We offer three main AI solutions: AI Chatbots for 24/7 customer support, Predictive Analytics for data-driven insights, and Business Automation to streamline your operations.";
        }
        
        if (message.includes('chatbot')) {
            return "Our AI Chatbots provide 24/7 customer support, can handle multiple inquiries simultaneously, and learn from interactions. They integrate seamlessly with your website and existing systems.";
        }
        
        if (message.includes('analytic')) {
            return "Our Predictive Analytics solutions help you optimize inventory, forecast sales, and make data-driven decisions. We transform your existing data into actionable insights.";
        }
        
        if (message.includes('automation')) {
            return "Our Business Automation solutions streamline operations by automating repetitive tasks, document processing, and workflow management, freeing your team to focus on growth.";
        }
        
        if (message.includes('cost') || message.includes('price') || message.includes('how much')) {
            return "Our pricing is customized based on your business needs and solution scope. Typically, our solutions start at $499/month. Would you like to schedule a consultation for a personalized quote?";
        }
        
        if (message.includes('implementation') || message.includes('process')) {
            return "Our implementation process has 5 steps: Consultation, Solution Design, Implementation, Training, and Ongoing Support. Most solutions can be implemented within 2-4 weeks.";
        }
        
        if (message.includes('contact') || message.includes('talk to') || message.includes('schedule')) {
            return "You can schedule a consultation by visiting our contact page or calling us at 2397458189. Would you like me to help you with that?";
        }
        
        if (message.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Default response
        return "That's a great question. Our team would be happy to discuss this in more detail. Would you like to schedule a free consultation to learn more about how we can help your business?";
    }
} 