// A/B Testing for Homepage Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Only run on the homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Initialize A/B test
        initABTest();
    }
});

// Initialize A/B test
function initABTest() {
    // Check if user has already been assigned a variant
    let variant = localStorage.getItem('hero_variant');
    
    // If not, randomly assign one
    if (!variant) {
        // 50% chance for each variant
        variant = Math.random() < 0.5 ? 'A' : 'B';
        
        // Save the variant assignment
        localStorage.setItem('hero_variant', variant);
    }
    
    // Apply the variant
    if (variant === 'B') {
        applyVariantB();
    }
    
    // Track view for analytics
    trackEvent('hero_view', { variant });
}

// Apply Variant B (alternative hero section)
function applyVariantB() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const heroContent = heroSection.querySelector('.hero-content');
    if (!heroContent) return;
    
    // Change headline
    const headline = heroContent.querySelector('h1');
    if (headline) {
        headline.textContent = 'Transform Your Small Business with AI Solutions';
    }
    
    // Change subheadline
    const subheadline = heroContent.querySelector('p');
    if (subheadline) {
        subheadline.textContent = 'Get started with AI today. Easy to implement, affordable solutions with proven ROI for businesses of any size.';
    }
    
    // Change primary CTA
    const primaryCTA = heroContent.querySelector('.btn-primary');
    if (primaryCTA) {
        primaryCTA.textContent = 'Get Started Free';
        primaryCTA.href = 'assessment/index.html';
    }
    
    // Change secondary CTA
    const secondaryCTA = heroContent.querySelector('.btn-secondary');
    if (secondaryCTA) {
        secondaryCTA.textContent = 'See Success Stories';
        secondaryCTA.href = '#testimonials';
    }
    
    // Add urgency element
    const urgencyElement = document.createElement('div');
    urgencyElement.className = 'hero-urgency';
    urgencyElement.innerHTML = '<p><i class="fas fa-clock"></i> Limited Time: Free AI Readiness Assessment ($499 value)</p>';
    
    urgencyElement.style.backgroundColor = 'rgba(251, 188, 5, 0.1)';
    urgencyElement.style.border = '1px solid rgba(251, 188, 5, 0.3)';
    urgencyElement.style.borderRadius = '4px';
    urgencyElement.style.padding = '10px 15px';
    urgencyElement.style.marginTop = '20px';
    urgencyElement.style.display = 'flex';
    urgencyElement.style.alignItems = 'center';
    urgencyElement.style.justifyContent = 'center';
    
    urgencyElement.querySelector('i').style.marginRight = '8px';
    urgencyElement.querySelector('i').style.color = '#fbbc05';
    
    // Add to DOM
    heroContent.appendChild(urgencyElement);
    
    // Add conversion tracking to CTAs
    if (primaryCTA) {
        primaryCTA.addEventListener('click', function() {
            trackEvent('hero_cta_click', { variant: 'B', cta: 'primary' });
        });
    }
    
    if (secondaryCTA) {
        secondaryCTA.addEventListener('click', function() {
            trackEvent('hero_cta_click', { variant: 'B', cta: 'secondary' });
        });
    }
}

// Track events (placeholder for actual analytics implementation)
function trackEvent(eventName, eventParams) {
    // This would normally send data to your analytics platform
    // For this example, we'll just log to console
    console.log(`[AB Test] Event: ${eventName}`, eventParams);
    
    // In a real implementation, you might use something like:
    // if (typeof gtag === 'function') {
    //     gtag('event', eventName, eventParams);
    // }
}

// Function to reset test (for development)
window.resetABTest = function() {
    localStorage.removeItem('hero_variant');
    window.location.reload();
}; 