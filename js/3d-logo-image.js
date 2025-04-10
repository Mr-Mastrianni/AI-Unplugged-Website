/**
 * 3D Logo Image for AI Unplugged
 * Replaces the 3D brain with the AI Unplugged logo image with 3D rotation effects
 */

// Global variables
let scene, camera, renderer, logoMesh;
let animationFrameId;
let isInitialized = false;
let mouseX = 0;
let mouseY = 0;
let lastFrameTime = 0;
let fps = 60;
let fpsInterval = 1000 / fps;
let isVisible = true;
let particleSystem;
let clock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;

// Initialize the 3D logo animation
function init3DLogo() {
    // Check if already initialized
    if (isInitialized) return;
    isInitialized = true;

    // Get the container
    const container = document.getElementById('logo-container');
    if (!container) return;

    // Clear any existing content except the fallback logo
    // We'll keep the fallback logo until the 3D version is ready
    const fallbackLogo = container.querySelector('.logo-fallback-container');
    container.innerHTML = '';
    if (fallbackLogo) {
        container.appendChild(fallbackLogo);
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'logo-canvas';
    container.appendChild(canvas);

    // Add loading indicator
    const loading = document.createElement('div');
    loading.className = 'logo-loading';
    loading.innerHTML = '<div class="spinner"></div><p>Loading AI Unplugged Logo...</p>';
    container.appendChild(loading);

    // Initialize Three.js with a slight delay to ensure DOM is ready
    setTimeout(() => {
        initThreeJS(canvas, loading);
    }, 100);
}

// Initialize Three.js scene
function initThreeJS(canvas, loadingElement) {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        // Load Three.js dynamically - using a more recent version
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', () => {
            // Load additional libraries
            loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js', () => {
                setupScene(canvas, loadingElement);
            });
        });
    } else {
        // Check if OrbitControls is loaded
        if (typeof THREE.OrbitControls === 'undefined') {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js', () => {
                setupScene(canvas, loadingElement);
            });
        } else {
            setupScene(canvas, loadingElement);
        }
    }
}

// Set up the Three.js scene with improved initialization
function setupScene(canvas, loadingElement) {
    try {
        // Initialize clock first
        clock = new THREE.Clock();

        // Create scene
        scene = new THREE.Scene();

        // Create camera with proper aspect ratio
        const aspectRatio = canvas.clientWidth / canvas.clientHeight || 1;
        camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        camera.position.z = 14; // Move camera back further to accommodate much larger logo

        // Create renderer with error handling
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance' // Request high performance mode
            });

            // Set renderer properties
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
            renderer.setClearColor(0x000000, 0);

            // Enable shadow maps for better quality if needed
            // renderer.shadowMap.enabled = true;
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        } catch (e) {
            console.error('Failed to create WebGL renderer:', e);
            createLogoFallback();
            return;
        }

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add point lights for glow effect
        const greenLight = new THREE.PointLight(0x00ff00, 1, 10);
        greenLight.position.set(2, 2, 2);
        scene.add(greenLight);

        const blueLight = new THREE.PointLight(0x0088ff, 1, 10);
        blueLight.position.set(-2, -2, 2);
        scene.add(blueLight);

        // Create logo
        createLogo();

        // Add particles
        createParticles();

        // Initialize animation timelines
        animateParticles();

        // Add controls for interactivity
        let controls;
        try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1;
        } catch (error) {
            console.warn('OrbitControls not available, using basic rotation');
            // We'll handle rotation manually in the animation loop
        }

        // Remove loading element
        if (loadingElement) {
            loadingElement.style.opacity = 0;
            setTimeout(() => {
                loadingElement.remove();
            }, 1000);
        }

        // Handle window resize
        window.addEventListener('resize', onWindowResize);

        // Add mouse move event listener for interactivity
        document.addEventListener('mousemove', onMouseMove);

        // Initialize lastFrameTime before starting animation
        lastFrameTime = performance.now();

        // Start animation loop
        animate();

        console.log('Three.js scene setup complete');
    } catch (e) {
        console.error('Error setting up Three.js scene:', e);
        createLogoFallback();
    }
}

// Create the logo using the AI Unplugged image
function createLogo() {
    // We'll skip creating a 3D plane and just use the HTML image with CSS 3D effects
    // This avoids the green box appearing in front of the logo

    // Add the logo image using HTML
    addLogoImage();

    // Create an empty group for animation purposes
    logoMesh = new THREE.Group();
    scene.add(logoMesh);
}

// Add a glow effect to the logo
function addGlowEffect(mesh) {
    // Create a larger plane for the glow effect
    const glowGeometry = new THREE.PlaneGeometry(mesh.geometry.parameters.width * 1.1, mesh.geometry.parameters.height * 1.1);

    // Create a material with a glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });

    // Create the glow mesh
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -0.1; // Position slightly behind the logo
    mesh.add(glowMesh);

    // Animate the glow
    animateGlow(glowMesh);
}

// Animate the glow effect
function animateGlow(mesh) {
    // Create a timeline for the animation
    const timeline = {
        time: 0,
        duration: 3,
        update: function() {
            this.time += 0.01;
            if (this.time > this.duration) {
                this.time = 0;
            }

            const progress = this.time / this.duration;
            const scale = 1 + 0.05 * Math.sin(progress * Math.PI * 2);
            const opacity = 0.2 + 0.1 * Math.sin(progress * Math.PI * 2);

            mesh.scale.set(scale, scale, 1);
            mesh.material.opacity = opacity;
        }
    };

    // Add the timeline to the animation loop
    animationTimelines.push(timeline);
}

// Create enhanced particles around the logo
function createParticles() {
    // Create a particle system with more particles for better effect
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();

    // Create positions for particles
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Random position in a sphere with more variation
        const radius = 3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Enhanced green/blue/cyan color palette
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // Green
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.5; // More blue for cyan effect

        // Varied particle sizes
        sizes[i] = 0.03 + Math.random() * 0.05;

        // Different speeds for more organic movement
        speeds[i] = 0.5 + Math.random() * 1.5;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.userData = { speeds: speeds };

    // Create improved material with custom shader for better particles
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,  // Additive blending for glow effect
        sizeAttenuation: true              // Size based on distance
    });

    // Create a particle texture programmatically to avoid CORS issues
    try {
        // Create a canvas to generate a particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw a soft gradient circle
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(160, 255, 160, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        particleMaterial.map = texture;
        particleMaterial.needsUpdate = true;
    } catch (e) {
        console.log('Could not create particle texture:', e);
    }

    // Create particle system
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// Animation timelines
const animationTimelines = [];

// Animate particles with improved effects
function animateParticles() {
    // Create a timeline for the animation
    const timeline = {
        time: 0,
        duration: 10,
        update: function(delta) {
            // Use delta time for consistent animation speed regardless of frame rate
            const timeStep = delta || 0.016; // Default to 60fps if delta not provided
            this.time += timeStep;
            if (this.time > this.duration) {
                this.time = 0;
            }

            // Particle system rotation is now handled in updateParticles
        }
    };

    // Add the timeline to the animation loop
    animationTimelines.push(timeline);
}

// Update particle positions and properties each frame with improved error handling
function updateParticles(delta) {
    if (!particleSystem || !particleSystem.geometry) return;

    try {
        // Rotate the particle system
        particleSystem.rotation.y += 0.1 * delta;
        particleSystem.rotation.x += 0.05 * delta;

        // Get particle attributes
        const positions = particleSystem.geometry.attributes.position;
        const sizes = particleSystem.geometry.attributes.size;
        const speeds = particleSystem.geometry.userData?.speeds;

        // Safety check for attributes
        if (!positions || !positions.array) return;

        // Use a reasonable delta value if the provided one is extreme
        const safeDelta = isNaN(delta) || delta > 0.1 ? 0.016 : delta;

        // Update each particle
        for (let i = 0; i < positions.count; i++) {
            // Get current position
            const x = positions.array[i * 3];
            const y = positions.array[i * 3 + 1];
            const z = positions.array[i * 3 + 2];

            // Calculate distance from center
            const distance = Math.sqrt(x * x + y * y + z * z);

            // Move particles in a spiral pattern
            const speed = (speeds && speeds[i]) ? speeds[i] * safeDelta : 0.01 * safeDelta;
            const angle = speed * 0.2;

            // Rotate around y-axis
            const newX = x * Math.cos(angle) - z * Math.sin(angle);
            const newZ = x * Math.sin(angle) + z * Math.cos(angle);

            // Apply slight vertical oscillation
            const time = performance.now() * 0.001;
            const newY = y + Math.sin(distance + time) * 0.01;

            // Update position
            positions.array[i * 3] = newX;
            positions.array[i * 3 + 1] = newY;
            positions.array[i * 3 + 2] = newZ;

            // Pulse size
            if (sizes && sizes.array) {
                const baseSizeValue = 0.03 + (Math.sin(i) * 0.02); // More deterministic than random
                const pulseAmount = 0.02 * Math.sin(time + i);
                sizes.array[i] = baseSizeValue + pulseAmount;
            }
        }

        // Mark attributes as needing update
        positions.needsUpdate = true;
        if (sizes && sizes.array) sizes.needsUpdate = true;
    } catch (e) {
        console.warn('Error updating particles:', e);
    }
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('logo-container');
    if (!container) return;

    const canvas = document.getElementById('logo-canvas');
    if (!canvas) return;

    // Update camera
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position relative to the center of the screen
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -((event.clientY / window.innerHeight) * 2 - 1);
}

// Animation loop with performance optimizations
function animate(timestamp) {
    // Request next frame first to ensure smooth animation
    animationFrameId = requestAnimationFrame(animate);

    // Skip rendering if not visible to save resources
    if (!isVisible) return;

    // Check if renderer and scene are available
    if (!renderer || !scene || !camera) return;

    // Throttle to target FPS for performance
    if (!timestamp) timestamp = performance.now();
    const elapsed = timestamp - lastFrameTime;

    if (elapsed < fpsInterval) return;

    // Calculate delta time for smooth animations regardless of frame rate
    const delta = clock ? clock.getDelta() : 0.016;
    lastFrameTime = timestamp - (elapsed % fpsInterval);

    // Update all animation timelines with delta time for consistent speed
    try {
        animationTimelines.forEach(timeline => {
            if (timeline && typeof timeline.update === 'function') {
                timeline.update(delta);
            }
        });
    } catch (e) {
        console.warn('Error updating animation timelines:', e);
    }

    // Update particle effects if they exist
    if (particleSystem) {
        try {
            updateParticles(delta);
        } catch (e) {
            console.warn('Error updating particles:', e);
        }
    }

    // Render the scene
    try {
        renderer.render(scene, camera);
    } catch (e) {
        console.warn('Error rendering scene:', e);
    }
}

// Helper function to load scripts dynamically
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Add the logo image using HTML/CSS for better compatibility
function addLogoImage() {
    // Check if the 3D logo container exists
    const container = document.getElementById('logo-container');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create a div to hold the logo image with 3D perspective - improved for better rotation
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo-3d-container';
    logoDiv.style.position = 'absolute';
    logoDiv.style.top = '0';
    logoDiv.style.left = '0';
    logoDiv.style.width = '100%';
    logoDiv.style.height = '100%';
    logoDiv.style.display = 'flex';
    logoDiv.style.justifyContent = 'center';
    logoDiv.style.alignItems = 'center';
    logoDiv.style.perspective = '1200px'; // Increased perspective for better 3D effect
    logoDiv.style.perspectiveOrigin = 'center center';
    logoDiv.style.transformStyle = 'preserve-3d';
    logoDiv.style.backfaceVisibility = 'visible';
    logoDiv.style.webkitBackfaceVisibility = 'visible';

    // Create a wrapper for the 3D rotation with improved properties
    const rotateWrapper = document.createElement('div');
    rotateWrapper.className = 'logo-rotate-wrapper';
    rotateWrapper.style.transformStyle = 'preserve-3d';
    rotateWrapper.style.backfaceVisibility = 'visible';
    rotateWrapper.style.webkitBackfaceVisibility = 'visible';
    rotateWrapper.style.animation = 'logo-rotate 12s linear infinite'; // Slower rotation for better visibility
    rotateWrapper.style.width = '100%';
    rotateWrapper.style.height = '100%';
    rotateWrapper.style.display = 'flex';
    rotateWrapper.style.justifyContent = 'center';
    rotateWrapper.style.alignItems = 'center';
    rotateWrapper.style.transformOrigin = 'center center';

    // Create the logo image with enhanced effects and visibility fixes
    const logoImg = document.createElement('img');
    logoImg.src = 'images/ai-unplugged.png';
    logoImg.alt = 'AI Unplugged Logo';
    logoImg.className = 'logo-image';
    logoImg.style.width = '100%';
    logoImg.style.height = '100%';
    logoImg.style.objectFit = 'contain';
    logoImg.style.animation = 'logo-pulse 4s ease-in-out infinite, logo-glow 6s ease-in-out infinite';
    logoImg.style.filter = 'drop-shadow(0 0 15px rgba(0, 255, 0, 0.8))';
    logoImg.style.transition = 'transform 0.3s ease-out, filter 0.3s ease-out';
    logoImg.style.backfaceVisibility = 'visible';
    logoImg.style.webkitBackfaceVisibility = 'visible';
    logoImg.style.transformStyle = 'preserve-3d';
    logoImg.style.position = 'relative'; // For positioning the text overlay

    // Create a text overlay for better visibility of the name
    const textOverlay = document.createElement('div');
    textOverlay.className = 'logo-text-overlay';
    textOverlay.textContent = 'AI UNPLUGGED';
    textOverlay.style.position = 'absolute';
    textOverlay.style.bottom = '15%'; // Moved up from 10%
    textOverlay.style.left = '0';
    textOverlay.style.width = '100%';
    textOverlay.style.textAlign = 'center';
    textOverlay.style.color = '#00ff00';
    textOverlay.style.fontFamily = '"Orbitron", sans-serif';
    textOverlay.style.fontSize = 'clamp(1.5rem, 5vw, 3rem)'; // Increased from clamp(1rem, 4vw, 2rem)
    textOverlay.style.fontWeight = 'bold';
    textOverlay.style.textShadow = '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00';
    textOverlay.style.animation = 'text-glow 3s ease-in-out infinite';
    textOverlay.style.zIndex = '2';
    textOverlay.style.letterSpacing = '3px'; // Increased from 2px
    textOverlay.style.backfaceVisibility = 'visible';
    textOverlay.style.webkitBackfaceVisibility = 'visible';
    textOverlay.style.pointerEvents = 'none'; // Don't interfere with mouse events
    textOverlay.style.opacity = '1'; // Ensure full opacity

    // Preload the image to ensure it's ready before animation starts
    const preloadImg = new Image();
    preloadImg.src = 'images/ai-unplugged.png';

    // Add the logo image to the wrapper
    rotateWrapper.appendChild(logoImg);

    // Add the text overlay to the wrapper
    rotateWrapper.appendChild(textOverlay);

    // Add a small delay before starting rotation to ensure image is loaded
    setTimeout(() => {
        rotateWrapper.style.animation = 'logo-rotate 12s linear infinite';
    }, 500);

    // Add enhanced mouse interaction with smooth transitions
    let isHovering = false;
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let animationId = null;

    // Smooth animation function for rotation
    const smoothRotate = () => {
        // Ease towards target rotation
        rotationX += (targetRotationX - rotationX) * 0.1;
        rotationY += (targetRotationY - rotationY) * 0.1;

        // Apply rotation
        rotateWrapper.style.transform = `rotate3d(0, 1, 0.2, ${rotationY}deg)`;

        // Continue animation if still hovering
        if (isHovering) {
            animationId = requestAnimationFrame(smoothRotate);
        }
    };

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate target rotation with increased sensitivity
        targetRotationY = ((mouseX - centerX) / centerX) * 25;
        targetRotationX = ((centerY - mouseY) / centerY) * 25;

        // Start smooth animation if not already running
        if (!animationId && isHovering) {
            animationId = requestAnimationFrame(smoothRotate);
        }
    });

    container.addEventListener('mouseleave', () => {
        isHovering = false;

        // Cancel any ongoing smooth rotation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        // Reset to automatic rotation
        rotateWrapper.style.animation = 'logo-rotate 8s linear infinite';

        // Add a subtle scale effect when mouse leaves
        logoImg.style.transform = 'scale(1)';
    });

    container.addEventListener('mouseenter', () => {
        isHovering = true;
        rotateWrapper.style.animation = 'none';

        // Start smooth rotation
        if (!animationId) {
            animationId = requestAnimationFrame(smoothRotate);
        }

        // Add a subtle scale effect when mouse enters
        logoImg.style.transform = 'scale(1.05)';
    });

    // Add touch support for mobile devices
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            targetRotationY = ((touchX - centerX) / centerX) * 25;
            targetRotationX = ((centerY - touchY) / centerY) * 25;

            // Prevent scrolling when interacting with logo
            e.preventDefault();

            // Start smooth animation if not already running
            if (!animationId) {
                isHovering = true;
                rotateWrapper.style.animation = 'none';
                animationId = requestAnimationFrame(smoothRotate);
            }
        }
    });

    container.addEventListener('touchend', () => {
        isHovering = false;

        // Cancel any ongoing smooth rotation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        // Reset to automatic rotation
        rotateWrapper.style.animation = 'logo-rotate 8s linear infinite';
    });

    logoDiv.appendChild(rotateWrapper);
    container.appendChild(logoDiv);

    // Add enhanced CSS for the animations with backface visibility fix
    const style = document.createElement('style');
    style.textContent = `
        /* Fix for logo disappearing during rotation */
        .logo-3d-container, .logo-rotate-wrapper, .logo-image {
            backface-visibility: visible !important;
            -webkit-backface-visibility: visible !important;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
        }

        /* Improved rotation that prevents disappearing by using a different approach */
        @keyframes logo-rotate {
            0% { transform: rotate3d(0, 1, 0.2, 0deg); }
            25% { transform: rotate3d(0, 1, 0.2, 90deg); }
            50% { transform: rotate3d(0, 1, 0.2, 180deg); }
            75% { transform: rotate3d(0, 1, 0.2, 270deg); }
            100% { transform: rotate3d(0, 1, 0.2, 360deg); }
        }

        @keyframes logo-pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5)); }
            25% { transform: scale(1.03); filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.6)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.8)); }
            75% { transform: scale(1.03); filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.6)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5)); }
        }

        @keyframes logo-glow {
            0% { filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5)) brightness(1); }
            50% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.8)) brightness(1.2); }
            100% { filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5)) brightness(1); }
        }

        @keyframes text-glow {
            0% { opacity: 1; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00; }
            50% { opacity: 1; text-shadow: 0 0 15px #00ff00, 0 0 25px #00ff00, 0 0 35px #00ff00, 0 0 45px #00ff00, 0 0 55px #00ff00, 0 0 65px #00ff00; }
            100% { opacity: 1; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00; }
        }
    `;
    document.head.appendChild(style);
}

// Create a fallback if WebGL is not available
function createLogoFallback() {
    // Check if the 3D logo container exists
    const container = document.getElementById('logo-container');
    if (!container) return;

    // Check if the container is empty or only has the loading indicator
    if (container.querySelector('#logo-canvas')) return;

    // Clear the container
    container.innerHTML = '';

    // Create a fallback with the logo image
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-fallback-container';

    const logoImg = document.createElement('img');
    logoImg.src = 'images/ai-unplugged.png';
    logoImg.alt = 'AI Unplugged Logo';
    logoImg.className = 'logo-fallback-image';

    logoContainer.appendChild(logoImg);
    container.appendChild(logoContainer);

    // Add CSS for the rotation animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes logo-rotate {
            0% { transform: perspective(800px) rotateY(0deg); }
            100% { transform: perspective(800px) rotateY(360deg); }
        }

        .logo-fallback {
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded with improved visibility detection
document.addEventListener('DOMContentLoaded', function() {
    // Use Intersection Observer to only initialize when visible and pause when not visible
    const initObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                init3DLogo();
                initObserver.disconnect();

                // Set up visibility observer to pause animation when not visible
                setupVisibilityObserver();
            }
        });
    }, { threshold: 0.1 });

    const container = document.getElementById('logo-container');
    if (container) initObserver.observe(container);
});

// Set up visibility observer to pause animation when not visible
function setupVisibilityObserver() {
    const container = document.getElementById('logo-container');
    if (!container) return;

    // Create a new observer for ongoing visibility tracking
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Update visibility state
            isVisible = entry.isIntersecting;

            // If becoming visible again and animation was stopped, restart it
            if (isVisible && !animationFrameId) {
                animationFrameId = requestAnimationFrame(animate);
            }

            // Log visibility state for debugging
            console.log('Logo visibility:', isVisible);
        });
    }, { threshold: 0.1 });

    visibilityObserver.observe(container);

    // Also pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const isTabVisible = document.visibilityState === 'visible';
        isVisible = isTabVisible && isVisible;

        // If tab becomes visible again and animation was stopped, restart it
        if (isTabVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
        }
    });
}

// Check if WebGL is available after a timeout, but don't create fallback if we already have a working logo
setTimeout(() => {
    const canvas = document.getElementById('logo-canvas');
    const logoContainer = document.getElementById('logo-container');

    // Only create fallback if the canvas is missing AND there's no logo image already
    if ((!canvas || !canvas.getContext('webgl')) &&
        (!logoContainer || !logoContainer.querySelector('.logo-image'))) {
        console.warn('WebGL not available or 3D logo failed to load, using fallback');
        createLogoFallback();
    }
}, 5000); // Wait 5 seconds before checking to give more time for initialization

// Cleanup function to prevent memory leaks
function cleanup3DLogo() {
    // Cancel animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Dispose of Three.js resources
    if (scene) {
        // Dispose of all geometries and materials
        scene.traverse(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => disposeMaterial(material));
                } else {
                    disposeMaterial(object.material);
                }
            }
        });

        // Clear the scene
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    // Dispose of renderer
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement = null;
    }

    // Clear references
    scene = null;
    camera = null;
    renderer = null;
    logoMesh = null;
    particleSystem = null;

    // Reset state
    isInitialized = false;

    console.log('3D logo resources cleaned up');
}

// Helper function to dispose of materials
function disposeMaterial(material) {
    if (!material) return;

    // Dispose of material properties
    Object.keys(material).forEach(property => {
        if (material[property] && typeof material[property].dispose === 'function') {
            material[property].dispose();
        }
    });

    // Dispose of the material itself
    material.dispose();
}

// Add event listener for page unload to clean up resources
window.addEventListener('beforeunload', cleanup3DLogo);
