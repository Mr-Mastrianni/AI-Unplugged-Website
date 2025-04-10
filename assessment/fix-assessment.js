// This script fixes the assessment form submission
document.addEventListener('DOMContentLoaded', function() {
    console.log("Assessment fix script loaded");
    
    // Direct fix for the submit button
    const submitButton = document.querySelector('.submit-assessment');
    const assessmentForm = document.getElementById('assessment-form');
    const assessmentResults = document.getElementById('assessment-results');
    
    if (submitButton) {
        console.log("Found submit button, adding direct handler");
        
        // Add a direct click handler that bypasses the event system
        submitButton.onclick = function(event) {
            console.log("Submit button clicked directly");
            event.preventDefault();
            
            // Hide the form immediately
            if (assessmentForm) {
                assessmentForm.style.display = 'none';
            }
            
            // Show the results immediately
            if (assessmentResults) {
                assessmentResults.style.display = 'block';
                assessmentResults.style.opacity = '1';
                assessmentResults.style.transform = 'translateY(0)';
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return false;
        };
    }
    
    // Add a button to manually show results (for testing)
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
        
        // Hide the form
        if (assessmentForm) {
            assessmentForm.style.display = 'none';
        }
        
        // Show the results
        if (assessmentResults) {
            assessmentResults.style.display = 'block';
            assessmentResults.style.opacity = '1';
            assessmentResults.style.transform = 'translateY(0)';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(testButton);
});
