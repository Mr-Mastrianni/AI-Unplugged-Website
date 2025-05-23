// AI Implementation Roadmap Generator
document.addEventListener('DOMContentLoaded', function() {
    // Create roadmap generator UI if the container exists
    if (document.getElementById('roadmap-generator')) {
        createRoadmapUI();
    }
});

// Create Roadmap Generator UI
function createRoadmapUI() {
    const container = document.getElementById('roadmap-generator');
    container.classList.add('roadmap-container');
    
    // Create form section
    const formSection = document.createElement('div');
    formSection.classList.add('roadmap-form-section');
    
    formSection.innerHTML = `
        <h2>Generate Your AI Implementation Roadmap</h2>
        <p>Answer a few questions to receive a personalized AI implementation plan tailored to your business.</p>
        
        <form id="roadmap-form" class="roadmap-form">
            <div class="form-group">
                <label for="business-size">Business Size</label>
                <select id="business-size" required>
                    <option value="">Select your business size</option>
                    <option value="small">Small (1-10 employees)</option>
                    <option value="medium">Medium (11-50 employees)</option>
                    <option value="large">Large (51-200 employees)</option>
                    <option value="enterprise">Enterprise (200+ employees)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="industry">Industry</label>
                <select id="industry" required>
                    <option value="">Select your industry</option>
                    <option value="retail">Retail / E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance / Banking</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="professional">Professional Services</option>
                    <option value="technology">Technology</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>AI Solutions You're Interested In (Select all that apply)</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="solutions" value="chatbot"> AI Chatbots
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="solutions" value="analytics"> Predictive Analytics
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="solutions" value="automation"> Business Process Automation
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="solutions" value="document-processing"> Document Processing
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="implementation-speed">Implementation Timeline Preference</label>
                <select id="implementation-speed" required>
                    <option value="">Select your preferred timeline</option>
                    <option value="aggressive">Aggressive (As fast as possible)</option>
                    <option value="balanced">Balanced (Moderate pace)</option>
                    <option value="conservative">Conservative (Gradual rollout)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="tech-readiness">Technical Readiness</label>
                <select id="tech-readiness" required>
                    <option value="">Select your technical readiness</option>
                    <option value="high">High (Advanced systems, tech-savvy team)</option>
                    <option value="medium">Medium (Modern systems, some expertise)</option>
                    <option value="low">Low (Legacy systems, limited expertise)</option>
                </select>
            </div>
            
            <button type="submit" class="roadmap-submit">Generate Roadmap</button>
        </form>
    `;
    
    container.appendChild(formSection);
    
    // Create results section (initially hidden)
    const resultsSection = document.createElement('div');
    resultsSection.classList.add('roadmap-results-section');
    resultsSection.style.display = 'none';
    
    resultsSection.innerHTML = `
        <div class="roadmap-header">
            <h2>Your AI Implementation Roadmap</h2>
            <p>Based on your inputs, here's a customized implementation plan for your business.</p>
            <button id="edit-roadmap" class="edit-roadmap-button">Edit Inputs</button>
        </div>
        
        <div id="roadmap-timeline" class="roadmap-timeline"></div>
        
        <div class="roadmap-summary">
            <h3>Implementation Overview</h3>
            <div id="roadmap-overview" class="roadmap-overview"></div>
        </div>
        
        <div class="roadmap-actions">
            <button id="download-roadmap" class="download-button">Download Roadmap PDF</button>
            <button id="schedule-consultation" class="schedule-button">Schedule Implementation Consultation</button>
        </div>
    `;
    
    container.appendChild(resultsSection);
    
    // Add styles
    addRoadmapStyles();
    
    // Add event listeners
    document.getElementById('roadmap-form').addEventListener('submit', function(e) {
        e.preventDefault();
        generateRoadmap();
    });
    
    // When loaded, add event listeners for the results section buttons
    document.getElementById('edit-roadmap').addEventListener('click', function() {
        document.querySelector('.roadmap-form-section').style.display = 'block';
        document.querySelector('.roadmap-results-section').style.display = 'none';
    });
    
    document.getElementById('download-roadmap').addEventListener('click', function() {
        alert('The roadmap PDF would be generated and downloaded here in a production environment.');
        // In a real implementation, we would use a library like jsPDF to generate and download a PDF
    });
    
    document.getElementById('schedule-consultation').addEventListener('click', function() {
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
                    chatbotInput.value = "I'd like to schedule an implementation consultation";
                    // Dispatch input event to trigger any value change listeners
                    chatbotInput.dispatchEvent(new Event('input', { bubbles: true }));
                    // Click send button
                    chatbotSend.click();
                }, 500);
            }
        }
    });
}

// Generate Roadmap based on inputs
function generateRoadmap() {
    // Get form values
    const businessSize = document.getElementById('business-size').value;
    const industry = document.getElementById('industry').value;
    const implementationSpeed = document.getElementById('implementation-speed').value;
    const techReadiness = document.getElementById('tech-readiness').value;
    
    // Get selected solutions
    const solutions = [];
    document.querySelectorAll('input[name="solutions"]:checked').forEach(checkbox => {
        solutions.push(checkbox.value);
    });
    
    // Validate that at least one solution is selected
    if (solutions.length === 0) {
        alert('Please select at least one AI solution you are interested in.');
        return;
    }
    
    // Generate roadmap data
    const roadmapData = generateRoadmapData(businessSize, industry, solutions, implementationSpeed, techReadiness);
    
    // Render roadmap
    renderRoadmap(roadmapData);
    
    // Hide form, show results
    document.querySelector('.roadmap-form-section').style.display = 'none';
    document.querySelector('.roadmap-results-section').style.display = 'block';
    
    // Scroll to results
    document.querySelector('.roadmap-results-section').scrollIntoView({ behavior: 'smooth' });
}

// Generate roadmap data based on inputs
function generateRoadmapData(businessSize, industry, solutions, implementationSpeed, techReadiness) {
    // Base duration in weeks for each phase depending on implementation speed
    const speedMultipliers = {
        'aggressive': 0.7,
        'balanced': 1,
        'conservative': 1.5
    };
    
    // Base duration in weeks for each phase depending on business size
    const sizeMultipliers = {
        'small': 0.8,
        'medium': 1,
        'large': 1.3,
        'enterprise': 1.8
    };
    
    // Technical readiness impact
    const readinessMultipliers = {
        'high': 0.8,
        'medium': 1,
        'low': 1.4
    };
    
    // Base phases for all implementations
    const basePhases = [
        {
            name: "Discovery & Assessment",
            description: "Evaluate current processes, identify opportunities, and define success metrics.",
            baseDuration: 2,
            tasks: [
                "Stakeholder interviews",
                "Current process documentation",
                "Opportunity identification",
                "Success metric definition"
            ]
        },
        {
            name: "Solution Design",
            description: "Design custom AI solutions based on business requirements and technical specifications.",
            baseDuration: 2,
            tasks: [
                "Technical requirements gathering",
                "Solution architecture design",
                "Integration planning",
                "Data flow mapping"
            ]
        },
        {
            name: "Development & Configuration",
            description: "Build and configure AI solutions according to the approved design.",
            baseDuration: 4,
            tasks: [
                "Environment setup",
                "Core functionality development",
                "Integration development",
                "Initial configuration"
            ]
        },
        {
            name: "Testing & Validation",
            description: "Thoroughly test all aspects of the AI solution to ensure quality and performance.",
            baseDuration: 2,
            tasks: [
                "Functional testing",
                "Performance testing",
                "Integration testing",
                "User acceptance testing"
            ]
        },
        {
            name: "Deployment & Training",
            description: "Deploy the solution and train your team on effective usage and management.",
            baseDuration: 2,
            tasks: [
                "Production deployment",
                "User training sessions",
                "Administrator training",
                "Documentation handover"
            ]
        },
        {
            name: "Optimization & Support",
            description: "Continuously monitor, optimize and provide support for your AI solution.",
            baseDuration: 4,
            tasks: [
                "Performance monitoring",
                "Incremental improvements",
                "Model retraining (if applicable)",
                "Ongoing support"
            ]
        }
    ];
    
    // Adjust phases based on selected solutions
    let customPhases = JSON.parse(JSON.stringify(basePhases)); // Deep copy
    
    if (solutions.includes('chatbot')) {
        // Add chatbot-specific tasks
        customPhases.find(p => p.name === "Development & Configuration").tasks.push("Conversation flow design");
        customPhases.find(p => p.name === "Development & Configuration").tasks.push("Knowledge base setup");
        customPhases.find(p => p.name === "Testing & Validation").tasks.push("Conversation testing");
    }
    
    if (solutions.includes('analytics')) {
        // Add analytics-specific tasks
        customPhases.find(p => p.name === "Discovery & Assessment").tasks.push("Data source identification");
        customPhases.find(p => p.name === "Solution Design").tasks.push("Data model design");
        customPhases.find(p => p.name === "Development & Configuration").tasks.push("Dashboard creation");
        customPhases.find(p => p.name === "Optimization & Support").tasks.push("Model accuracy monitoring");
    }
    
    if (solutions.includes('automation')) {
        // Add automation-specific tasks
        customPhases.find(p => p.name === "Discovery & Assessment").tasks.push("Workflow analysis");
        customPhases.find(p => p.name === "Solution Design").tasks.push("Automation rule design");
        customPhases.find(p => p.name === "Development & Configuration").tasks.push("Workflow automation setup");
    }
    
    if (solutions.includes('document-processing')) {
        // Add document processing specific tasks
        customPhases.find(p => p.name === "Discovery & Assessment").tasks.push("Document type analysis");
        customPhases.find(p => p.name === "Solution Design").tasks.push("Extraction template design");
        customPhases.find(p => p.name === "Development & Configuration").tasks.push("OCR configuration");
        customPhases.find(p => p.name === "Testing & Validation").tasks.push("Accuracy verification");
    }
    
    // Calculate durations and timeline
    let currentWeek = 0;
    customPhases.forEach(phase => {
        // Calculate phase duration based on multipliers
        const speedMultiplier = speedMultipliers[implementationSpeed];
        const sizeMultiplier = sizeMultipliers[businessSize];
        const readinessMultiplier = readinessMultipliers[techReadiness];
        
        // Additional multiplier based on number of solutions
        const solutionCountMultiplier = 1 + ((solutions.length - 1) * 0.2); // 20% more time per additional solution
        
        // Calculate final duration (rounded to nearest 0.5)
        let duration = phase.baseDuration * speedMultiplier * sizeMultiplier * readinessMultiplier * solutionCountMultiplier;
        duration = Math.round(duration * 2) / 2; // Round to nearest 0.5
        
        // Set timeline
        phase.startWeek = currentWeek;
        phase.duration = duration;
        phase.endWeek = currentWeek + duration;
        
        // Update current week for next phase
        currentWeek = phase.endWeek;
    });
    
    // Generate implementation overview
    const totalDuration = Math.round(customPhases[customPhases.length - 1].endWeek);
    const complexity = determineComplexity(solutions, businessSize, techReadiness);
    const costRange = estimateCostRange(solutions, businessSize, complexity);
    const teamSize = estimateTeamSize(solutions, businessSize, complexity);
    
    // Create roadmap data object
    return {
        phases: customPhases,
        overview: {
            totalDuration,
            complexity,
            costRange,
            teamSize,
            solutions
        }
    };
}

// Render roadmap UI
function renderRoadmap(roadmapData) {
    // Render timeline
    const timelineContainer = document.getElementById('roadmap-timeline');
    timelineContainer.innerHTML = '';
    
    // Add timeline header
    const timelineHeader = document.createElement('div');
    timelineHeader.classList.add('timeline-header');
    
    // Generate week markers
    const totalWeeks = Math.ceil(roadmapData.phases[roadmapData.phases.length - 1].endWeek);
    let weekMarkersHTML = '';
    for (let i = 0; i <= totalWeeks; i++) {
        weekMarkersHTML += `<div class="week-marker">Week ${i}</div>`;
    }
    
    timelineHeader.innerHTML = `
        <div class="phase-label">Implementation Phases</div>
        <div class="timeline-weeks">
            ${weekMarkersHTML}
        </div>
    `;
    timelineContainer.appendChild(timelineHeader);
    
    // Add phases to timeline
    roadmapData.phases.forEach(phase => {
        const phaseRow = document.createElement('div');
        phaseRow.classList.add('timeline-phase');
        
        // Calculate position and width percentages
        const startPercent = (phase.startWeek / totalWeeks) * 100;
        const widthPercent = (phase.duration / totalWeeks) * 100;
        
        phaseRow.innerHTML = `
            <div class="phase-info">
                <h4>${phase.name}</h4>
                <p>${phase.description}</p>
            </div>
            <div class="phase-timeline">
                <div class="phase-bar" style="left: ${startPercent}%; width: ${widthPercent}%;">
                    <span class="phase-duration">${phase.duration} weeks</span>
                </div>
            </div>
        `;
        
        timelineContainer.appendChild(phaseRow);
        
        // Add tasks
        const tasksContainer = document.createElement('div');
        tasksContainer.classList.add('phase-tasks');
        
        let tasksHTML = '<ul>';
        phase.tasks.forEach(task => {
            tasksHTML += `<li>${task}</li>`;
        });
        tasksHTML += '</ul>';
        
        tasksContainer.innerHTML = tasksHTML;
        timelineContainer.appendChild(tasksContainer);
    });
    
    // Render overview
    const overviewContainer = document.getElementById('roadmap-overview');
    const overview = roadmapData.overview;
    
    // Format solutions list
    const solutionNames = {
        'chatbot': 'AI Chatbots',
        'analytics': 'Predictive Analytics',
        'automation': 'Business Process Automation',
        'document-processing': 'Document Processing'
    };
    
    const formattedSolutions = overview.solutions.map(s => solutionNames[s]).join(', ');
    
    overviewContainer.innerHTML = `
        <div class="overview-item">
            <span class="overview-label">Total Implementation Time:</span>
            <span class="overview-value">${overview.totalDuration} weeks</span>
        </div>
        <div class="overview-item">
            <span class="overview-label">Implementation Complexity:</span>
            <span class="overview-value">${overview.complexity}</span>
        </div>
        <div class="overview-item">
            <span class="overview-label">Estimated Investment:</span>
            <span class="overview-value">${overview.costRange}</span>
        </div>
        <div class="overview-item">
            <span class="overview-label">Recommended Team Involvement:</span>
            <span class="overview-value">${overview.teamSize}</span>
        </div>
        <div class="overview-item">
            <span class="overview-label">Selected Solutions:</span>
            <span class="overview-value">${formattedSolutions}</span>
        </div>
    `;
}

// Determine implementation complexity based on inputs
function determineComplexity(solutions, businessSize, techReadiness) {
    let complexityScore = 0;
    
    // Solution complexity
    if (solutions.includes('analytics')) complexityScore += 2;
    if (solutions.includes('automation')) complexityScore += 1.5;
    if (solutions.includes('chatbot')) complexityScore += 1;
    if (solutions.includes('document-processing')) complexityScore += 1.5;
    
    // Business size impact
    if (businessSize === 'enterprise') complexityScore += 2;
    else if (businessSize === 'large') complexityScore += 1.5;
    else if (businessSize === 'medium') complexityScore += 1;
    else complexityScore += 0.5;
    
    // Technical readiness impact
    if (techReadiness === 'low') complexityScore += 2;
    else if (techReadiness === 'medium') complexityScore += 1;
    
    // Determine complexity level
    if (complexityScore >= 6) return 'High';
    else if (complexityScore >= 4) return 'Medium';
    else return 'Low';
}

// Estimate cost range based on solutions and business size
function estimateCostRange(solutions, businessSize, complexity) {
    let baseCost = 0;
    
    // Base cost by solution
    if (solutions.includes('chatbot')) baseCost += 5000;
    if (solutions.includes('analytics')) baseCost += 8000;
    if (solutions.includes('automation')) baseCost += 7000;
    if (solutions.includes('document-processing')) baseCost += 6000;
    
    // Adjust for business size
    const sizeMultipliers = {
        'small': 0.7,
        'medium': 1,
        'large': 1.8,
        'enterprise': 3
    };
    
    // Adjust for complexity
    const complexityMultipliers = {
        'Low': 0.8,
        'Medium': 1,
        'High': 1.3
    };
    
    // Calculate adjusted cost
    const adjustedCost = baseCost * sizeMultipliers[businessSize] * complexityMultipliers[complexity];
    
    // Format as range (±20%)
    const lowerBound = Math.round(adjustedCost * 0.8 / 1000) * 1000;
    const upperBound = Math.round(adjustedCost * 1.2 / 1000) * 1000;
    
    return `$${formatNumber(lowerBound)} - $${formatNumber(upperBound)}`;
}

// Estimate team size based on solutions and business size
function estimateTeamSize(solutions, businessSize, complexity) {
    let baseTeamSize = solutions.length + 1; // One person per solution plus one project manager
    
    // Adjust for business size
    if (businessSize === 'enterprise') baseTeamSize += 2;
    else if (businessSize === 'large') baseTeamSize += 1;
    
    // Adjust for complexity
    if (complexity === 'High') baseTeamSize += 1;
    
    // Format as range
    return `${Math.max(2, baseTeamSize - 1)}-${baseTeamSize + 1} team members`;
}

// Helper to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add roadmap styles
function addRoadmapStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .roadmap-container {
            font-family: 'Montserrat', sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px 20px;
        }
        
        .roadmap-form-section {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }
        
        .roadmap-form-section h2 {
            color: var(--primary-color, #4285f4);
            margin-bottom: 10px;
        }
        
        .roadmap-form {
            margin-top: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .form-group select, .form-group input[type="text"] {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: inherit;
            font-size: 14px;
        }
        
        .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .checkbox-label:hover {
            background-color: #eee;
        }
        
        .checkbox-label input {
            margin-right: 8px;
        }
        
        .roadmap-submit {
            background-color: var(--primary-color, #4285f4);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .roadmap-submit:hover {
            background-color: var(--secondary-color, #3367d6);
            transform: translateY(-2px);
        }
        
        /* Results section styles */
        
        .roadmap-results-section {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .roadmap-header {
            padding: 25px 30px;
            background-color: var(--primary-color, #4285f4);
            color: white;
            position: relative;
        }
        
        .roadmap-header h2 {
            margin-bottom: 10px;
        }
        
        .edit-roadmap-button {
            position: absolute;
            top: 25px;
            right: 30px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .edit-roadmap-button:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .roadmap-timeline {
            padding: 30px;
            background-color: #f9f9f9;
        }
        
        .timeline-header {
            display: flex;
            margin-bottom: 20px;
        }
        
        .phase-label {
            width: 300px;
            font-weight: 600;
            padding: 10px 0;
        }
        
        .timeline-weeks {
            flex: 1;
            display: flex;
            position: relative;
            border-bottom: 1px solid #ddd;
        }
        
        .week-marker {
            flex: 1;
            text-align: center;
            font-size: 12px;
            padding-bottom: 5px;
            color: #777;
        }
        
        .timeline-phase {
            display: flex;
            margin-bottom: 10px;
            position: relative;
        }
        
        .phase-info {
            width: 300px;
            padding-right: 20px;
        }
        
        .phase-info h4 {
            margin: 0 0 5px 0;
        }
        
        .phase-info p {
            margin: 0;
            font-size: 13px;
            color: #666;
        }
        
        .phase-timeline {
            flex: 1;
            position: relative;
            height: 50px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        
        .phase-bar {
            position: absolute;
            height: 100%;
            background-color: var(--primary-color, #4285f4);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .phase-bar:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .phase-tasks {
            margin-left: 300px;
            margin-bottom: 25px;
        }
        
        .phase-tasks ul {
            margin: 0;
            padding-left: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px 15px;
        }
        
        .phase-tasks li {
            flex-basis: calc(50% - 15px);
            font-size: 13px;
            color: #555;
        }
        
        .roadmap-summary {
            padding: 30px;
            border-top: 1px solid #eee;
        }
        
        .roadmap-summary h3 {
            margin-top: 0;
            color: var(--primary-color, #4285f4);
        }
        
        .roadmap-overview {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .overview-item {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        
        .overview-label {
            display: block;
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .overview-value {
            font-size: 16px;
            color: var(--primary-color, #4285f4);
        }
        
        .roadmap-actions {
            padding: 20px 30px;
            background-color: #f9f9f9;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            border-top: 1px solid #eee;
        }
        
        .download-button, .schedule-button {
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .download-button {
            background-color: #f0f0f0;
            color: #333;
        }
        
        .download-button:hover {
            background-color: #e0e0e0;
        }
        
        .schedule-button {
            background-color: var(--primary-color, #4285f4);
            color: white;
        }
        
        .schedule-button:hover {
            background-color: var(--secondary-color, #3367d6);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .phase-info {
                width: 150px;
            }
            
            .phase-tasks {
                margin-left: 150px;
            }
            
            .phase-tasks li {
                flex-basis: 100%;
            }
            
            .roadmap-actions {
                flex-direction: column;
            }
            
            .download-button, .schedule-button {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
} 