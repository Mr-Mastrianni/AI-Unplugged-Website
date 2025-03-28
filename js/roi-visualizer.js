// Before/After ROI Visualizer
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('roi-visualizer')) {
        initROIVisualizer();
    }
});

// Initialize ROI Visualizer
function initROIVisualizer() {
    // Create base container
    const container = document.getElementById('roi-visualizer');
    
    // Data for different business processes
    const processes = [
        {
            id: 'customer-support',
            title: 'Customer Support Process',
            before: {
                steps: [
                    { name: 'Customer reaches out', time: 0, description: 'Customer sends an inquiry through email, phone, or form' },
                    { name: 'Ticket creation', time: 15, description: 'Support rep manually creates a ticket in the system' },
                    { name: 'Research & Response', time: 40, description: 'Support rep researches the issue and drafts a response' },
                    { name: 'Follow-up', time: 25, description: 'Additional communication to resolve the issue' },
                    { name: 'Resolution & Documentation', time: 20, description: 'Ticket is closed and process is documented' }
                ],
                totalTime: 100,
                throughput: 10,
                cost: 2500
            },
            after: {
                steps: [
                    { name: 'Customer reaches out', time: 0, description: 'Customer sends an inquiry through any channel' },
                    { name: 'AI auto-classification', time: 1, description: 'AI automatically classifies and routes the inquiry' },
                    { name: 'AI response', time: 2, description: 'AI provides immediate response to common questions' },
                    { name: 'Human escalation (if needed)', time: 15, description: 'Complex issues are routed to the right specialist' },
                    { name: 'Resolution & AI learning', time: 7, description: 'Resolution is added to AI knowledge base' }
                ],
                totalTime: 25,
                throughput: 40,
                cost: 900
            }
        },
        {
            id: 'data-analysis',
            title: 'Data Analysis Process',
            before: {
                steps: [
                    { name: 'Data collection', time: 120, description: 'Team manually collects data from various sources' },
                    { name: 'Data cleanup', time: 240, description: 'Team manually cleans and formats data' },
                    { name: 'Analysis', time: 180, description: 'Analysts review data and create reports' },
                    { name: 'Reporting', time: 120, description: 'Create presentation and visualizations' },
                    { name: 'Decision making', time: 180, description: 'Management reviews reports and makes decisions' }
                ],
                totalTime: 840,
                throughput: 1,
                cost: 6000
            },
            after: {
                steps: [
                    { name: 'Automated data collection', time: 10, description: 'AI automatically pulls data from connected sources' },
                    { name: 'Automated data processing', time: 15, description: 'AI cleans, normalizes and prepares data' },
                    { name: 'AI analysis & insights', time: 5, description: 'AI identifies trends and generates insights' },
                    { name: 'Automated reporting', time: 5, description: 'AI creates dashboards and reports' },
                    { name: 'Informed decision making', time: 60, description: 'Management reviews AI recommendations' }
                ],
                totalTime: 95,
                throughput: 8,
                cost: 1800
            }
        },
        {
            id: 'document-processing',
            title: 'Document Processing',
            before: {
                steps: [
                    { name: 'Document receipt', time: 10, description: 'Document is received and logged' },
                    { name: 'Document classification', time: 15, description: 'Staff determines document type and priority' },
                    { name: 'Data extraction', time: 30, description: 'Staff manually extracts relevant information' },
                    { name: 'Data entry', time: 25, description: 'Information is entered into systems' },
                    { name: 'Filing and archiving', time: 10, description: 'Document is filed for record-keeping' }
                ],
                totalTime: 90,
                throughput: 15,
                cost: 3000
            },
            after: {
                steps: [
                    { name: 'Document receipt', time: 1, description: 'Document is digitally received' },
                    { name: 'AI classification', time: 1, description: 'AI automatically determines document type' },
                    { name: 'AI data extraction', time: 2, description: 'AI extracts all relevant information' },
                    { name: 'Automated system updates', time: 1, description: 'Data automatically populates systems' },
                    { name: 'Digital archiving', time: 1, description: 'Document is automatically indexed and stored' }
                ],
                totalTime: 6,
                throughput: 200,
                cost: 600
            }
        }
    ];

    // Create UI
    createVisualizerUI(container, processes);
    
    // Initialize the first process
    showProcess(processes[0].id);
}

// Create Visualizer UI
function createVisualizerUI(container, processes) {
    // Add container classes
    container.classList.add('roi-visualizer-container');
    
    // Create header
    const header = document.createElement('div');
    header.classList.add('roi-visualizer-header');
    header.innerHTML = `
        <h2>Before & After: See the Impact of AI</h2>
        <p>Select a business process below to see how AI solutions transform efficiency and reduce costs.</p>
    `;
    container.appendChild(header);
    
    // Create process selector
    const selector = document.createElement('div');
    selector.classList.add('process-selector');
    
    // Process tabs
    processes.forEach(process => {
        const tab = document.createElement('button');
        tab.classList.add('process-tab');
        tab.dataset.process = process.id;
        tab.textContent = process.title;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.process-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showProcess(process.id);
        });
        selector.appendChild(tab);
    });
    container.appendChild(selector);
    
    // Create comparison container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.classList.add('process-comparison');
    
    // Before container
    const beforeContainer = document.createElement('div');
    beforeContainer.classList.add('process-column', 'process-before');
    beforeContainer.innerHTML = `
        <h3>Before AI Implementation</h3>
        <div class="process-visualization before-visualization"></div>
        <div class="process-metrics before-metrics"></div>
    `;
    
    // After container
    const afterContainer = document.createElement('div');
    afterContainer.classList.add('process-column', 'process-after');
    afterContainer.innerHTML = `
        <h3>After AI Implementation</h3>
        <div class="process-visualization after-visualization"></div>
        <div class="process-metrics after-metrics"></div>
    `;
    
    // Append columns
    comparisonContainer.appendChild(beforeContainer);
    comparisonContainer.appendChild(afterContainer);
    container.appendChild(comparisonContainer);
    
    // Create ROI summary section
    const roiSummary = document.createElement('div');
    roiSummary.classList.add('roi-summary');
    roiSummary.innerHTML = `<h3>ROI Summary</h3>`;
    
    // ROI metrics grid
    const roiMetrics = document.createElement('div');
    roiMetrics.classList.add('roi-metrics');
    roiMetrics.innerHTML = `
        <div class="roi-metric">
            <span class="metric-label">Time Saved</span>
            <span class="metric-value" id="time-saved">0%</span>
        </div>
        <div class="roi-metric">
            <span class="metric-label">Throughput Increase</span>
            <span class="metric-value" id="throughput-increase">0%</span>
        </div>
        <div class="roi-metric">
            <span class="metric-label">Cost Reduction</span>
            <span class="metric-value" id="cost-reduction">0%</span>
        </div>
        <div class="roi-metric">
            <span class="metric-label">Annual Savings</span>
            <span class="metric-value" id="annual-savings">$0</span>
        </div>
    `;
    roiSummary.appendChild(roiMetrics);
    
    // Call to action
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('roi-cta');
    ctaContainer.innerHTML = `
        <p>Want to see what AI can do for your specific business processes?</p>
        <button id="roi-calculator-button" class="btn btn-primary">Try Our Full ROI Calculator</button>
    `;
    roiSummary.appendChild(ctaContainer);
    container.appendChild(roiSummary);
    
    // Add event listener for CTA button
    document.getElementById('roi-calculator-button').addEventListener('click', () => {
        window.location.href = 'roi-calculator.html';
    });
    
    // Add styles
    addVisualizerStyles();
}

// Show selected process
function showProcess(processId) {
    const processes = document.querySelectorAll('[data-process]');
    let selectedProcess;
    
    // Find the selected process data
    processes.forEach(process => {
        if (process.dataset.process === processId) {
            selectedProcess = getProcessById(processId);
        }
    });
    
    if (!selectedProcess) return;
    
    // Update before visualizations
    updateProcessVisualization(
        document.querySelector('.before-visualization'), 
        selectedProcess.before.steps
    );
    
    // Update after visualizations
    updateProcessVisualization(
        document.querySelector('.after-visualization'), 
        selectedProcess.after.steps
    );
    
    // Update before metrics
    updateProcessMetrics(
        document.querySelector('.before-metrics'),
        selectedProcess.before
    );
    
    // Update after metrics
    updateProcessMetrics(
        document.querySelector('.after-metrics'),
        selectedProcess.after
    );
    
    // Update ROI summary
    updateROISummary(selectedProcess);
}

// Update process visualization
function updateProcessVisualization(container, steps) {
    container.innerHTML = '';
    
    // Create the process flow diagram
    const processFlow = document.createElement('div');
    processFlow.classList.add('process-flow');
    
    steps.forEach((step, index) => {
        // Create step
        const stepElement = document.createElement('div');
        stepElement.classList.add('process-step');
        
        // Step content
        stepElement.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h4>${step.name}</h4>
                <p>${step.description}</p>
                ${step.time > 0 ? `<div class="step-time">${step.time} mins</div>` : ''}
            </div>
        `;
        
        // Add connecting line
        if (index < steps.length - 1) {
            const connector = document.createElement('div');
            connector.classList.add('step-connector');
            processFlow.appendChild(stepElement);
            processFlow.appendChild(connector);
        } else {
            processFlow.appendChild(stepElement);
        }
    });
    
    container.appendChild(processFlow);
}

// Update process metrics
function updateProcessMetrics(container, processData) {
    container.innerHTML = `
        <div class="metric">
            <span class="metric-label">Total Process Time:</span>
            <span class="metric-value">${processData.totalTime} minutes</span>
        </div>
        <div class="metric">
            <span class="metric-label">Daily Throughput:</span>
            <span class="metric-value">${processData.throughput} per day</span>
        </div>
        <div class="metric">
            <span class="metric-label">Monthly Cost:</span>
            <span class="metric-value">$${processData.cost}</span>
        </div>
    `;
}

// Update ROI summary
function updateROISummary(process) {
    const before = process.before;
    const after = process.after;
    
    // Calculate metrics
    const timeSavedPercent = Math.round((1 - (after.totalTime / before.totalTime)) * 100);
    const throughputIncreasePercent = Math.round(((after.throughput / before.throughput) - 1) * 100);
    const costReductionPercent = Math.round((1 - (after.cost / before.cost)) * 100);
    const monthlySavings = before.cost - after.cost;
    const annualSavings = monthlySavings * 12;
    
    // Update UI
    document.getElementById('time-saved').textContent = `${timeSavedPercent}%`;
    document.getElementById('throughput-increase').textContent = `${throughputIncreasePercent}%`;
    document.getElementById('cost-reduction').textContent = `${costReductionPercent}%`;
    document.getElementById('annual-savings').textContent = `$${annualSavings.toLocaleString()}`;
    
    // Animate the numbers
    animateCounters();
}

// Helper to get process by ID
function getProcessById(id) {
    // Note: This is a simplified approach. In a real implementation,
    // we would use a more robust method to get the process data.
    const processes = [
        {
            id: 'customer-support',
            title: 'Customer Support Process',
            before: {
                steps: [
                    { name: 'Customer reaches out', time: 0, description: 'Customer sends an inquiry through email, phone, or form' },
                    { name: 'Ticket creation', time: 15, description: 'Support rep manually creates a ticket in the system' },
                    { name: 'Research & Response', time: 40, description: 'Support rep researches the issue and drafts a response' },
                    { name: 'Follow-up', time: 25, description: 'Additional communication to resolve the issue' },
                    { name: 'Resolution & Documentation', time: 20, description: 'Ticket is closed and process is documented' }
                ],
                totalTime: 100,
                throughput: 10,
                cost: 2500
            },
            after: {
                steps: [
                    { name: 'Customer reaches out', time: 0, description: 'Customer sends an inquiry through any channel' },
                    { name: 'AI auto-classification', time: 1, description: 'AI automatically classifies and routes the inquiry' },
                    { name: 'AI response', time: 2, description: 'AI provides immediate response to common questions' },
                    { name: 'Human escalation (if needed)', time: 15, description: 'Complex issues are routed to the right specialist' },
                    { name: 'Resolution & AI learning', time: 7, description: 'Resolution is added to AI knowledge base' }
                ],
                totalTime: 25,
                throughput: 40,
                cost: 900
            }
        },
        {
            id: 'data-analysis',
            title: 'Data Analysis Process',
            before: {
                steps: [
                    { name: 'Data collection', time: 120, description: 'Team manually collects data from various sources' },
                    { name: 'Data cleanup', time: 240, description: 'Team manually cleans and formats data' },
                    { name: 'Analysis', time: 180, description: 'Analysts review data and create reports' },
                    { name: 'Reporting', time: 120, description: 'Create presentation and visualizations' },
                    { name: 'Decision making', time: 180, description: 'Management reviews reports and makes decisions' }
                ],
                totalTime: 840,
                throughput: 1,
                cost: 6000
            },
            after: {
                steps: [
                    { name: 'Automated data collection', time: 10, description: 'AI automatically pulls data from connected sources' },
                    { name: 'Automated data processing', time: 15, description: 'AI cleans, normalizes and prepares data' },
                    { name: 'AI analysis & insights', time: 5, description: 'AI identifies trends and generates insights' },
                    { name: 'Automated reporting', time: 5, description: 'AI creates dashboards and reports' },
                    { name: 'Informed decision making', time: 60, description: 'Management reviews AI recommendations' }
                ],
                totalTime: 95,
                throughput: 8,
                cost: 1800
            }
        },
        {
            id: 'document-processing',
            title: 'Document Processing',
            before: {
                steps: [
                    { name: 'Document receipt', time: 10, description: 'Document is received and logged' },
                    { name: 'Document classification', time: 15, description: 'Staff determines document type and priority' },
                    { name: 'Data extraction', time: 30, description: 'Staff manually extracts relevant information' },
                    { name: 'Data entry', time: 25, description: 'Information is entered into systems' },
                    { name: 'Filing and archiving', time: 10, description: 'Document is filed for record-keeping' }
                ],
                totalTime: 90,
                throughput: 15,
                cost: 3000
            },
            after: {
                steps: [
                    { name: 'Document receipt', time: 1, description: 'Document is digitally received' },
                    { name: 'AI classification', time: 1, description: 'AI automatically determines document type' },
                    { name: 'AI data extraction', time: 2, description: 'AI extracts all relevant information' },
                    { name: 'Automated system updates', time: 1, description: 'Data automatically populates systems' },
                    { name: 'Digital archiving', time: 1, description: 'Document is automatically indexed and stored' }
                ],
                totalTime: 6,
                throughput: 200,
                cost: 600
            }
        }
    ];
    
    return processes.find(process => process.id === id);
}

// Animate counter values
function animateCounters() {
    const counters = document.querySelectorAll('.roi-metrics .metric-value');
    
    counters.forEach(counter => {
        const value = counter.textContent;
        let startValue = 0;
        let endValue;
        
        if (value.includes('%')) {
            endValue = parseInt(value);
            const updateCounter = () => {
                const increment = Math.ceil(endValue / 50);
                if (startValue < endValue) {
                    startValue += increment;
                    if (startValue > endValue) startValue = endValue;
                    counter.textContent = startValue + '%';
                    requestAnimationFrame(updateCounter);
                }
            };
            updateCounter();
        } else if (value.includes('$')) {
            endValue = parseInt(value.replace(/[$,]/g, ''));
            const updateCounter = () => {
                const increment = Math.ceil(endValue / 50);
                if (startValue < endValue) {
                    startValue += increment;
                    if (startValue > endValue) startValue = endValue;
                    counter.textContent = '$' + startValue.toLocaleString();
                    requestAnimationFrame(updateCounter);
                }
            };
            updateCounter();
        }
    });
}

// Add visualizer styles
function addVisualizerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .roi-visualizer-container {
            font-family: 'Montserrat', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 20px;
            background-color: var(--background-color, #f9f9f9);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .roi-visualizer-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .roi-visualizer-header h2 {
            color: var(--primary-color, #4285f4);
            margin-bottom: 10px;
        }
        
        .process-selector {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .process-tab {
            padding: 10px 20px;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .process-tab:hover, .process-tab.active {
            background-color: var(--primary-color, #4285f4);
            color: white;
        }
        
        .process-comparison {
            display: flex;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .process-column {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            background-color: white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .process-column h3 {
            text-align: center;
            margin-bottom: 20px;
            color: var(--text-color, #333);
        }
        
        .process-before {
            border-top: 5px solid #f0ad4e;
        }
        
        .process-after {
            border-top: 5px solid #5cb85c;
        }
        
        .process-flow {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .process-step {
            display: flex;
            align-items: flex-start;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            transition: transform 0.3s ease;
        }
        
        .process-step:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .step-number {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            background-color: var(--primary-color, #4285f4);
            color: white;
            border-radius: 50%;
            margin-right: 15px;
            font-weight: bold;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-content h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
        }
        
        .step-content p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #666;
        }
        
        .step-time {
            display: inline-block;
            background-color: #f0f0f0;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .step-connector {
            height: 20px;
            width: 2px;
            background-color: #ddd;
            margin-left: 15px;
        }
        
        .process-metrics {
            margin-top: 20px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .metric:last-child {
            margin-bottom: 0;
        }
        
        .metric-label {
            font-weight: 500;
        }
        
        .metric-value {
            font-weight: 600;
        }
        
        .roi-summary {
            background-color: var(--primary-color, #4285f4);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
        }
        
        .roi-summary h3 {
            margin-bottom: 20px;
        }
        
        .roi-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .roi-metric {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
        }
        
        .roi-metric .metric-label {
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .roi-metric .metric-value {
            font-size: 24px;
            font-weight: 700;
        }
        
        .roi-cta {
            margin-top: 20px;
        }
        
        .roi-cta p {
            margin-bottom: 15px;
        }
        
        .roi-cta button {
            background-color: white;
            color: var(--primary-color, #4285f4);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .roi-cta button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .process-comparison {
                flex-direction: column;
            }
            
            .roi-metrics {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
} 