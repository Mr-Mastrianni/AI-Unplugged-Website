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

    // Create header with cyber terminal styling
    const header = document.createElement('div');
    header.classList.add('roi-visualizer-header');
    header.innerHTML = `
        <h2 class="text-2xl font-bold mb-3 text-terminal-green">Before & After: <span class="gradient-text">See the Impact of AI</span></h2>
        <p class="text-gray-400">Select a business process below to see how AI solutions transform efficiency and reduce costs.</p>
        <div class="terminal-line w-1/4 h-0.5 bg-gradient-to-r from-terminal-green to-terminal-cyan mx-auto rounded-full animate-pulse-slow mt-4"></div>
    `;
    container.appendChild(header);

    // Create process selector with enhanced styling
    const selector = document.createElement('div');
    selector.classList.add('process-selector');
    selector.setAttribute('role', 'tablist');
    selector.setAttribute('aria-label', 'Business process selection');
    selector.style.display = 'flex';
    selector.style.flexWrap = 'wrap';
    selector.style.justifyContent = 'center';
    selector.style.gap = '10px';
    selector.style.margin = '20px 0';

    // Process tabs with enhanced styling
    processes.forEach(process => {
        const tab = document.createElement('button');
        tab.classList.add('process-tab');
        tab.dataset.process = process.id;
        tab.innerHTML = `<span>${process.title}</span>`;
        tab.setAttribute('aria-label', `Show ${process.title} ROI comparison`);
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '0');

        // Add cyber-terminal styling with enhanced visuals
        tab.style.backgroundColor = 'rgba(10, 10, 18, 0.7)';
        tab.style.color = 'var(--terminal-green, #00ff00)';
        tab.style.border = '2px solid var(--terminal-green, #00ff00)';
        tab.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
        tab.style.padding = '10px 20px';
        tab.style.margin = '0 5px 10px';
        tab.style.borderRadius = '5px';
        tab.style.cursor = 'pointer';
        tab.style.transition = 'all 0.3s ease';
        tab.style.fontFamily = 'monospace, "Courier New", Courier';
        tab.style.fontWeight = 'bold';
        tab.style.letterSpacing = '0.5px';
        tab.style.position = 'relative';
        tab.style.overflow = 'hidden';
        tab.style.backdropFilter = 'blur(5px)';

        // Add subtle glow effect
        const glowEffect = document.createElement('div');
        glowEffect.style.position = 'absolute';
        glowEffect.style.top = '0';
        glowEffect.style.left = '0';
        glowEffect.style.right = '0';
        glowEffect.style.bottom = '0';
        glowEffect.style.background = 'radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%)';
        glowEffect.style.pointerEvents = 'none';
        tab.appendChild(glowEffect);

        // Add hover effects
        tab.addEventListener('mouseover', () => {
            tab.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            tab.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
            tab.style.transform = 'translateY(-2px)';
            tab.style.borderColor = 'var(--terminal-cyan, #00ffff)';
        });

        tab.addEventListener('mouseout', () => {
            if (!tab.classList.contains('active')) {
                tab.style.backgroundColor = 'rgba(10, 10, 18, 0.7)';
                tab.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
                tab.style.transform = 'translateY(0)';
                tab.style.borderColor = 'var(--terminal-green, #00ff00)';
            }
        });

        // Click event with enhanced transitions
        tab.addEventListener('click', () => {
            document.querySelectorAll('.process-tab').forEach(t => {
                t.classList.remove('active');
                t.style.backgroundColor = 'rgba(10, 10, 18, 0.7)';
                t.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
                t.style.transform = 'translateY(0)';
                t.style.borderColor = 'var(--terminal-green, #00ff00)';
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            tab.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
            tab.style.transform = 'translateY(-2px)';
            tab.style.borderColor = 'var(--terminal-cyan, #00ffff)';
            tab.setAttribute('aria-selected', 'true');

            // Add transition effect when changing processes
            const beforeVisualization = document.querySelector('.before-visualization');
            const afterVisualization = document.querySelector('.after-visualization');
            const roiMetrics = document.querySelector('.roi-metrics');

            // Fade out
            beforeVisualization.style.opacity = '0';
            afterVisualization.style.opacity = '0';
            roiMetrics.style.opacity = '0';

            // Wait for fade out, then update and fade in
            setTimeout(() => {
                showProcess(process.id);

                // Fade in
                beforeVisualization.style.opacity = '1';
                afterVisualization.style.opacity = '1';
                roiMetrics.style.opacity = '1';
            }, 300);
        });

        // Add keyboard support
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });

        selector.appendChild(tab);
    });

    // Set first tab as active
    const firstTab = selector.querySelector('.process-tab');
    if (firstTab) {
        firstTab.classList.add('active');
        firstTab.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        firstTab.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        firstTab.style.borderColor = 'var(--terminal-cyan, #00ffff)';
        firstTab.setAttribute('aria-selected', 'true');
    }
    container.appendChild(selector);

    // Create comparison container with enhanced styling
    const comparisonContainer = document.createElement('div');
    comparisonContainer.classList.add('process-comparison');
    comparisonContainer.style.display = 'flex';
    comparisonContainer.style.flexDirection = 'row';
    comparisonContainer.style.gap = '20px';
    comparisonContainer.style.margin = '20px 0';
    comparisonContainer.style.flexWrap = 'wrap';

    // Before container with enhanced styling
    const beforeContainer = document.createElement('div');
    beforeContainer.classList.add('process-column', 'process-before');
    beforeContainer.style.flex = '1';
    beforeContainer.style.minWidth = '300px';
    beforeContainer.style.backgroundColor = 'rgba(10, 10, 18, 0.7)';
    beforeContainer.style.borderRadius = '10px';
    beforeContainer.style.padding = '20px';
    beforeContainer.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.2)';
    beforeContainer.style.border = '2px solid #f44336';
    beforeContainer.style.transition = 'all 0.3s ease';
    beforeContainer.innerHTML = `
        <div class="flex items-center mb-4">
            <div class="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center mr-3">
                <i class="fas fa-times text-red-500"></i>
            </div>
            <h3 class="text-xl font-bold text-red-400">Before AI Implementation</h3>
        </div>
        <div class="process-visualization before-visualization" style="transition: opacity 0.3s ease"></div>
        <div class="process-metrics before-metrics mt-4 p-3 bg-darker rounded-lg border border-red-900"></div>
    `;

    // After container with enhanced styling
    const afterContainer = document.createElement('div');
    afterContainer.classList.add('process-column', 'process-after');
    afterContainer.style.flex = '1';
    afterContainer.style.minWidth = '300px';
    afterContainer.style.backgroundColor = 'rgba(10, 10, 18, 0.7)';
    afterContainer.style.borderRadius = '10px';
    afterContainer.style.padding = '20px';
    afterContainer.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.2)';
    afterContainer.style.border = '2px solid var(--terminal-green)';
    afterContainer.style.transition = 'all 0.3s ease';
    afterContainer.innerHTML = `
        <div class="flex items-center mb-4">
            <div class="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center mr-3">
                <i class="fas fa-check text-terminal-green"></i>
            </div>
            <h3 class="text-xl font-bold text-terminal-green">After AI Implementation</h3>
        </div>
        <div class="process-visualization after-visualization" style="transition: opacity 0.3s ease"></div>
        <div class="process-metrics after-metrics mt-4 p-3 bg-darker rounded-lg border border-terminal-green"></div>
    `;

    // Append columns
    comparisonContainer.appendChild(beforeContainer);
    comparisonContainer.appendChild(afterContainer);
    container.appendChild(comparisonContainer);

    // Create ROI summary section with enhanced styling
    const roiSummary = document.createElement('div');
    roiSummary.classList.add('roi-summary');
    roiSummary.style.backgroundColor = 'rgba(10, 10, 18, 0.8)';
    roiSummary.style.borderRadius = '10px';
    roiSummary.style.padding = '25px';
    roiSummary.style.marginTop = '30px';
    roiSummary.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
    roiSummary.style.border = '2px solid var(--terminal-cyan)';
    roiSummary.style.textAlign = 'center';
    roiSummary.innerHTML = `
        <div class="flex items-center justify-center mb-6">
            <i class="fas fa-chart-line text-terminal-cyan text-2xl mr-3"></i>
            <h3 class="text-2xl font-bold text-terminal-cyan">ROI Summary</h3>
        </div>
        <div class="terminal-line w-1/4 h-0.5 bg-gradient-to-r from-terminal-green to-terminal-cyan mx-auto rounded-full animate-pulse-slow mb-6"></div>
    `;

    // ROI metrics grid with enhanced styling
    const roiMetrics = document.createElement('div');
    roiMetrics.classList.add('roi-metrics');
    roiMetrics.style.display = 'grid';
    roiMetrics.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    roiMetrics.style.gap = '20px';
    roiMetrics.style.marginBottom = '30px';
    roiMetrics.style.transition = 'opacity 0.3s ease';
    roiMetrics.innerHTML = `
        <div class="roi-metric bg-darker p-4 rounded-lg border border-terminal-green transform transition-all duration-500 hover:scale-105 hover:border-terminal-cyan hover:shadow-glow-cyan">
            <div class="flex items-center justify-center mb-2">
                <i class="fas fa-clock text-terminal-green mr-2"></i>
                <span class="metric-label text-gray-400">Time Saved</span>
            </div>
            <span class="metric-value block text-3xl font-bold text-terminal-green" id="time-saved">0%</span>
        </div>
        <div class="roi-metric bg-darker p-4 rounded-lg border border-terminal-green transform transition-all duration-500 hover:scale-105 hover:border-terminal-cyan hover:shadow-glow-cyan">
            <div class="flex items-center justify-center mb-2">
                <i class="fas fa-tachometer-alt text-terminal-green mr-2"></i>
                <span class="metric-label text-gray-400">Throughput Increase</span>
            </div>
            <span class="metric-value block text-3xl font-bold text-terminal-green" id="throughput-increase">0%</span>
        </div>
        <div class="roi-metric bg-darker p-4 rounded-lg border border-terminal-green transform transition-all duration-500 hover:scale-105 hover:border-terminal-cyan hover:shadow-glow-cyan">
            <div class="flex items-center justify-center mb-2">
                <i class="fas fa-percentage text-terminal-green mr-2"></i>
                <span class="metric-label text-gray-400">Cost Reduction</span>
            </div>
            <span class="metric-value block text-3xl font-bold text-terminal-green" id="cost-reduction">0%</span>
        </div>
        <div class="roi-metric bg-darker p-4 rounded-lg border border-terminal-green transform transition-all duration-500 hover:scale-105 hover:border-terminal-cyan hover:shadow-glow-cyan">
            <div class="flex items-center justify-center mb-2">
                <i class="fas fa-dollar-sign text-terminal-green mr-2"></i>
                <span class="metric-label text-gray-400">Annual Savings</span>
            </div>
            <span class="metric-value block text-3xl font-bold text-terminal-green" id="annual-savings">$0</span>
        </div>
    `;
    roiSummary.appendChild(roiMetrics);

    // Call to action with enhanced styling
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('roi-cta');
    ctaContainer.style.marginTop = '20px';
    ctaContainer.innerHTML = `
        <p class="text-gray-400 mb-4">Want to see what AI can do for your specific business processes?</p>
        <button id="roi-calculator-button" class="btn-primary py-3 px-6 rounded-lg font-bold text-lg transform transition hover:-translate-y-1 inline-flex items-center">
            <i class="fas fa-calculator mr-2"></i> Try Our Full ROI Calculator
        </button>
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

// Update process visualization with enhanced styling
function updateProcessVisualization(container, steps) {
    container.innerHTML = '';

    // Create the process flow diagram with enhanced styling
    const processFlow = document.createElement('div');
    processFlow.classList.add('process-flow');
    processFlow.style.display = 'flex';
    processFlow.style.flexDirection = 'column';
    processFlow.style.gap = '15px';

    steps.forEach((step, index) => {
        // Create step with enhanced styling
        const stepElement = document.createElement('div');
        stepElement.classList.add('process-step');
        stepElement.style.display = 'flex';
        stepElement.style.alignItems = 'flex-start';
        stepElement.style.padding = '15px';
        stepElement.style.backgroundColor = 'rgba(10, 10, 18, 0.5)';
        stepElement.style.borderRadius = '8px';
        stepElement.style.transition = 'all 0.3s ease';
        stepElement.style.border = '1px solid rgba(0, 255, 0, 0.2)';
        stepElement.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';
        stepElement.style.opacity = '0';
        stepElement.style.transform = 'translateY(20px)';

        // Add animation with delay based on index
        setTimeout(() => {
            stepElement.style.opacity = '1';
            stepElement.style.transform = 'translateY(0)';
        }, 100 * index);

        // Add hover effect
        stepElement.addEventListener('mouseover', () => {
            stepElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            stepElement.style.boxShadow = '0 5px 15px rgba(0, 255, 0, 0.2)';
            stepElement.style.transform = 'translateY(-3px) scale(1.02)';
            stepElement.style.borderColor = 'rgba(0, 255, 0, 0.4)';
        });

        stepElement.addEventListener('mouseout', () => {
            stepElement.style.backgroundColor = 'rgba(10, 10, 18, 0.5)';
            stepElement.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';
            stepElement.style.transform = 'translateY(0) scale(1)';
            stepElement.style.borderColor = 'rgba(0, 255, 0, 0.2)';
        });

        // Step content with enhanced styling
        const isBeforeContainer = container.closest('.process-before');
        const stepNumberBgColor = isBeforeContainer ? '#f44336' : 'var(--terminal-green, #00ff00)';
        const stepNumberColor = isBeforeContainer ? 'white' : 'black';

        stepElement.innerHTML = `
            <div class="step-number" style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                background-color: ${stepNumberBgColor};
                color: ${stepNumberColor};
                border-radius: 50%;
                margin-right: 15px;
                font-weight: bold;
                box-shadow: 0 0 10px rgba(${isBeforeContainer ? '255, 0, 0' : '0, 255, 0'}, 0.3);
            ">${index + 1}</div>
            <div class="step-content" style="flex: 1;">
                <h4 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: ${isBeforeContainer ? '#f44336' : 'var(--terminal-green)'}">${step.name}</h4>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #aaa;">${step.description}</p>
                ${step.time > 0 ? `
                <div class="step-time" style="
                    display: inline-block;
                    background-color: rgba(${isBeforeContainer ? '255, 0, 0' : '0, 255, 0'}, 0.1);
                    color: ${isBeforeContainer ? '#f44336' : 'var(--terminal-green)'};
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    border: 1px solid rgba(${isBeforeContainer ? '255, 0, 0' : '0, 255, 0'}, 0.3);
                ">
                    <i class="fas fa-clock" style="margin-right: 5px;"></i>
                    ${step.time} mins
                </div>` : ''}
            </div>
        `;

        // Add connecting line with enhanced styling
        if (index < steps.length - 1) {
            const connector = document.createElement('div');
            connector.classList.add('step-connector');
            connector.style.height = '20px';
            connector.style.width = '2px';
            connector.style.backgroundColor = isBeforeContainer ? 'rgba(244, 67, 54, 0.3)' : 'rgba(0, 255, 0, 0.3)';
            connector.style.marginLeft = '15px';
            connector.style.position = 'relative';

            // Add animated dot on connector
            const animatedDot = document.createElement('div');
            animatedDot.style.position = 'absolute';
            animatedDot.style.width = '6px';
            animatedDot.style.height = '6px';
            animatedDot.style.borderRadius = '50%';
            animatedDot.style.backgroundColor = isBeforeContainer ? '#f44336' : 'var(--terminal-green)';
            animatedDot.style.left = '-2px';
            animatedDot.style.animation = 'dot-move 1.5s infinite';
            animatedDot.style.boxShadow = `0 0 5px ${isBeforeContainer ? '#f44336' : 'var(--terminal-green)'}`;
            connector.appendChild(animatedDot);

            // Add animation keyframes if not already added
            if (!document.getElementById('dot-animation-style')) {
                const style = document.createElement('style');
                style.id = 'dot-animation-style';
                style.textContent = `
                    @keyframes dot-move {
                        0% { top: 0; opacity: 0; }
                        50% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            processFlow.appendChild(stepElement);
            processFlow.appendChild(connector);
        } else {
            processFlow.appendChild(stepElement);
        }
    });

    container.appendChild(processFlow);
}

// Update process metrics with enhanced styling
function updateProcessMetrics(container, processData) {
    const isBeforeContainer = container.closest('.process-before');
    const metricColor = isBeforeContainer ? '#f44336' : 'var(--terminal-green)';
    const borderColor = isBeforeContainer ? 'rgba(244, 67, 54, 0.5)' : 'rgba(0, 255, 0, 0.5)';

    container.innerHTML = `
        <div class="grid grid-cols-3 gap-2">
            <div class="metric p-3 bg-darker rounded-lg border border-opacity-50" style="border-color: ${borderColor}; transition: all 0.3s ease;">
                <div class="flex items-center justify-center mb-1">
                    <i class="fas fa-clock mr-2" style="color: ${metricColor};"></i>
                    <span class="metric-label text-xs text-gray-400">Total Time</span>
                </div>
                <span class="metric-value block text-center text-lg font-bold" style="color: ${metricColor};">${processData.totalTime} mins</span>
            </div>
            <div class="metric p-3 bg-darker rounded-lg border border-opacity-50" style="border-color: ${borderColor}; transition: all 0.3s ease;">
                <div class="flex items-center justify-center mb-1">
                    <i class="fas fa-tachometer-alt mr-2" style="color: ${metricColor};"></i>
                    <span class="metric-label text-xs text-gray-400">Throughput</span>
                </div>
                <span class="metric-value block text-center text-lg font-bold" style="color: ${metricColor};">${processData.throughput}/day</span>
            </div>
            <div class="metric p-3 bg-darker rounded-lg border border-opacity-50" style="border-color: ${borderColor}; transition: all 0.3s ease;">
                <div class="flex items-center justify-center mb-1">
                    <i class="fas fa-dollar-sign mr-2" style="color: ${metricColor};"></i>
                    <span class="metric-label text-xs text-gray-400">Monthly Cost</span>
                </div>
                <span class="metric-value block text-center text-lg font-bold" style="color: ${metricColor};">$${processData.cost.toLocaleString()}</span>
            </div>
        </div>
    `;

    // Add hover effects to metrics
    const metrics = container.querySelectorAll('.metric');
    metrics.forEach(metric => {
        metric.addEventListener('mouseover', () => {
            metric.style.transform = 'translateY(-3px)';
            metric.style.boxShadow = `0 5px 15px rgba(${isBeforeContainer ? '255, 0, 0' : '0, 255, 0'}, 0.2)`;
            metric.style.borderColor = isBeforeContainer ? '#f44336' : 'var(--terminal-green)';
        });

        metric.addEventListener('mouseout', () => {
            metric.style.transform = 'translateY(0)';
            metric.style.boxShadow = 'none';
            metric.style.borderColor = borderColor;
        });
    });
}

// Update ROI summary with enhanced styling and animations
function updateROISummary(process) {
    const before = process.before;
    const after = process.after;

    // Calculate metrics
    const timeSavedPercent = Math.round((1 - (after.totalTime / before.totalTime)) * 100);
    const throughputIncreasePercent = Math.round(((after.throughput / before.throughput) - 1) * 100);
    const costReductionPercent = Math.round((1 - (after.cost / before.cost)) * 100);
    const monthlySavings = before.cost - after.cost;
    const annualSavings = monthlySavings * 12;

    // Get metric elements
    const timeSavedElement = document.getElementById('time-saved');
    const throughputIncreaseElement = document.getElementById('throughput-increase');
    const costReductionElement = document.getElementById('cost-reduction');
    const annualSavingsElement = document.getElementById('annual-savings');

    // Store previous values for animation
    const prevTimeSaved = parseInt(timeSavedElement.textContent) || 0;
    const prevThroughputIncrease = parseInt(throughputIncreaseElement.textContent) || 0;
    const prevCostReduction = parseInt(costReductionElement.textContent) || 0;
    const prevAnnualSavings = parseInt(annualSavingsElement.textContent.replace(/[$,]/g, '')) || 0;

    // Update UI with smooth animations
    animateValue(timeSavedElement, prevTimeSaved, timeSavedPercent, '%', 1500);
    animateValue(throughputIncreaseElement, prevThroughputIncrease, throughputIncreasePercent, '%', 1500);
    animateValue(costReductionElement, prevCostReduction, costReductionPercent, '%', 1500);
    animateValue(annualSavingsElement, prevAnnualSavings, annualSavings, '$', 1500);

    // Add visual feedback for significant improvements
    highlightSignificantMetrics(timeSavedPercent, throughputIncreasePercent, costReductionPercent, annualSavings);
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

// Animate value with smooth counting effect
function animateValue(element, start, end, prefix = '', duration = 1000) {
    // Clear any existing animation
    if (element._animationFrame) {
        cancelAnimationFrame(element._animationFrame);
    }

    const startTime = performance.now();
    const formatValue = (value) => {
        if (prefix === '$') {
            return prefix + Math.round(value).toLocaleString();
        } else {
            return Math.round(value) + prefix;
        }
    };

    // Add a subtle highlight effect to the element
    element.style.transition = 'all 0.3s ease';
    element.style.textShadow = '0 0 10px var(--terminal-green)';

    const updateValue = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use easeOutExpo for a nice deceleration effect
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = start + (end - start) * easeOutExpo;

        element.textContent = formatValue(currentValue);

        if (progress < 1) {
            element._animationFrame = requestAnimationFrame(updateValue);
        } else {
            // Animation complete, remove highlight effect after a delay
            setTimeout(() => {
                element.style.textShadow = 'none';
            }, 500);
        }
    };

    element._animationFrame = requestAnimationFrame(updateValue);
}

// Highlight metrics that show significant improvements
function highlightSignificantMetrics(timeSaved, throughputIncrease, costReduction, annualSavings) {
    // Get metric containers
    const metrics = document.querySelectorAll('.roi-metric');

    // Define thresholds for significant improvements
    const thresholds = {
        timeSaved: 50,          // 50% time saved
        throughputIncrease: 100, // 100% throughput increase
        costReduction: 50,       // 50% cost reduction
        annualSavings: 10000     // $10,000 annual savings
    };

    // Check each metric against thresholds
    if (timeSaved >= thresholds.timeSaved) {
        addPulseEffect(metrics[0]);
    }

    if (throughputIncrease >= thresholds.throughputIncrease) {
        addPulseEffect(metrics[1]);
    }

    if (costReduction >= thresholds.costReduction) {
        addPulseEffect(metrics[2]);
    }

    if (annualSavings >= thresholds.annualSavings) {
        addPulseEffect(metrics[3]);
    }
}

// Add pulse effect to highlight significant metrics
function addPulseEffect(element) {
    // Remove any existing animation
    element.classList.remove('highlight-pulse');

    // Add a special glow effect
    element.style.boxShadow = '0 0 20px var(--terminal-cyan)';
    element.style.borderColor = 'var(--terminal-cyan)';
    element.style.transform = 'scale(1.05)';

    // Add a badge or icon to indicate significant improvement
    const badge = document.createElement('div');
    badge.style.position = 'absolute';
    badge.style.top = '-10px';
    badge.style.right = '-10px';
    badge.style.backgroundColor = 'var(--terminal-cyan)';
    badge.style.color = 'black';
    badge.style.borderRadius = '50%';
    badge.style.width = '25px';
    badge.style.height = '25px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontWeight = 'bold';
    badge.style.boxShadow = '0 0 10px var(--terminal-cyan)';
    badge.style.zIndex = '1';
    badge.innerHTML = '<i class="fas fa-star" style="font-size: 12px;"></i>';

    // Make sure element has position relative for absolute positioning of badge
    element.style.position = 'relative';

    // Remove any existing badge
    const existingBadge = element.querySelector('div[style*="position: absolute"]');
    if (existingBadge) {
        element.removeChild(existingBadge);
    }

    element.appendChild(badge);

    // Add a subtle animation
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 0 10px var(--terminal-cyan)';
    }, 1000);
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