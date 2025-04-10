/**
 * AI Assessment Integration
 * Integrates AI components with the existing assessment form
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("AI Assessment Integration loaded");
    
    // Initialize AI components
    const adaptiveAssessment = new AdaptiveAssessment();
    const dynamicScoring = new DynamicScoring();
    let userResponses = {};
    
    // Get form elements
    const form = document.getElementById('ai-assessment');
    const assessmentForm = document.getElementById('assessment-form');
    const assessmentResults = document.getElementById('assessment-results');
    
    if (!form || !assessmentForm || !assessmentResults) {
        console.error("Critical elements not found for AI assessment integration!");
        return;
    }
    
    // Add AI badge to the assessment form
    const aiEnhancementBadge = document.createElement('div');
    aiEnhancementBadge.className = 'ai-enhancement-badge';
    aiEnhancementBadge.innerHTML = '<i class="fas fa-robot"></i> AI-Enhanced Assessment';
    assessmentForm.querySelector('.terminal-header').appendChild(aiEnhancementBadge);
    
    // Handle question navigation with AI adaptation
    const nextButtons = document.querySelectorAll('.next-question');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSlide = this.closest('.question-slide');
            if (!currentSlide) return;
            
            const currentQuestionNumber = parseInt(currentSlide.dataset.question);
            if (isNaN(currentQuestionNumber)) return;
            
            console.log(`Moving from question ${currentQuestionNumber} to ${currentQuestionNumber + 1}`);
            
            // Collect current question responses
            const currentResponse = collectQuestionResponses(currentSlide);
            userResponses[currentQuestionNumber] = currentResponse;
            
            console.log("Current question responses:", currentResponse);
            console.log("All responses so far:", userResponses);
            
            // Get AI adaptations for next question
            const adaptations = adaptiveAssessment.adaptQuestions(currentResponse, currentQuestionNumber);
            
            // Apply adaptations if available
            if (adaptations) {
                console.log("Applying adaptations:", adaptations);
                const nextQuestionNumber = currentQuestionNumber + 1;
                const nextSlide = document.querySelector(`.question-slide[data-question="${nextQuestionNumber}"]`);
                
                if (nextSlide) {
                    applyQuestionAdaptations(adaptations, nextSlide);
                }
            }
        });
    });
    
    // Override the submit button to use AI-enhanced results
    const submitButton = document.querySelector('.submit-assessment');
    if (submitButton) {
        // Store the original onclick handler if it exists
        const originalOnClick = submitButton.onclick;
        
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            console.log("Submit button clicked, generating AI-enhanced results");
            
            // Collect final responses from the current question
            const currentSlide = document.querySelector('.question-slide[style*="display: block"]');
            if (currentSlide) {
                const currentQuestionNumber = parseInt(currentSlide.dataset.question);
                if (!isNaN(currentQuestionNumber)) {
                    const currentResponse = collectQuestionResponses(currentSlide);
                    userResponses[currentQuestionNumber] = currentResponse;
                }
            }
            
            console.log("Final user responses:", userResponses);
            
            // Calculate score using dynamic weighting
            const score = dynamicScoring.calculateScore(userResponses);
            console.log("AI-calculated score:", score);
            
            // Generate AI-enhanced results
            const resultsGenerator = new AIResultsGenerator(userResponses, score);
            const roiCalculator = new AIROICalculator(userResponses);
            
            // Hide the form
            assessmentForm.style.display = 'none';
            
            // Generate and display results
            generateEnhancedResults(score, resultsGenerator, roiCalculator);
            
            // Show results
            assessmentResults.style.display = 'block';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Call the original onclick handler if it exists
            if (typeof originalOnClick === 'function') {
                originalOnClick.call(this, event);
            }
        });
    }
    
    // Helper functions
    function collectQuestionResponses(questionSlide) {
        if (!questionSlide) return {};
        
        const response = {};
        
        // Collect checkbox values
        const checkboxes = questionSlide.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const name = checkbox.name;
            if (!response[name]) response[name] = [];
            response[name].push(checkbox.value);
        });
        
        // Collect radio values
        const radios = questionSlide.querySelectorAll('input[type="radio"]:checked');
        radios.forEach(radio => {
            response[radio.name] = radio.value;
        });
        
        // Collect select values
        const selects = questionSlide.querySelectorAll('select');
        selects.forEach(select => {
            if (select.value) response[select.id] = select.value;
        });
        
        return response;
    }
    
    function applyQuestionAdaptations(adaptations, questionSlide) {
        if (!questionSlide) return;
        
        if (adaptations.type === "prioritizeGoals") {
            // Highlight recommended goals
            adaptations.goals.forEach(goal => {
                const goalElements = questionSlide.querySelectorAll('input[type="checkbox"]');
                goalElements.forEach(element => {
                    if (element.value === goal && element.parentElement) {
                        // Add AI recommendation styling
                        element.parentElement.classList.add('ai-recommended');
                        
                        // Add AI recommendation badge if it doesn't exist
                        if (!element.parentElement.querySelector('.ai-badge')) {
                            const badge = document.createElement('span');
                            badge.className = 'ai-badge';
                            badge.innerHTML = '<i class="fas fa-robot"></i> AI Recommended';
                            element.parentElement.appendChild(badge);
                        }
                    }
                });
            });
            
            // Add AI insight message
            if (!questionSlide.querySelector('.ai-insight')) {
                const insightMessage = document.createElement('div');
                insightMessage.className = 'ai-insight';
                insightMessage.innerHTML = `<p>Based on your selected processes, these goals are most likely to deliver significant ROI for your business.</p>`;
                
                const insertPoint = questionSlide.querySelector('.grid') || questionSlide.querySelector('h3').nextElementSibling;
                if (insertPoint && insertPoint.nextElementSibling) {
                    questionSlide.insertBefore(insightMessage, insertPoint.nextElementSibling);
                }
            }
        } else if (adaptations.type === "recommendBudget") {
            // Highlight recommended budget option
            const budgetRadios = questionSlide.querySelectorAll('input[type="radio"]');
            budgetRadios.forEach(radio => {
                if (radio.value === adaptations.budget && radio.parentElement) {
                    // Add AI recommendation styling
                    radio.parentElement.classList.add('ai-recommended');
                    
                    // Add AI recommendation badge if it doesn't exist
                    if (!radio.parentElement.querySelector('.ai-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'ai-badge';
                        badge.innerHTML = '<i class="fas fa-robot"></i> AI Recommended';
                        radio.parentElement.appendChild(badge);
                    }
                }
            });
            
            // Add AI insight message
            if (!questionSlide.querySelector('.ai-insight')) {
                const insightMessage = document.createElement('div');
                insightMessage.className = 'ai-insight';
                insightMessage.innerHTML = `<p>Based on your selected processes, we estimate an implementation cost of approximately $${adaptations.estimatedCost.toLocaleString()}. The recommended budget range will provide the best balance of capabilities and ROI.</p>`;
                
                const insertPoint = questionSlide.querySelector('.grid') || questionSlide.querySelector('h3').nextElementSibling;
                if (insertPoint && insertPoint.nextElementSibling) {
                    questionSlide.insertBefore(insightMessage, insertPoint.nextElementSibling);
                }
            }
        }
    }
    
    function generateEnhancedResults(score, resultsGenerator, roiCalculator) {
        console.log("Generating enhanced results with score:", score);
        
        // Add AI-enhanced assessment summary
        const summaryElement = document.createElement('div');
        summaryElement.className = 'mb-8';
        summaryElement.innerHTML = `
            <h3 class="text-xl font-bold mb-4 terminal-text">AI-Enhanced <span class="terminal-gradient">Assessment Summary</span></h3>
            <p id="assessment-summary" class="text-terminal-green mb-4">${resultsGenerator.generatePersonalizedSummary()}</p>
            
            <div class="ai-insight">
                <p>Based on analysis of similar businesses in your industry, AI implementation typically results in 25-35% efficiency improvements and 15-25% cost reductions within the first year.</p>
            </div>
        `;
        
        // Insert the summary at the beginning of the results section
        const resultsContainer = document.querySelector('#assessment-results .container');
        if (resultsContainer) {
            const firstChild = resultsContainer.firstChild;
            resultsContainer.insertBefore(summaryElement, firstChild);
        }
        
        // Update score display
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
            const interpretation = dynamicScoring.getScoreInterpretation(score);
            interpretationElement.innerHTML = `
                <div class="mb-2"><strong class="terminal-gradient">${interpretation.level} Readiness Level</strong></div>
                ${interpretation.description}
            `;
        }
        
        // Generate key findings
        const findingsElement = document.getElementById('key-findings');
        if (findingsElement) {
            findingsElement.innerHTML = '';
            const findings = resultsGenerator.generateKeyFindings();
            findings.forEach(finding => {
                const listItem = document.createElement('li');
                listItem.textContent = finding;
                findingsElement.appendChild(listItem);
            });
        }
        
        // Generate ROI analysis
        const roiElement = document.getElementById('roi-analysis');
        if (roiElement) {
            const roi = roiCalculator.calculateROI();
            roiElement.innerHTML = roiCalculator.generateROIVisualization(roi);
        }
        
        // Generate recommended solutions
        const solutionsElement = document.getElementById('recommended-solutions');
        if (solutionsElement) {
            solutionsElement.innerHTML = '';
            
            // Get recommendations from adaptive assessment
            const recommendations = adaptiveAssessment.generateRecommendations();
            
            // Add solution cards
            recommendations.solutions.forEach(solution => {
                const solutionCard = document.createElement('div');
                solutionCard.className = 'ai-recommendation-card';
                
                let benefitsList = '';
                if (solution.benefits && solution.benefits.length) {
                    benefitsList = '<ul class="mt-4">';
                    solution.benefits.forEach(benefit => {
                        benefitsList += `<li>${benefit}</li>`;
                    });
                    benefitsList += '</ul>';
                }
                
                solutionCard.innerHTML = `
                    <h4>${solution.name}</h4>
                    <p>${solution.description}</p>
                    ${benefitsList}
                    <div class="confidence">
                        <span>AI Confidence: ${solution.confidence}%</span>
                        <div class="confidence-meter">
                            <div class="confidence-fill" style="width: ${solution.confidence}%"></div>
                        </div>
                    </div>
                `;
                
                solutionsElement.appendChild(solutionCard);
            });
            
            // Add industry-specific recommendations if available
            if (recommendations.industrySpecific && recommendations.industrySpecific.length) {
                const industryInsight = document.createElement('div');
                industryInsight.className = 'industry-benchmark mt-6';
                
                let recommendationsList = '<ul class="mt-2">';
                recommendations.industrySpecific.forEach(rec => {
                    recommendationsList += `<li><i class="fas fa-check-circle text-terminal-green mr-2"></i>${rec}</li>`;
                });
                recommendationsList += '</ul>';
                
                industryInsight.innerHTML = `
                    <h5>Industry-Specific Recommendations</h5>
                    <p>Based on successful implementations in your industry:</p>
                    ${recommendationsList}
                `;
                
                solutionsElement.appendChild(industryInsight);
            }
        }
        
        // Update next steps
        const nextStepsElement = document.getElementById('next-steps');
        if (nextStepsElement) {
            const interpretation = dynamicScoring.getScoreInterpretation(score);
            
            let stepsList = '<ol class="next-steps-list">';
            interpretation.nextSteps.forEach(step => {
                stepsList += `<li>${step}</li>`;
            });
            stepsList += '</ol>';
            
            nextStepsElement.innerHTML = `
                <p>Based on your AI readiness score, we recommend the following next steps:</p>
                ${stepsList}
            `;
        }
        
        // Update CTA section
        const mainHeading = document.querySelector('#assessment-results h2');
        if (mainHeading) {
            const interpretation = dynamicScoring.getScoreInterpretation(score);
            mainHeading.innerHTML = `Your AI Readiness <span class="terminal-gradient">Assessment Results</span> - ${interpretation.level} Level`;
        }
    }
    
    // Add this function if it doesn't exist
    if (typeof animateNumber !== 'function') {
        window.animateNumber = function(element, start, end, duration) {
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
        };
    }
});
