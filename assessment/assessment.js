document.addEventListener('DOMContentLoaded', function() {
    console.log("Assessment script loaded");

    // Element references
    const startButton = document.getElementById('start-assessment');
    const assessmentIntro = document.getElementById('assessment-intro');
    const assessmentForm = document.getElementById('assessment-form');
    const assessmentResults = document.getElementById('assessment-results');
    const form = document.getElementById('ai-assessment');
    const progressBar = document.querySelector('.progress');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    
    // Log elements for debugging
    console.log("Start button:", startButton);
    console.log("Assessment intro:", assessmentIntro);
    console.log("Assessment form:", assessmentForm);
    
    // Assessment data
    const totalQuestions = 5;
    let currentQuestion = 1;
    
    // Initialize total questions display
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = totalQuestions;
    }
    
    // Simple function to show the assessment form directly
    function showAssessmentForm() {
        console.log("Showing assessment form");
        if (assessmentIntro) assessmentIntro.style.display = 'none';
        if (assessmentForm) assessmentForm.style.display = 'block';
        updateProgress();
    }
    
    // Add direct click handling for the start button
    if (startButton) {
        console.log("Adding click handler to start button");
        
        // Basic click handler without fancy effects
        startButton.onclick = function() {
            console.log("Start button clicked");
            showAssessmentForm();
            return false; // Prevent default behavior
        };
    } else {
        console.error("Start button not found!");
    }

    // Handle navigation buttons
    const nextButtons = document.querySelectorAll('.next-question');
    const prevButtons = document.querySelectorAll('.prev-question');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`);
            
            // Validate current question if needed
            if (validateCurrentQuestion(currentQuestion)) {
                currentSlide.style.display = 'none';
                currentQuestion++;
                
                if (currentQuestion <= totalQuestions) {
                    const nextSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`);
                    nextSlide.style.display = 'block';
                    updateProgress();
                } else {
                    // Show contact information slide
                    const contactSlide = document.querySelector('.question-slide[data-question="contact"]');
                    contactSlide.style.display = 'block';
                }
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`) || 
                               document.querySelector('.question-slide[data-question="contact"]');
            currentSlide.style.display = 'none';
            
            if (currentSlide.dataset.question === 'contact') {
                currentQuestion = totalQuestions;
            } else {
                currentQuestion--;
            }
            
            const prevSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`);
            prevSlide.style.display = 'block';
            updateProgress();
        });
    });

    // Submit assessment button click handler
    const submitButton = document.querySelector('.submit-assessment');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const currentSlide = document.querySelector(`.question-slide[data-question="${currentQuestion}"]`);
            if (validateCurrentQuestion(currentQuestion)) {
                // Generate results directly without showing contact form
                // Hide the form
                assessmentForm.style.display = 'none';
                
                // Generate and display results
                generateResults();
                assessmentResults.style.display = 'block';
                
                // Scroll to top of results
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Form submit handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactInfo()) {
                // Show loading state
                const submitButton = document.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Get contact information
                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                const company = document.getElementById('contact-company').value;
                const phone = document.getElementById('contact-phone').value;
                const subscribe = document.getElementById('contact-subscribe').checked;
                
                // Prepare form data
                const formData = new FormData(form);
                const assessmentData = {
                    name: name,
                    email: email,
                    company: company,
                    phone: phone,
                    subscribe: subscribe,
                    formResponses: Object.fromEntries(formData.entries())
                };
                
                // In a real implementation, this would be an API endpoint
                const apiUrl = 'https://api.example.com/assessment/submit';
                
                // Simulate sending data to server (AJAX request)
                setTimeout(function() {
                    console.log('Assessment data that would be sent to server:', assessmentData);
                    
                    // Hide the form
                    assessmentForm.style.display = 'none';
                    
                    // Generate and display results
                    generateResults();
                    assessmentResults.style.display = 'block';
                    
                    // Scroll to top of results
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Reset button state
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Show email sent notification
                    const confirmationMessage = document.querySelector('.confirmation-message p');
                    confirmationMessage.innerHTML = '<strong>Success!</strong> A copy of these results has been sent to ' + email + '.';
                    
                    // In a real implementation, we would use fetch or XMLHttpRequest:
                    /*
                    fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(assessmentData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Hide the form
                        assessmentForm.style.display = 'none';
                        
                        // Generate and display results
                        generateResults();
                        assessmentResults.style.display = 'block';
                        
                        // Scroll to top of results
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        
                        // Show email sent notification
                        const confirmationMessage = document.querySelector('.confirmation-message p');
                        confirmationMessage.innerHTML = '<strong>Success!</strong> A copy of these results has been sent to ' + email + '.';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was an error sending your assessment. Please try again.');
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
                    */
                }, 1500); // Simulate network delay
            }
        });
    }

    // Print results button handler
    const printButton = document.getElementById('print-results');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Download PDF button handler
    const downloadPdfButton = document.getElementById('download-pdf');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', function() {
            // Use company name or a default name for the filename
            const companySize = form.querySelector('select[name="company-size"]').value || '';
            const industry = form.querySelector('select[name="industry"]').value || '';
            const fileName = `AI_Readiness_Assessment_${industry ? industry.replace(/\s+/g, '_') : 'Report'}.pdf`;
            
            // Get the results section
            const resultsElement = document.getElementById('assessment-results');
            
            // Clone the results element to avoid modifying the original
            const resultsClone = resultsElement.cloneNode(true);
            
            // Add company logo and styling for PDF
            const pdfHeader = document.createElement('div');
            pdfHeader.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #007bff; margin-bottom: 5px;">AI Unplugged</h1>
                    <p style="color: #6c757d;">AI Readiness Assessment Results</p>
                    <hr style="border-top: 2px solid #007bff; margin: 20px 0;">
                </div>
            `;
            resultsClone.insertBefore(pdfHeader, resultsClone.firstChild);
            
            // Add company information if available
            if (companySize || industry) {
                const companyInfo = document.createElement('div');
                companyInfo.innerHTML = `
                    <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                        <h3 style="margin-bottom: 10px; color: #343a40;">Company Information</h3>
                        ${companySize ? `<p><strong>Company Size:</strong> ${companySize} employees</p>` : ''}
                        ${industry ? `<p><strong>Industry:</strong> ${industry}</p>` : ''}
                        <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                `;
                resultsClone.insertBefore(companyInfo, resultsClone.children[1]);
            }
            
            // Add a footer with contact information
            const pdfFooter = document.createElement('div');
            pdfFooter.innerHTML = `
                <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #6c757d;">
                    <p>For more information, contact us at:</p>
                    <p>info@aiunplugged.com | (555) 123-4567 | www.aiunplugged.com</p>
                </div>
            `;
            resultsClone.appendChild(pdfFooter);
            
            // Remove elements that shouldn't be in the PDF
            const elementsToRemove = resultsClone.querySelectorAll('.next-steps-cta, .steps-grid, .results-actions');
            elementsToRemove.forEach(el => el.remove());
            
            // Add recommended next steps
            const nextStepsElement = document.createElement('div');
            nextStepsElement.innerHTML = `
                <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff;">
                    <h3 style="color: #007bff; margin-bottom: 15px;">Recommended Next Steps</h3>
                    <ol style="padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Schedule a free consultation with our AI specialists to discuss your specific needs</li>
                        <li style="margin-bottom: 10px;">Explore the recommended AI solutions detailed in this assessment</li>
                        <li style="margin-bottom: 10px;">Develop an implementation plan based on your budget and priorities</li>
                    </ol>
                    <p style="margin-top: 15px;"><strong>Contact us today to get started:</strong> (555) 123-4567 or info@aiunplugged.com</p>
                </div>
            `;
            resultsClone.appendChild(nextStepsElement);
            
            // Configure pdf options
            const options = {
                margin: [10, 10, 10, 10],
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Show loading indicator
            downloadPdfButton.textContent = 'Generating PDF...';
            downloadPdfButton.disabled = true;
            
            // Generate PDF
            html2pdf().from(resultsClone).set(options).save().then(() => {
                // Reset button after PDF is generated
                downloadPdfButton.textContent = 'Download PDF Report';
                downloadPdfButton.disabled = false;
            });
        });
    }

    // Helper functions
    function updateProgress() {
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = currentQuestion;
        }
        
        if (progressBar) {
            const percentage = (currentQuestion / totalQuestions) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    function validateCurrentQuestion(questionNumber) {
        // Simple validation for required fields could be added here
        // For now, we'll return true for all questions
        return true;
    }
    
    function validateContactInfo() {
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const company = document.getElementById('contact-company');
        const consent = document.getElementById('contact-consent');
        let isValid = true;
        
        // Check required fields
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            clearError(name);
        }
        
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (!company.value.trim()) {
            showError(company, 'Company name is required');
            isValid = false;
        } else {
            clearError(company);
        }
        
        if (!consent.checked) {
            showError(consent, 'You must consent to receive your results');
            isValid = false;
        } else {
            clearError(consent);
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function generateResults() {
        // Get form data
        const formData = new FormData(form);
        
        try {
            // Calculate AI readiness score (simplified for demo)
            const score = calculateReadinessScore(formData);
            
            // Update score display
            const scoreElement = document.querySelector('.score-value');
            if (scoreElement) {
                // Animate the score counting up
                animateNumber(scoreElement, 0, score, 1000);
            }
            
            // Update score interpretation
            updateScoreInterpretation(score);
            
            // Generate key findings
            generateKeyFindings(formData);
            
            // Generate recommended AI solutions
            generateRecommendedSolutions(formData);
            
            // Generate ROI analysis
            generateROIAnalysis(formData);
            
            // Generate next steps
            generateNextSteps(score);
            
            // Customize the next steps CTA based on score
            customizeNextStepsCTA(score);
            
            console.log("Assessment results generated successfully");
        } catch (error) {
            console.error("Error generating results:", error);
            alert("There was an error generating your assessment results. Please try again.");
        }
    }
    
    function customizeNextStepsCTA(score) {
        const ctaTitle = document.querySelector('.next-steps-cta h3');
        const ctaDescription = document.querySelector('.next-steps-cta p');
        
        if (ctaTitle && ctaDescription) {
            if (score >= 75) {
                ctaTitle.textContent = 'You're AI-Ready!';
                ctaDescription.textContent = 'Your business is well-positioned to implement AI solutions. Here are your next steps:';
            } else if (score >= 50) {
                ctaTitle.textContent = 'Your AI Journey Starts Here';
                ctaDescription.textContent = 'With some targeted improvements, your business can successfully implement AI. Here are your next steps:';
            } else {
                ctaTitle.textContent = 'Building Your AI Foundation';
                ctaDescription.textContent = 'Your business needs to develop some fundamentals before fully implementing AI. Here are your recommended next steps:';
            }
        }
    }
    
    function calculateReadinessScore(formData) {
        // This is a simplified scoring algorithm for the 5-question assessment
        
        // Base score out of 100
        let score = 50;
        
        // Add points based on data management
        const dataManagement = formData.get('data-management');
        if (dataManagement === 'Structured and Centralized') score += 25;
        else if (dataManagement === 'Somewhat Organized') score += 15;
        else if (dataManagement === 'Manual Processes') score += 5;
        else if (dataManagement === 'Minimal Data Collection') score -= 5;
        
        // Add points based on budget
        const budget = formData.get('budget');
        if (budget === 'Over $100,000') score += 15;
        else if (budget === '$25,000 - $100,000') score += 10;
        else if (budget === '$5,000 - $25,000') score += 5;
        else if (budget === 'Under $5,000') score -= 5;
        
        // Add points based on company size (larger companies are typically more ready)
        const companySize = formData.get('company-size');
        if (companySize === 'Over 500') score += 10;
        else if (companySize === '201-500') score += 8;
        else if (companySize === '51-200') score += 5;
        else if (companySize === '11-50') score += 3;
        else if (companySize === '1-10') score += 0;
        
        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score));
        
        return Math.round(score);
    }
    
    function updateScoreInterpretation(score) {
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
    
    function generateKeyFindings(formData) {
        const findingsElement = document.getElementById('key-findings');
        
        if (findingsElement) {
            // Extract relevant data from form
            const processes = Array.from(form.querySelectorAll('input[name="processes"]:checked')).map(el => el.value);
            const goals = Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(el => el.value);
            const dataManagement = formData.get('data-management');
            const budget = formData.get('budget');
            const companySize = formData.get('company-size');
            const industry = formData.get('industry');
            
            // Generate findings based on form data
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
            findingsElement.innerHTML = '';
            findings.forEach(finding => {
                const listItem = document.createElement('li');
                listItem.textContent = finding;
                findingsElement.appendChild(listItem);
            });
        }
    }
    
    function getIndustryStrengths(industry) {
        // Return recommended focus areas based on industry
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
    
    function generateRecommendedSolutions(formData) {
        const solutionsElement = document.getElementById('recommended-solutions');
        
        if (solutionsElement) {
            const solutions = [];
            
            // Extract relevant data from form
            const processes = Array.from(form.querySelectorAll('input[name="processes"]:checked')).map(el => el.value);
            const budget = formData.get('budget');
            const dataManagement = formData.get('data-management');
            const industry = formData.get('industry');
            
            // Based on selected processes, recommend solutions
            
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
            
            // Reporting solution
            if (processes.includes('Reporting & Analytics')) {
                solutions.push({
                    title: 'Automated Business Intelligence',
                    description: 'Implement AI-powered analytics tools that automatically generate insights, reports, and dashboards from your business data.',
                    benefits: [
                        'Eliminate manual report creation',
                        'Uncover hidden patterns and trends',
                        'Make data-driven decisions faster',
                        'Scale your analytics capabilities'
                    ]
                });
            }
            
            // Finance solution
            if (processes.includes('Finance & Accounting')) {
                solutions.push({
                    title: 'Automated Financial Operations',
                    description: 'Use AI to automate invoice processing, expense management, and financial forecasting.',
                    benefits: [
                        'Reduce accounting errors',
                        'Accelerate invoice processing',
                        'Improve cash flow management',
                        'More accurate financial forecasting'
                    ]
                });
            }
            
            // Data Foundation solution (for companies with less structured data)
            if (dataManagement === 'Manual Processes' || dataManagement === 'Minimal Data Collection') {
                solutions.push({
                    title: 'Data Foundation Setup',
                    description: 'Establish a solid data infrastructure as the foundation for future AI implementations.',
                    benefits: [
                        'Centralize your business data',
                        'Implement digital record-keeping',
                        'Create data governance practices',
                        'Prepare for advanced AI capabilities'
                    ]
                });
            }
            
            // Budget-based solution
            if (budget === 'Under $5,000') {
                solutions.push({
                    title: 'Starter AI Implementation',
                    description: 'Begin with cost-effective AI tools that can deliver immediate value without significant investment.',
                    benefits: [
                        'Off-the-shelf AI solutions',
                        'Quick implementation timeline',
                        'Minimal training requirements',
                        'Rapid ROI realization'
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
            solutionsElement.innerHTML = '';
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
    }
    
    function generateROIAnalysis(formData) {
        const roiElement = document.getElementById('roi-analysis');
        
        if (roiElement) {
            // Get relevant values from form
            const hourlyRate = parseFloat(document.getElementById('employee-rate').value) || 35;
            const companySize = formData.get('company-size') || '11-50';
            const processes = Array.from(form.querySelectorAll('input[name="processes"]:checked')).map(el => el.value);
            
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
            const budget = formData.get('budget');
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
    }
    
    function generateNextSteps(score) {
        const nextStepsElement = document.getElementById('next-steps');
        
        if (nextStepsElement) {
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
    }
    
    function animateNumber(element, start, end, duration) {
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
    
    // Handle conditional input display
    const conditionalInputTriggers = document.querySelectorAll('input[type="checkbox"][id$="-other"], input[type="radio"][value="Other"]');
    
    conditionalInputTriggers.forEach(trigger => {
        trigger.addEventListener('change', function() {
            const inputId = this.id + '-text';
            const conditionalInput = document.getElementById(inputId) || 
                                   this.parentElement.querySelector('.conditional-input');
            
            if (conditionalInput) {
                conditionalInput.style.display = this.checked ? 'block' : 'none';
                
                if (this.checked) {
                    conditionalInput.focus();
                }
            }
        });
    });
    
    // Enable/disable process impact fields based on checkbox state
    const processCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="process-"]');
    
    processCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const processId = this.id.replace('process-', '');
            const hoursInput = document.getElementById(`process-${processId}-hours`);
            const costInput = document.getElementById(`process-${processId}-cost`);
            
            if (hoursInput) hoursInput.disabled = !this.checked;
            if (costInput) costInput.disabled = !this.checked;
            
            if (this.checked) {
                if (hoursInput) hoursInput.focus();
            }
        });
    });
    
    // Show/hide department barriers based on checkbox state
    const departmentCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="dept-"]');
    
    departmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const barrierContainer = this.closest('.department-item').querySelector('.department-barriers');
            
            if (barrierContainer) {
                barrierContainer.style.display = this.checked ? 'block' : 'none';
            }
        });
    });
    
    // Show/hide decision makers other input
    const decisionMakersSelect = document.getElementById('decision-makers');
    const decisionMakersOther = document.getElementById('decision-makers-other');
    
    if (decisionMakersSelect && decisionMakersOther) {
        decisionMakersSelect.addEventListener('change', function() {
            decisionMakersOther.style.display = this.value === 'Other' ? 'block' : 'none';
            
            if (this.value === 'Other') {
                decisionMakersOther.focus();
            }
        });
    }
});