/**
 * This script provides a reliable fix for the assessment form submission
 * using best practices from MDN and JavaScript.info
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Form fix script loaded");

    // Get form elements
    const form = document.getElementById('ai-assessment');
    const assessmentForm = document.getElementById('assessment-form');
    const assessmentResults = document.getElementById('assessment-results');
    const submitButton = document.querySelector('.submit-assessment');

    if (!form || !assessmentForm || !assessmentResults) {
        console.error("Critical elements not found!");
        return;
    }

    console.log("Form elements found:", { form, assessmentForm, assessmentResults, submitButton });

    // Create a direct submit handler for the form
    form.addEventListener('submit', function(event) {
        console.log("Form submit event triggered");
        event.preventDefault(); // Prevent default form submission

        // Process the form data
        processFormSubmission();
    });

    // Add click handler to the submit button
    if (submitButton) {
        console.log("Adding click handler to submit button");

        submitButton.addEventListener('click', function(event) {
            console.log("Submit button clicked");
            event.preventDefault();

            // Process the form data
            processFormSubmission();
        });
    }

    // Function to process form submission
    function processFormSubmission() {
        console.log("Processing form submission");

        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        // Hide the form
        assessmentForm.style.display = 'none';

        // Generate results
        generateResults();

        // Show results
        assessmentResults.style.display = 'block';

        // Reset button state after a delay
        setTimeout(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Assessment';
            }
        }, 1000);

        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Function to generate results
    function generateResults() {
        console.log("Generating results");

        try {
            // Collect form data
            const formData = new FormData(form);
            const formEntries = {};

            // Convert FormData to object for easier access
            for (let [key, value] of formData.entries()) {
                if (formEntries[key]) {
                    // If key already exists, convert to array or push to existing array
                    if (!Array.isArray(formEntries[key])) {
                        formEntries[key] = [formEntries[key]];
                    }
                    formEntries[key].push(value);
                } else {
                    formEntries[key] = value;
                }
            }

            console.log("Form data collected:", formEntries);

            // Calculate score
            const score = calculateScore(formEntries);
            console.log("Calculated score:", score);

            // Update score display
            updateScoreDisplay(score);

            // Update other result sections
            updateResultSections(formEntries, score);

        } catch (error) {
            console.error("Error generating results:", error);
            alert("There was an error generating your assessment results. Please try again.");
        }
    }

    // Calculate score based on form data
    function calculateScore(formData) {
        // Base score
        let score = 50;

        // Add points based on data management
        const dataManagement = formData['data-management'];
        if (dataManagement === 'Structured and Centralized') score += 25;
        else if (dataManagement === 'Somewhat Organized') score += 15;
        else if (dataManagement === 'Manual Processes') score += 5;
        else if (dataManagement === 'Minimal Data Collection') score -= 5;

        // Add points based on budget
        const budget = formData['budget'];
        if (budget === 'Over $100,000') score += 15;
        else if (budget === '$25,000 - $100,000') score += 10;
        else if (budget === '$5,000 - $25,000') score += 5;
        else if (budget === 'Under $5,000') score -= 5;

        // Add points based on company size
        const companySize = formData['company-size'];
        if (companySize === 'Over 500') score += 10;
        else if (companySize === '201-500') score += 8;
        else if (companySize === '51-200') score += 5;
        else if (companySize === '11-50') score += 3;
        else if (companySize === '1-10') score += 0;

        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    // Update the score display
    function updateScoreDisplay(score) {
        const scoreElement = document.querySelector('.score-value');
        if (scoreElement) {
            // Set initial value
            scoreElement.textContent = '0';

            // Animate the score
            animateNumber(scoreElement, 0, score, 1000);
        }

        // Update score interpretation
        const interpretationElement = document.getElementById('score-interpretation');
        if (interpretationElement) {
            let interpretation = '';

            if (score >= 80) {
                interpretation = 'Your business is well-positioned for AI adoption. You have the necessary infrastructure, data practices, and organizational readiness to implement AI solutions that can drive significant value.';
            } else if (score >= 60) {
                interpretation = 'Your business shows good potential for AI adoption. With some targeted improvements to your data practices and technology infrastructure, you can successfully implement AI solutions.';
            } else if (score >= 40) {
                interpretation = 'Your business has moderate readiness for AI adoption. There are several areas that need improvement before you can fully leverage AI technologies, but you can begin with simpler AI applications.';
            } else {
                interpretation = 'Your business has significant gaps in AI readiness. We recommend focusing on building a stronger digital foundation before implementing advanced AI solutions.';
            }

            interpretationElement.textContent = interpretation;
        }
    }

    // Update all result sections
    function updateResultSections(formData, score) {
        // Update key findings
        updateKeyFindings(formData);

        // Update recommended solutions
        updateRecommendedSolutions(formData);

        // Update ROI analysis
        updateROIAnalysis(formData);

        // Update next steps
        updateNextSteps(score);

        // Update CTA section
        updateCTA(score);
    }

    // Update key findings section
    function updateKeyFindings(formData) {
        const findingsElement = document.getElementById('key-findings');
        if (!findingsElement) return;

        // Clear existing findings
        findingsElement.innerHTML = '';

        // Get selected processes
        const processes = Array.isArray(formData['processes'])
            ? formData['processes']
            : (formData['processes'] ? [formData['processes']] : []);

        // Get selected goals
        const goals = Array.isArray(formData['goals'])
            ? formData['goals']
            : (formData['goals'] ? [formData['goals']] : []);

        const dataManagement = formData['data-management'];
        const budget = formData['budget'];
        const companySize = formData['company-size'];
        const industry = formData['industry'];

        // Generate findings
        const findings = [];

        // Add finding about processes
        if (processes.length > 0) {
            findings.push(`The ${processes.join(', ')} processes you identified are excellent candidates for AI implementation.`);
        }

        // Add finding about goals
        if (goals.length > 0) {
            findings.push(`Your business goals of ${goals.join(', ')} align well with the benefits that AI can provide.`);
        }

        // Add finding about data management
        if (dataManagement) {
            if (dataManagement === 'Structured and Centralized' || dataManagement === 'Somewhat Organized') {
                findings.push('Your structured approach to data management provides a solid foundation for AI implementation.');
            } else if (dataManagement === 'Manual Processes') {
                findings.push('Moving from manual processes to digital systems would be a recommended first step in your AI journey.');
            } else {
                findings.push('Establishing a structured data collection strategy would be essential before implementing AI solutions.');
            }
        }

        // Add finding about budget
        if (budget) {
            if (budget === 'Over $100,000' || budget === '$25,000 - $100,000') {
                findings.push('Your budget range allows for comprehensive AI solutions that can transform multiple business processes.');
            } else if (budget === '$5,000 - $25,000') {
                findings.push('Your budget allows for targeted AI implementations that can address specific business needs.');
            } else if (budget === 'Under $5,000') {
                findings.push('Starting with smaller, focused AI applications would provide the best value within your budget range.');
            } else {
                findings.push('Exploring AI options at various price points will help you determine the right investment level for your needs.');
            }
        }

        // Add finding about industry if provided
        if (industry && industry !== 'Other') {
            findings.push(`The ${industry} industry has seen significant benefits from AI adoption, particularly in the areas of ${getIndustryStrengths(industry)}.`);
        }

        // Add findings to the page
        findings.forEach(finding => {
            const listItem = document.createElement('li');
            listItem.textContent = finding;
            findingsElement.appendChild(listItem);
        });
    }

    // Get industry strengths based on industry
    function getIndustryStrengths(industry) {
        switch(industry) {
            case 'Retail':
                return 'inventory management, customer experience, and demand forecasting';
            case 'Healthcare':
                return 'patient care optimization, administrative automation, and diagnostic assistance';
            case 'Financial Services':
                return 'fraud detection, risk assessment, and customer service automation';
            case 'Manufacturing':
                return 'quality control, predictive maintenance, and supply chain optimization';
            case 'Technology':
                return 'product development, customer support, and business intelligence';
            case 'Professional Services':
                return 'client engagement, knowledge management, and operational efficiency';
            case 'Education':
                return 'personalized learning, administrative efficiency, and student engagement';
            case 'Hospitality':
                return 'customer experience, operational efficiency, and demand forecasting';
            default:
                return 'operational efficiency, customer experience, and data analytics';
        }
    }

    // Update recommended solutions section
    function updateRecommendedSolutions(formData) {
        const solutionsElement = document.getElementById('recommended-solutions');
        if (!solutionsElement) return;

        // Clear existing solutions
        solutionsElement.innerHTML = '';

        // Get selected processes
        const processes = Array.isArray(formData['processes'])
            ? formData['processes']
            : (formData['processes'] ? [formData['processes']] : []);

        const budget = formData['budget'];
        const dataManagement = formData['data-management'];

        // Generate solutions
        const solutions = [];

        // Customer support solution
        if (processes.includes('Customer Support')) {
            solutions.push({
                title: 'AI-Powered Customer Service Solutions',
                description: 'Implement AI chatbots and virtual assistants to handle routine customer inquiries, freeing up your team to focus on complex issues.',
                benefits: [
                    '24/7 customer support availability',
                    'Reduced response times',
                    'Consistent customer experience',
                    'Lower support costs'
                ]
            });
        }

        // Data entry solution
        if (processes.includes('Data Entry & Management')) {
            solutions.push({
                title: 'Intelligent Document Processing',
                description: 'Use AI-powered document processing to automate data extraction from invoices, receipts, forms, and other documents.',
                benefits: [
                    'Eliminate manual data entry',
                    'Reduce processing errors',
                    'Accelerate document workflow',
                    'Centralize data for better analysis'
                ]
            });
        }

        // Scheduling solution
        if (processes.includes('Scheduling & Calendar Management')) {
            solutions.push({
                title: 'AI Scheduling Assistants',
                description: 'Implement AI scheduling tools that can automatically manage appointments, meetings, and calendar conflicts.',
                benefits: [
                    'Eliminate back-and-forth emails',
                    'Optimize scheduling based on preferences',
                    'Reduce double-bookings and conflicts',
                    'Free up administrative time'
                ]
            });
        }

        // Inventory solution
        if (processes.includes('Inventory Management')) {
            solutions.push({
                title: 'Predictive Inventory Management',
                description: 'Leverage AI algorithms to forecast demand, optimize stock levels, and automate reordering.',
                benefits: [
                    'Reduce excess inventory costs',
                    'Prevent stockouts',
                    'Optimize supply chain efficiency',
                    'Improve cash flow'
                ]
            });
        }

        // Sales & Marketing solution
        if (processes.includes('Sales & Marketing')) {
            solutions.push({
                title: 'AI-Powered Sales & Marketing',
                description: 'Use AI to enhance lead generation, customer targeting, and marketing campaign optimization.',
                benefits: [
                    'More accurate sales forecasting',
                    'Improved lead qualification',
                    'Personalized marketing campaigns',
                    'Higher conversion rates'
                ]
            });
        }

        // Add a default solution if no specific ones were identified
        if (solutions.length === 0) {
            solutions.push({
                title: 'AI Readiness Consultation',
                description: 'Our team will conduct a detailed analysis of your business processes to identify the best opportunities for AI implementation.',
                benefits: [
                    'Identify high-impact automation opportunities',
                    'Develop a customized AI implementation roadmap',
                    'Prioritize projects based on ROI potential',
                    'Create a strategic plan for digital transformation'
                ]
            });
        }

        // Limit to 3 top solutions for simplicity
        const topSolutions = solutions.slice(0, 3);

        // Add solutions to the page
        topSolutions.forEach(solution => {
            const solutionCard = document.createElement('div');
            solutionCard.classList.add('solution-card');

            const title = document.createElement('h4');
            title.textContent = solution.title;

            const description = document.createElement('p');
            description.textContent = solution.description;

            const benefitsList = document.createElement('ul');
            solution.benefits.forEach(benefit => {
                const benefitItem = document.createElement('li');
                benefitItem.textContent = benefit;
                benefitsList.appendChild(benefitItem);
            });

            solutionCard.appendChild(title);
            solutionCard.appendChild(description);
            solutionCard.appendChild(benefitsList);

            solutionsElement.appendChild(solutionCard);
        });
    }

    // Update ROI analysis section
    function updateROIAnalysis(formData) {
        const roiElement = document.getElementById('roi-analysis');
        if (!roiElement) return;

        // Get relevant values
        const hourlyRate = parseFloat(document.getElementById('employee-rate')?.value) || 35;
        const companySize = formData['company-size'] || '11-50';

        // Get selected processes
        const processes = Array.isArray(formData['processes'])
            ? formData['processes']
            : (formData['processes'] ? [formData['processes']] : []);

        // Estimate weekly hours saved based on company size and selected processes
        let weeklyHours = 0;
        let employeeCount = 0;

        // Estimate employee count from company size
        switch(companySize) {
            case '1-10': employeeCount = 5; break;
            case '11-50': employeeCount = 25; break;
            case '51-200': employeeCount = 100; break;
            case '201-500': employeeCount = 300; break;
            case 'Over 500': employeeCount = 750; break;
            default: employeeCount = 25;
        }

        // Estimate hours saved per process
        processes.forEach(process => {
            switch(process) {
                case 'Customer Support':
                    weeklyHours += employeeCount * 0.5; // 0.5 hours per employee per week
                    break;
                case 'Data Entry & Management':
                    weeklyHours += employeeCount * 0.7;
                    break;
                case 'Scheduling & Calendar Management':
                    weeklyHours += employeeCount * 0.3;
                    break;
                case 'Inventory Management':
                    weeklyHours += Math.min(employeeCount * 0.2, 40); // Cap at 40 hours
                    break;
                case 'Sales & Marketing':
                    weeklyHours += Math.min(employeeCount * 0.4, 60);
                    break;
                case 'Reporting & Analytics':
                    weeklyHours += Math.min(employeeCount * 0.3, 50);
                    break;
                case 'Finance & Accounting':
                    weeklyHours += Math.min(employeeCount * 0.4, 40);
                    break;
                default:
                    weeklyHours += employeeCount * 0.2;
            }
        });

        // Ensure we have at least some hours for calculation
        weeklyHours = Math.max(weeklyHours, 5);

        // Calculate potential savings
        const annualHoursSaved = weeklyHours * 52;
        const annualLaborSavings = annualHoursSaved * hourlyRate;

        // Estimate monthly operational costs based on company size
        let monthlyCosts = 0;
        switch(companySize) {
            case '1-10': monthlyCosts = 2000; break;
            case '11-50': monthlyCosts = 5000; break;
            case '51-200': monthlyCosts = 15000; break;
            case '201-500': monthlyCosts = 40000; break;
            case 'Over 500': monthlyCosts = 100000; break;
            default: monthlyCosts = 5000;
        }

        const annualOperationalSavings = monthlyCosts * 12 * 0.2; // Assuming 20% reduction
        const totalAnnualSavings = annualLaborSavings + annualOperationalSavings;

        // Estimate implementation costs based on budget selection
        let implementationCost = 0;
        const budget = formData['budget'];
        switch(budget) {
            case 'Under $5,000': implementationCost = 4000; break;
            case '$5,000 - $25,000': implementationCost = 15000; break;
            case '$25,000 - $100,000': implementationCost = 50000; break;
            case 'Over $100,000': implementationCost = 150000; break;
            default: implementationCost = totalAnnualSavings * 0.5; // Default to 6 months of savings
        }
        implementationCost = Math.min(implementationCost, totalAnnualSavings * 1.5); // Cap implementation cost

        // Calculate ROI
        const firstYearROI = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;
        const threeYearROI = ((totalAnnualSavings * 3 - implementationCost) / implementationCost) * 100;

        // Create ROI display
        roiElement.innerHTML = `
            <div class="roi-chart">
                <div class="roi-value">${Math.round(threeYearROI)}%</div>
                <div class="roi-label">Estimated 3-Year ROI</div>
            </div>

            <div class="roi-calculation">
                <h4>Potential Value of AI Implementation</h4>
                <p>Based on your inputs, here's an estimate of the value AI could bring to your business:</p>

                <div class="roi-formula">
                    <strong>Weekly Time Savings:</strong> Approximately ${Math.round(weeklyHours)} hours per week<br>
                    <strong>Annual Labor Savings:</strong> $${Math.round(annualLaborSavings).toLocaleString()}<br>
                    <strong>Annual Operational Savings:</strong> $${Math.round(annualOperationalSavings).toLocaleString()}<br>
                    <strong>Total Annual Value:</strong> $${Math.round(totalAnnualSavings).toLocaleString()}<br>
                    <strong>Estimated Investment:</strong> $${Math.round(implementationCost).toLocaleString()}<br>
                    <strong>First Year ROI:</strong> ${Math.round(firstYearROI)}%
                </div>

                <p>Note: This is a preliminary estimate based on industry averages. Schedule a consultation for a detailed analysis specific to your business.</p>
            </div>
        `;
    }

    // Update next steps section
    function updateNextSteps(score) {
        const nextStepsElement = document.getElementById('next-steps');
        if (!nextStepsElement) return;

        let steps = '';

        if (score >= 60) {
            steps = `
                <p>Based on your AI readiness score, we recommend the following next steps:</p>
                <ol class="next-steps-list">
                    <li><strong>Schedule a Consultation:</strong> Meet with our AI specialists to discuss your specific needs and opportunities in detail.</li>
                    <li><strong>Solution Design:</strong> We'll create a custom implementation plan for the recommended AI solutions.</li>
                    <li><strong>Pilot Implementation:</strong> Start with a small-scale implementation to demonstrate value and refine the approach.</li>
                    <li><strong>Full Deployment:</strong> Roll out the AI solutions across your organization with training and change management support.</li>
                </ol>
            `;
        } else {
            steps = `
                <p>Based on your AI readiness score, we recommend the following preparation steps:</p>
                <ol class="next-steps-list">
                    <li><strong>Data Assessment:</strong> Evaluate your current data infrastructure and practices to identify improvement opportunities.</li>
                    <li><strong>Digital Foundation:</strong> Strengthen your technology systems and processes to better support AI implementation.</li>
                    <li><strong>AI Readiness Workshop:</strong> Participate in our workshop to build awareness and understanding of AI across your team.</li>
                    <li><strong>Roadmap Development:</strong> Create a phased approach to implementing AI solutions as your readiness improves.</li>
                </ol>
            `;
        }

        nextStepsElement.innerHTML = steps;
    }

    // Update CTA section
    function updateCTA(score) {
        const mainHeading = document.querySelector('#assessment-results h2');
        if (mainHeading) {
            if (score >= 75) {
                mainHeading.innerHTML = 'Your AI Readiness <span class="terminal-gradient">Assessment Results</span> - You're AI-Ready!';
            } else if (score >= 50) {
                mainHeading.innerHTML = 'Your AI Readiness <span class="terminal-gradient">Assessment Results</span> - Your AI Journey Starts Here';
            } else {
                mainHeading.innerHTML = 'Your AI Readiness <span class="terminal-gradient">Assessment Results</span> - Building Your AI Foundation';
            }
        }
    }

    // Animate number from start to end over duration
    function animateNumber(element, start, end, duration) {
        console.log(`Animating number from ${start} to ${end} over ${duration}ms`);

        // Set initial value immediately
        element.textContent = start;

        // If start and end are the same, no need to animate
        if (start === end) return;

        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(function() {
            current += increment;
            element.textContent = current;

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Add a test button for debugging
    const testButton = document.createElement('button');
    testButton.textContent = "Show Results (Test)";
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#0f0';
    testButton.style.color = '#000';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';

    testButton.onclick = function() {
        console.log("Test button clicked");
        processFormSubmission();
    };

    document.body.appendChild(testButton);

    // Direct fix for the submit button
    if (submitButton) {
        // Replace the button with a new one to remove any existing event handlers
        const newSubmitButton = document.createElement('button');
        newSubmitButton.type = 'button';
        newSubmitButton.className = submitButton.className;
        newSubmitButton.innerHTML = submitButton.innerHTML;
        newSubmitButton.setAttribute('style', 'background: linear-gradient(90deg, var(--terminal-green), var(--terminal-cyan)); color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.25rem; cursor: pointer;');

        // Add the direct click handler
        newSubmitButton.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("New submit button clicked");
            processFormSubmission();
            return false;
        };

        // Replace the old button with the new one
        if (submitButton.parentNode) {
            submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
            console.log("Submit button replaced with new one");
        }
    }

    // Also add a global click handler for any element with the submit-assessment class
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('submit-assessment') ||
            event.target.closest('.submit-assessment')) {
            event.preventDefault();
            event.stopPropagation();
            console.log("Global click handler caught submit button click");
            processFormSubmission();
            return false;
        }
    }, true);
});
