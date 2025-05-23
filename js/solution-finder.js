// Interactive AI Solution Finder
document.addEventListener('DOMContentLoaded', function() {
    // Create Solution Finder UI
    createSolutionFinderUI();
    
    // Initialize Solution Finder functionality
    initSolutionFinder();
});

// Create Solution Finder UI
function createSolutionFinderUI() {
    const solutionFinderContainer = document.createElement('div');
    solutionFinderContainer.id = 'solution-finder-container';
    solutionFinderContainer.classList.add('solution-finder-hidden');
    
    solutionFinderContainer.innerHTML = `
        <div class="solution-finder-overlay"></div>
        <div class="solution-finder-modal">
            <div class="solution-finder-header">
                <h3>AI Solution Finder</h3>
                <button id="solution-finder-close" aria-label="Close solution finder">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="solution-finder-content">
                <div class="solution-finder-intro active" id="solution-finder-intro">
                    <h4>Find the Perfect AI Solution for Your Business</h4>
                    <p>Answer a few quick questions to get personalized AI recommendations for your specific business needs.</p>
                    <button id="solution-finder-start" class="solution-finder-button">Start Quiz</button>
                </div>
                <div class="solution-finder-questions" id="solution-finder-questions">
                    <!-- Questions will be added dynamically -->
                </div>
                <div class="solution-finder-results" id="solution-finder-results">
                    <h4>Your Personalized AI Recommendation</h4>
                    <div id="solution-finder-recommendation"></div>
                    <div class="solution-finder-actions">
                        <button id="solution-finder-restart" class="solution-finder-button secondary">Start Over</button>
                        <button id="solution-finder-schedule" class="solution-finder-button">Schedule Demo</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(solutionFinderContainer);
    
    // Add button to open solution finder
    const solutionFinderButton = document.createElement('button');
    solutionFinderButton.id = 'solution-finder-button';
    solutionFinderButton.innerHTML = '<i class="fas fa-robot"></i> Find Your AI Solution';
    solutionFinderButton.setAttribute('aria-label', 'Open AI Solution Finder');
    
    // Add solution finder button to page (next to the chatbot button)
    document.body.appendChild(solutionFinderButton);
    
    // Add styles
    addSolutionFinderStyles();
}

// Add styles
function addSolutionFinderStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #solution-finder-button {
            position: fixed;
            bottom: 90px;
            right: 20px;
            background-color: var(--primary-color, #4285f4);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Montserrat', sans-serif;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.3s ease;
        }
        
        #solution-finder-button:hover {
            transform: translateY(-2px);
        }
        
        #solution-finder-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Montserrat', sans-serif;
        }
        
        .solution-finder-hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .solution-finder-visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .solution-finder-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
        }
        
        .solution-finder-modal {
            position: relative;
            width: 90%;
            max-width: 550px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            z-index: 1;
        }
        
        .solution-finder-header {
            background-color: var(--primary-color, #4285f4);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .solution-finder-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        #solution-finder-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        
        .solution-finder-content {
            padding: 20px;
            min-height: 300px;
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .solution-finder-intro,
        .solution-finder-questions,
        .solution-finder-results {
            display: none;
        }
        
        .solution-finder-intro.active,
        .solution-finder-questions.active,
        .solution-finder-results.active {
            display: block;
        }
        
        .solution-finder-button {
            background-color: var(--primary-color, #4285f4);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            font-family: 'Montserrat', sans-serif;
            margin-top: 20px;
            transition: background-color 0.2s ease;
        }
        
        .solution-finder-button:hover {
            background-color: var(--secondary-color, #3367d6);
        }
        
        .solution-finder-button.secondary {
            background-color: #f0f0f0;
            color: #333;
        }
        
        .solution-finder-button.secondary:hover {
            background-color: #e0e0e0;
        }
        
        .solution-finder-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        
        .question-container {
            margin-bottom: 30px;
        }
        
        .question-container h4 {
            margin-bottom: 15px;
        }
        
        .answers-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .answer-option {
            background-color: #f5f5f5;
            border: 2px solid #eee;
            border-radius: 5px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .answer-option:hover {
            border-color: var(--primary-color, #4285f4);
            transform: translateY(-2px);
        }
        
        .answer-option.selected {
            border-color: var(--primary-color, #4285f4);
            background-color: rgba(66, 133, 244, 0.1);
        }
        
        .question-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        
        .solution-card {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin-top: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .solution-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--primary-color, #4285f4);
        }
        
        .solution-description {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .solution-features {
            margin-top: 15px;
        }
        
        .solution-features h5 {
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .feature-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        
        .feature-list li {
            padding: 5px 0 5px 25px;
            position: relative;
        }
        
        .feature-list li:before {
            content: "✓";
            color: var(--primary-color, #4285f4);
            position: absolute;
            left: 0;
        }
        
        .match-percentage {
            display: inline-block;
            background-color: var(--primary-color, #4285f4);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        /* Dark mode support */
        body.dark-mode .solution-finder-modal {
            background-color: #2a2a2a;
            color: #e0e0e0;
        }
        
        body.dark-mode .solution-finder-button.secondary {
            background-color: #3a3a3a;
            color: #e0e0e0;
        }
        
        body.dark-mode .solution-finder-button.secondary:hover {
            background-color: #444;
        }
        
        body.dark-mode .answer-option {
            background-color: #3a3a3a;
            border-color: #444;
        }
        
        body.dark-mode .answer-option.selected {
            background-color: rgba(66, 133, 244, 0.2);
        }
        
        body.dark-mode .solution-card {
            background-color: #333;
        }
        
        @media (max-width: 768px) {
            .solution-finder-modal {
                width: 95%;
                height: 80%;
                max-height: 80vh;
            }
            
            #solution-finder-button {
                bottom: 80px;
                right: 10px;
                font-size: 12px;
                padding: 8px 12px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize Solution Finder
function initSolutionFinder() {
    // Elements
    const solutionFinderContainer = document.getElementById('solution-finder-container');
    const solutionFinderButton = document.getElementById('solution-finder-button');
    const closeButton = document.getElementById('solution-finder-close');
    const startButton = document.getElementById('solution-finder-start');
    const restartButton = document.getElementById('solution-finder-restart');
    const scheduleButton = document.getElementById('solution-finder-schedule');
    const introSection = document.getElementById('solution-finder-intro');
    const questionsSection = document.getElementById('solution-finder-questions');
    const resultsSection = document.getElementById('solution-finder-results');
    const recommendationContainer = document.getElementById('solution-finder-recommendation');
    
    // Questions data
    const questions = [
        {
            id: 'industry',
            question: 'What industry is your business in?',
            answers: [
                { id: 'retail', text: 'Retail / E-commerce' },
                { id: 'healthcare', text: 'Healthcare / Medical' },
                { id: 'finance', text: 'Finance / Banking' },
                { id: 'professional', text: 'Professional Services' },
                { id: 'manufacturing', text: 'Manufacturing' },
                { id: 'other', text: 'Other' }
            ]
        },
        {
            id: 'size',
            question: 'How many employees does your company have?',
            answers: [
                { id: 'solo', text: 'Just me (Solopreneur)' },
                { id: 'small', text: '2-10 employees' },
                { id: 'medium', text: '11-50 employees' },
                { id: 'large', text: '51-200 employees' },
                { id: 'enterprise', text: '200+ employees' }
            ]
        },
        {
            id: 'challenge',
            question: 'What\'s your biggest business challenge right now?',
            answers: [
                { id: 'customer-service', text: 'Improving customer service / support' },
                { id: 'data-analysis', text: 'Making sense of business data' },
                { id: 'efficiency', text: 'Automating repetitive tasks' },
                { id: 'growth', text: 'Growing revenue / customer base' },
                { id: 'costs', text: 'Reducing operational costs' }
            ]
        },
        {
            id: 'tech-comfort',
            question: 'How comfortable is your team with adopting new technology?',
            answers: [
                { id: 'very-comfortable', text: 'Very comfortable - we love trying new tech' },
                { id: 'comfortable', text: 'Comfortable - we adapt well with training' },
                { id: 'neutral', text: 'Neutral - depends on the technology' },
                { id: 'hesitant', text: 'Somewhat hesitant - we need convincing' },
                { id: 'resistant', text: 'Resistant - significant change management needed' }
            ]
        },
        {
            id: 'timeframe',
            question: 'What\'s your implementation timeframe?',
            answers: [
                { id: 'immediate', text: 'As soon as possible' },
                { id: 'quarter', text: 'Within this quarter' },
                { id: 'six-months', text: 'Within 6 months' },
                { id: 'year', text: 'Within a year' },
                { id: 'exploring', text: 'Just exploring options' }
            ]
        }
    ];
    
    // Solutions data
    const solutions = {
        'chatbot': {
            title: 'AI Chatbot Solution',
            description: 'Our AI Chatbot provides 24/7 customer support, handling multiple inquiries simultaneously while continuously learning and improving from each interaction.',
            features: [
                'Immediate response to customer inquiries',
                'Integration with your website and CRM',
                'Natural language understanding',
                'Continuous learning from interactions',
                'Multilingual support',
                'Seamless human handoff for complex issues'
            ],
            bestFor: ['customer-service', 'retail', 'small', 'medium', 'immediate', 'quarter']
        },
        'analytics': {
            title: 'Predictive Analytics Solution',
            description: 'Our Predictive Analytics platform transforms your business data into actionable insights, helping you make informed decisions and anticipate market changes.',
            features: [
                'Custom dashboards and reporting',
                'Sales and revenue forecasting',
                'Customer behavior analysis',
                'Inventory optimization',
                'Risk assessment models',
                'Market trend identification'
            ],
            bestFor: ['data-analysis', 'finance', 'healthcare', 'medium', 'large', 'six-months', 'year']
        },
        'automation': {
            title: 'Business Process Automation',
            description: 'Our Automation solution streamlines your operations by automating repetitive tasks, document processing, and workflow management, freeing your team to focus on higher-value activities.',
            features: [
                'Document processing and data extraction',
                'Workflow automation and management',
                'Integration with existing systems',
                'Task prioritization and assignment',
                'Compliance and quality control',
                'Performance analytics and reporting'
            ],
            bestFor: ['efficiency', 'costs', 'manufacturing', 'professional', 'medium', 'large', 'enterprise']
        },
        'comprehensive': {
            title: 'Comprehensive AI Solution Suite',
            description: 'Our complete AI suite combines chatbots, analytics, and automation in an integrated platform tailored to your specific business needs and goals.',
            features: [
                'All features of our individual solutions',
                'Seamless integration between components',
                'Unified dashboard and reporting',
                'Enterprise-grade security and compliance',
                'Dedicated implementation team',
                'Ongoing optimization and support'
            ],
            bestFor: ['enterprise', 'growth', 'very-comfortable', 'comfortable', 'finance', 'healthcare']
        }
    };
    
    // State variables
    let currentQuestionIndex = 0;
    let userAnswers = {};
    
    // Open solution finder
    solutionFinderButton.addEventListener('click', function() {
        solutionFinderContainer.classList.remove('solution-finder-hidden');
        solutionFinderContainer.classList.add('solution-finder-visible');
    });
    
    // Close solution finder
    closeButton.addEventListener('click', function() {
        solutionFinderContainer.classList.remove('solution-finder-visible');
        solutionFinderContainer.classList.add('solution-finder-hidden');
    });
    
    // Start quiz
    startButton.addEventListener('click', function() {
        introSection.classList.remove('active');
        questionsSection.classList.add('active');
        
        // Reset user answers and current question
        userAnswers = {};
        currentQuestionIndex = 0;
        
        // Display first question
        displayQuestion(0);
    });
    
    // Restart quiz
    restartButton.addEventListener('click', function() {
        resultsSection.classList.remove('active');
        questionsSection.classList.add('active');
        
        // Reset user answers and current question
        userAnswers = {};
        currentQuestionIndex = 0;
        
        // Display first question
        displayQuestion(0);
    });
    
    // Schedule demo
    scheduleButton.addEventListener('click', function() {
        // Close solution finder
        solutionFinderContainer.classList.remove('solution-finder-visible');
        solutionFinderContainer.classList.add('solution-finder-hidden');
        
        // Open chatbot and trigger demo scheduling
        const chatbotButton = document.getElementById('chatbot-button');
        if (chatbotButton) {
            chatbotButton.click();
            
            // Find chatbot message input and send button
            const chatbotInput = document.getElementById('chatbot-message');
            const chatbotSend = document.getElementById('chatbot-send');
            
            if (chatbotInput && chatbotSend) {
                // Wait for chatbot to fully open
                setTimeout(() => {
                    // Set message to schedule a demo
                    chatbotInput.value = "Schedule a demo";
                    // Dispatch input event to trigger any value change listeners
                    chatbotInput.dispatchEvent(new Event('input', { bubbles: true }));
                    // Click send button
                    chatbotSend.click();
                }, 500);
            }
        }
    });
    
    // Display question
    function displayQuestion(index) {
        // Clear questions container
        questionsSection.innerHTML = '';
        
        // Get current question
        const question = questions[index];
        
        // Create question container
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        
        // Create question title
        const questionTitle = document.createElement('h4');
        questionTitle.textContent = question.question;
        questionContainer.appendChild(questionTitle);
        
        // Create answers list
        const answersList = document.createElement('div');
        answersList.classList.add('answers-list');
        
        // Create answer options
        question.answers.forEach(answer => {
            const answerOption = document.createElement('div');
            answerOption.classList.add('answer-option');
            answerOption.textContent = answer.text;
            answerOption.dataset.id = answer.id;
            
            // Check if this answer is already selected
            if (userAnswers[question.id] === answer.id) {
                answerOption.classList.add('selected');
            }
            
            // Add click event
            answerOption.addEventListener('click', function() {
                // Remove selected class from all options
                document.querySelectorAll('.answer-option').forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                answerOption.classList.add('selected');
                
                // Save answer
                userAnswers[question.id] = answer.id;
                
                // Enable next button if disabled
                const nextButton = document.querySelector('.next-button');
                if (nextButton) {
                    nextButton.disabled = false;
                }
            });
            
            answersList.appendChild(answerOption);
        });
        
        questionContainer.appendChild(answersList);
        
        // Add navigation buttons
        const navigationContainer = document.createElement('div');
        navigationContainer.classList.add('question-navigation');
        
        // Back button (disabled on first question)
        const backButton = document.createElement('button');
        backButton.classList.add('solution-finder-button', 'secondary', 'back-button');
        backButton.textContent = 'Back';
        backButton.disabled = index === 0;
        backButton.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion(currentQuestionIndex);
            }
        });
        
        // Next button (or Finish on last question)
        const nextButton = document.createElement('button');
        nextButton.classList.add('solution-finder-button', 'next-button');
        
        if (index === questions.length - 1) {
            nextButton.textContent = 'Get Results';
            nextButton.addEventListener('click', function() {
                showResults();
            });
        } else {
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', function() {
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                }
            });
        }
        
        // Disable next button if no answer selected
        nextButton.disabled = !userAnswers[question.id];
        
        navigationContainer.appendChild(backButton);
        navigationContainer.appendChild(nextButton);
        
        questionContainer.appendChild(navigationContainer);
        
        // Add to questions section
        questionsSection.appendChild(questionContainer);
    }
    
    // Show results
    function showResults() {
        // Hide questions section
        questionsSection.classList.remove('active');
        
        // Show results section
        resultsSection.classList.add('active');
        
        // Calculate best solution
        const recommendedSolution = calculateRecommendation();
        
        // Display recommendation
        displayRecommendation(recommendedSolution);
    }
    
    // Calculate recommendation
    function calculateRecommendation() {
        // Calculate match score for each solution
        const scores = {};
        
        Object.keys(solutions).forEach(solutionId => {
            const solution = solutions[solutionId];
            let score = 0;
            
            // Check how many of the user's answers match this solution's best fits
            Object.values(userAnswers).forEach(answerId => {
                if (solution.bestFor.includes(answerId)) {
                    score += 1;
                }
            });
            
            // Store score
            scores[solutionId] = score;
        });
        
        // Find solution with highest score
        let bestSolution = Object.keys(scores)[0];
        let highestScore = scores[bestSolution];
        
        Object.keys(scores).forEach(solutionId => {
            if (scores[solutionId] > highestScore) {
                bestSolution = solutionId;
                highestScore = scores[solutionId];
            }
        });
        
        // Calculate match percentage
        const maxPossibleScore = Object.keys(userAnswers).length;
        const matchPercentage = Math.round((highestScore / maxPossibleScore) * 100);
        
        return {
            solution: solutions[bestSolution],
            percentage: matchPercentage
        };
    }
    
    // Display recommendation
    function displayRecommendation(recommendation) {
        // Clear recommendation container
        recommendationContainer.innerHTML = '';
        
        // Create match percentage
        const matchBadge = document.createElement('div');
        matchBadge.classList.add('match-percentage');
        matchBadge.textContent = `${recommendation.percentage}% Match`;
        
        // Create solution card
        const solutionCard = document.createElement('div');
        solutionCard.classList.add('solution-card');
        
        // Solution title
        const solutionTitle = document.createElement('div');
        solutionTitle.classList.add('solution-title');
        solutionTitle.textContent = recommendation.solution.title;
        
        // Solution description
        const solutionDescription = document.createElement('div');
        solutionDescription.classList.add('solution-description');
        solutionDescription.textContent = recommendation.solution.description;
        
        // Solution features
        const solutionFeatures = document.createElement('div');
        solutionFeatures.classList.add('solution-features');
        
        const featuresTitle = document.createElement('h5');
        featuresTitle.textContent = 'Key Features:';
        
        const featuresList = document.createElement('ul');
        featuresList.classList.add('feature-list');
        
        recommendation.solution.features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.textContent = feature;
            featuresList.appendChild(featureItem);
        });
        
        solutionFeatures.appendChild(featuresTitle);
        solutionFeatures.appendChild(featuresList);
        
        // Assemble solution card
        solutionCard.appendChild(solutionTitle);
        solutionCard.appendChild(solutionDescription);
        solutionCard.appendChild(solutionFeatures);
        
        // Assemble recommendation
        recommendationContainer.appendChild(matchBadge);
        recommendationContainer.appendChild(solutionCard);
    }
}

// Cookie functions for potential future use (saving preferences, tracking completions)
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
} 