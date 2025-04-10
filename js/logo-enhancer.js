/**
 * Logo Enhancer for AI Unplugged
 * Adds interactive 3D rotation effects to the PNG logo
 */

document.addEventListener('DOMContentLoaded', function() {
    enhance3DLogo();
});

/**
 * Enhances the logo with 3D rotation effects
 */
function enhance3DLogo() {
    const logoImg = document.querySelector('.logo img.logo-rotate-3d');
    if (!logoImg) return;

    // Add initial appearance animation
    logoImg.style.opacity = '0';
    setTimeout(() => {
        logoImg.style.opacity = '1';
        logoImg.style.transition = 'opacity 0.5s ease';
    }, 300);

    // Add interactive rotation control with mouse movement
    document.addEventListener('mousemove', function(e) {
        // Only apply custom rotation when not hovering directly over the logo
        if (logoImg.matches(':hover')) return;

        // Calculate mouse position relative to center of screen
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

        // Adjust rotation speed based on mouse position
        const currentStyle = getComputedStyle(logoImg);
        const currentAnimation = currentStyle.animationDuration;

        // Speed up or slow down based on mouse position
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const newSpeed = 8 + (distance * 4); // 8-12s range

        // Only update if there's a significant change to avoid constant reflows
        if (Math.abs(parseFloat(currentAnimation) - newSpeed) > 1) {
            logoImg.style.animationDuration = `${newSpeed}s`;
        }
    });

    // Add click effect to reverse rotation direction
    logoImg.addEventListener('click', function(e) {
        // Don't interfere with the link navigation
        e.stopPropagation();

        // Toggle rotation direction
        const currentDirection = this.style.animationDirection;
        if (currentDirection === 'reverse') {
            this.style.animationDirection = 'normal';
        } else {
            this.style.animationDirection = 'reverse';
        }

        // Add glow pulse effect on click
        const glowEffect = document.createElement('div');
        glowEffect.className = 'logo-glow-effect';
        glowEffect.style.position = 'absolute';
        glowEffect.style.top = '0';
        glowEffect.style.left = '0';
        glowEffect.style.width = '100%';
        glowEffect.style.height = '100%';
        glowEffect.style.borderRadius = '8px';
        glowEffect.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
        glowEffect.style.animation = 'logo-glow-pulse 1s ease-out';
        glowEffect.style.pointerEvents = 'none';

        this.parentNode.style.position = 'relative';
        this.parentNode.appendChild(glowEffect);

        setTimeout(() => {
            glowEffect.remove();
        }, 1000);
    });

    // Add hover effect to show logo front-facing
    logoImg.addEventListener('mouseover', function() {
        // Pause the animation and show front face
        this.style.animationPlayState = 'paused';
        this.style.transform = 'scale(1.1) perspective(800px) rotateY(0deg)';
    });

    logoImg.addEventListener('mouseout', function() {
        // Resume the animation
        this.style.animationPlayState = 'running';
        this.style.transform = '';
    });
}

// Add glow pulse animation to the document
const style = document.createElement('style');
style.textContent = `
@keyframes logo-glow-pulse {
    0% {
        opacity: 0.8;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(1.5);
    }
}
`;
document.head.appendChild(style);
