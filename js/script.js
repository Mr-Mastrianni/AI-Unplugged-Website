document.addEventListener('DOMContentLoaded', function() {
    // Add page transition effect
    document.body.classList.add('page-loaded');
    
    // Back to Top Button - Moving initialization up before it's used
    const backToTopButton = document.createElement('div');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add subtle parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        const heroImage = document.querySelector('.hero-image img');
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (heroImage) {
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        serviceCards.forEach((card, index) => {
            const factor = (index + 1) * 0.2;
            card.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
    
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        // Toggle menu on click
        hamburger.addEventListener('click', function() {
            toggleMenu();
        });
        
        // Toggle menu on keypress (Enter or Space)
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Toggle menu function
        function toggleMenu() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const expanded = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded);
            
            // If menu is expanded, set focus to the first navigation item
            if (expanded) {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) {
                    setTimeout(() => {
                        firstLink.focus();
                    }, 100);
                }
            }
        }
    }
    
    // Close menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus(); // Return focus to hamburger
        }
    });
    
    // Dark Mode Toggle
    const darkModeToggle = document.createElement('div');
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(darkModeToggle);
    
    // Check for saved dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Apply dark mode if saved or system preference
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Toggle icon
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Apply glass effect to elements when in dark mode
        applyGlassEffects(isDarkMode);
    });
    
    // Apply glassmorphism effects and animation to elements
    function applyGlassEffects(isDarkMode) {
        const serviceCards = document.querySelectorAll('.service-card');
        const testimonials = document.querySelectorAll('.testimonial');
        const logoImg = document.querySelector('.logo img');
        
        // Add subtle pulse/glow effect to logo on dark mode
        if (logoImg) {
            if (isDarkMode) {
                logoImg.classList.add('logo-dark-mode');
            } else {
                logoImg.classList.remove('logo-dark-mode');
            }
        }
        
        // Add staggered animation to service cards
        serviceCards.forEach((card, index) => {
            // Add animation with delay based on index
            card.style.animationDelay = `${0.1 * index}s`;
            card.classList.add('animated-element');
            
            if (isDarkMode) {
                card.classList.add('glass');
            } else {
                card.classList.remove('glass');
            }
        });
        
        testimonials.forEach((testimonial, index) => {
            // Add animation with delay based on index
            testimonial.style.animationDelay = `${0.1 * index}s`;
            testimonial.classList.add('animated-element');
            
            if (isDarkMode) {
                testimonial.classList.add('glass');
            } else {
                testimonial.classList.remove('glass');
            }
        });
        
        // Apply glass effect to back to top button and dark mode toggle
        backToTopButton.classList.toggle('glass', isDarkMode);
        darkModeToggle.classList.toggle('glass', isDarkMode);
    }
    
    // Add scroll animation observer
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .testimonial, .assessment-content, .about-content, .cta .container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Call the scroll animation function
    animateOnScroll();
    
    // Apply glass effects on initial load
    applyGlassEffects(document.body.classList.contains('dark-mode'));
    
    // Glassmorphism Header on scroll
    const header = document.querySelector('header');
    
    // Show/hide back to top button and apply glass header based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
            header.classList.add('glass-header');
        } else {
            backToTopButton.classList.remove('visible');
            header.classList.remove('glass-header');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Testimonial Slider with improved microinteractions
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Add auto-scroll functionality
        let autoScrollInterval;
        let currentScroll = 0;
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        
        // Start auto-scroll
        function startAutoScroll() {
            if (testimonials.length <= 1) return;
            
            autoScrollInterval = setInterval(() => {
                currentScroll++;
                if (currentScroll >= testimonials.length) {
                    currentScroll = 0;
                }
                
                // Smooth scroll to the next testimonial
                testimonialSlider.scrollTo({
                    left: testimonials[currentScroll].offsetLeft,
                    behavior: 'smooth'
                });
            }, 5000); // Auto-scroll every 5 seconds
        }
        
        // Stop auto-scroll when user interacts
        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        // Mouse events for slider
        testimonialSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialSlider.classList.add('active');
            startX = e.pageX - testimonialSlider.offsetLeft;
            scrollLeft = testimonialSlider.scrollLeft;
            stopAutoScroll();
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialSlider.classList.remove('active');
            startAutoScroll();
        });
        
        testimonialSlider.addEventListener('mouseup', () => {
            isDown = false;
            testimonialSlider.classList.remove('active');
            startAutoScroll();
        });
        
        testimonialSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialSlider.scrollLeft = scrollLeft - walk;
            
            // Update current scroll position based on scroll position
            const sliderWidth = testimonialSlider.offsetWidth;
            currentScroll = Math.floor(testimonialSlider.scrollLeft / sliderWidth);
        });
        
        // Touch events for mobile
        testimonialSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            testimonialSlider.classList.add('active');
            startX = e.touches[0].pageX - testimonialSlider.offsetLeft;
            scrollLeft = testimonialSlider.scrollLeft;
            stopAutoScroll();
        });
        
        testimonialSlider.addEventListener('touchend', () => {
            isDown = false;
            testimonialSlider.classList.remove('active');
            startAutoScroll();
        });
        
        testimonialSlider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - testimonialSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialSlider.scrollLeft = scrollLeft - walk;
            
            // Update current scroll position based on scroll position
            const sliderWidth = testimonialSlider.offsetWidth;
            currentScroll = Math.floor(testimonialSlider.scrollLeft / sliderWidth);
        });
        
        // Start auto-scroll on page load
        startAutoScroll();
        
        // Add scroll indicators
        const scrollIndicators = document.createElement('div');
        scrollIndicators.classList.add('testimonial-indicators');
        
        testimonials.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('testimonial-indicator');
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                stopAutoScroll();
                currentScroll = index;
                testimonialSlider.scrollTo({
                    left: testimonials[index].offsetLeft,
                    behavior: 'smooth'
                });
                
                // Update active indicator
                document.querySelectorAll('.testimonial-indicator').forEach((ind, i) => {
                    if (i === index) {
                        ind.classList.add('active');
                    } else {
                        ind.classList.remove('active');
                    }
                });
                
                startAutoScroll();
            });
            
            scrollIndicators.appendChild(indicator);
        });
        
        // Add indicators after the slider
        testimonialSlider.parentNode.insertBefore(scrollIndicators, testimonialSlider.nextSibling);
        
        // Update indicators on scroll
        testimonialSlider.addEventListener('scroll', () => {
            const sliderWidth = testimonialSlider.offsetWidth;
            const scrollPosition = testimonialSlider.scrollLeft;
            const activeIndex = Math.round(scrollPosition / sliderWidth);
            
            document.querySelectorAll('.testimonial-indicator').forEach((indicator, index) => {
                if (index === activeIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        });
    }
    
    // Form Validation with microinteractions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Add input animation effects
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Add focus class for label animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input already has value on page load
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
        
        // Add microinteraction to form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                shakefield(nameInput);
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                shakefield(emailInput);
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                shakefield(emailInput);
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                shakefield(messageInput);
                isValid = false;
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // Add loading animation
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate AJAX call with timeout
                setTimeout(() => {
                    // Here you would normally handle the form submission via AJAX
                    const formContainer = document.querySelector('.form-container');
                    
                    // Create success message with animation
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<div class="success-icon"><i class="fas fa-check-circle"></i></div><h3>Thank You!</h3><p>Your message has been sent successfully. We will get back to you soon.</p>';
                    
                    // Replace form with success message
                    formContainer.innerHTML = '';
                    formContainer.appendChild(successMessage);
                    
                    // Add animation class after a small delay
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 100);
                }, 1500);
            }
        });
        
        // Shake animation for invalid fields
        function shakefield(field) {
            field.classList.add('shake');
            setTimeout(() => {
                field.classList.remove('shake');
            }, 600);
        }
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        input.classList.add('error');
    }
    
    function clearError(input) {
        const formGroup = input.parentElement;
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
    
    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon i');
            
            // Hide answers initially
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease-out';
            
            question.addEventListener('click', () => {
                // Toggle the active class
                item.classList.toggle('active');
                
                // Toggle the icon
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                    answer.style.maxHeight = '0';
                }
            });
        });
    }
    
    // Image Optimization: add loading="lazy" to non-critical images
    // Only add to images below the fold
    const lazyImages = document.querySelectorAll('.service-card img, .testimonial img, #about-brief img');
    lazyImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});