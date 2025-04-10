// 3D Logo Animation for AI Unplugged
// This script creates an animated 3D version of the AI Unplugged logo

// Global variables
let scene, camera, renderer, logoGroup;
let animationFrameId;
let isInitialized = false;
let mouseX = 0;
let mouseY = 0;

// Initialize the 3D logo animation
function init3DLogo() {
    // Check if already initialized
    if (isInitialized) return;
    isInitialized = true;

    // Get the container
    const container = document.getElementById('logo-container');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'logo-canvas';
    container.appendChild(canvas);

    // Add loading indicator
    const loading = document.createElement('div');
    loading.className = 'logo-loading';
    loading.innerHTML = '<div class="spinner"></div><p>Initializing AI Logo...</p>';
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

// Set up the Three.js scene
function setupScene(canvas, loadingElement) {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x00ff00, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 2, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Create logo group
    logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Create the logo
    createLogo();

    // Add circuit board background
    createCircuitBoard();

    // Add particles
    createParticles();

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

    // Start animation loop
    animate();
}

// Create the 3D logo
function createLogo() {
    // Create base plate (circuit board)
    const baseGeometry = new THREE.BoxGeometry(3, 3, 0.2);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a12,
        emissive: 0x0a0a12,
        specular: 0x111111,
        shininess: 30
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    logoGroup.add(base);

    // Add circuit lines
    const lineCount = 6;
    const lineSpacing = 2.8 / (lineCount - 1);
    const lineStart = -1.4;

    for (let i = 0; i < lineCount; i++) {
        // Horizontal lines
        const hLineGeometry = new THREE.BoxGeometry(2.8, 0.03, 0.01);
        const hLineMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const hLine = new THREE.Mesh(hLineGeometry, hLineMaterial);
        hLine.position.set(0, lineStart + i * lineSpacing, 0.11);
        base.add(hLine);

        // Animate the line
        animateLine(hLine, i * 0.2);

        // Vertical lines
        const vLineGeometry = new THREE.BoxGeometry(0.03, 2.8, 0.01);
        const vLineMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const vLine = new THREE.Mesh(vLineGeometry, vLineMaterial);
        vLine.position.set(lineStart + i * lineSpacing, 0, 0.11);
        base.add(vLine);

        // Animate the line
        animateLine(vLine, i * 0.2 + 0.1);
    }

    // Add connection nodes
    const nodePositions = [
        [-1, -1, 0.11],
        [0, 0, 0.11],
        [1, 1, 0.11],
        [-1, 1, 0.11],
        [1, -1, 0.11]
    ];

    nodePositions.forEach((pos, index) => {
        const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(pos[0], pos[1], pos[2]);
        base.add(node);

        // Animate the node
        animateNode(node, index * 0.2);
    });

    // Add AI letters
    createAILetters();
}

// Create the AI letters
function createAILetters() {
    // Create "A" letter
    const aGeometry = new THREE.ExtrudeGeometry(
        createAShape(),
        { depth: 0.2, bevelEnabled: false }
    );
    const aMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    const aLetter = new THREE.Mesh(aGeometry, aMaterial);
    aLetter.position.set(-0.8, -0.5, 0.11);
    aLetter.scale.set(0.2, 0.2, 0.2);
    logoGroup.add(aLetter);

    // Create "I" letter
    const iGeometry = new THREE.ExtrudeGeometry(
        createIShape(),
        { depth: 0.2, bevelEnabled: false }
    );
    const iMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    const iLetter = new THREE.Mesh(iGeometry, iMaterial);
    iLetter.position.set(0.2, -0.5, 0.11);
    iLetter.scale.set(0.2, 0.2, 0.2);
    logoGroup.add(iLetter);

    // Animate letters
    animateLetter(aLetter, 0);
    animateLetter(iLetter, 0.3);
}

// Create circuit board background
function createCircuitBoard() {
    // Add circuit paths
    for (let i = 0; i < 20; i++) {
        const pathGeometry = new THREE.TubeGeometry(
            createRandomCurve(),
            20,
            0.02,
            8,
            false
        );
        const pathMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.5
        });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.position.z = -0.5;
        logoGroup.add(path);

        // Animate the path
        animatePath(path, i * 0.1);
    }
}

// Create particles
function createParticles() {
    // Create particle geometry
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 10;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    // Create particle system
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animate particles
    animateParticles(particles);
}

// Helper function to create the "A" shape
function createAShape() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(4, 0);
    shape.lineTo(6, 6);
    shape.lineTo(4, 6);
    shape.lineTo(3, 4);
    shape.lineTo(1, 4);
    shape.lineTo(0, 6);
    shape.lineTo(-2, 6);
    shape.lineTo(0, 0);

    // Create hole for the middle of the A
    const hole = new THREE.Path();
    hole.moveTo(2, 2);
    hole.lineTo(3, 2);
    hole.lineTo(2.5, 3);
    hole.lineTo(1.5, 3);
    hole.lineTo(2, 2);

    shape.holes.push(hole);

    return shape;
}

// Helper function to create the "I" shape
function createIShape() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(4, 0);
    shape.lineTo(4, 1);
    shape.lineTo(3, 1);
    shape.lineTo(3, 5);
    shape.lineTo(4, 5);
    shape.lineTo(4, 6);
    shape.lineTo(0, 6);
    shape.lineTo(0, 5);
    shape.lineTo(1, 5);
    shape.lineTo(1, 1);
    shape.lineTo(0, 1);
    shape.lineTo(0, 0);

    return shape;
}

// Helper function to create random curves for circuit paths
function createRandomCurve() {
    const points = [];
    const segmentCount = 3 + Math.floor(Math.random() * 3);

    // Start point
    const startX = (Math.random() - 0.5) * 5;
    const startY = (Math.random() - 0.5) * 5;
    points.push(new THREE.Vector3(startX, startY, 0));

    // Create random segments
    let currentX = startX;
    let currentY = startY;

    for (let i = 0; i < segmentCount; i++) {
        // Random direction (horizontal or vertical)
        const isHorizontal = Math.random() > 0.5;

        if (isHorizontal) {
            currentX += (Math.random() - 0.5) * 4;
        } else {
            currentY += (Math.random() - 0.5) * 4;
        }

        points.push(new THREE.Vector3(currentX, currentY, 0));
    }

    return new THREE.CatmullRomCurve3(points);
}

// Animation functions
function animateLine(line, delay) {
    // Pulse animation
    setInterval(() => {
        line.material.emissiveIntensity = 0.2 + Math.random() * 0.5;
        line.material.opacity = 0.5 + Math.random() * 0.3;
    }, 1000 + delay * 1000);
}

function animateNode(node, delay) {
    // Pulse animation
    setInterval(() => {
        node.material.emissiveIntensity = 0.3 + Math.random() * 0.7;
        node.scale.set(
            0.9 + Math.random() * 0.2,
            0.9 + Math.random() * 0.2,
            0.9 + Math.random() * 0.2
        );
    }, 1500 + delay * 1000);
}

function animateLetter(letter, delay) {
    // Pulse animation
    setTimeout(() => {
        setInterval(() => {
            letter.material.emissiveIntensity = 0.3 + Math.random() * 0.7;
        }, 1000);
    }, delay * 1000);
}

function animatePath(path, delay) {
    // Fade in and out
    setTimeout(() => {
        setInterval(() => {
            path.material.opacity = 0.2 + Math.random() * 0.4;
        }, 2000);
    }, delay * 1000);
}

function animateParticles(particles) {
    // Continuous animation in the animation loop
    particles.userData = {
        rotationSpeed: 0.001,
        originalPositions: particles.geometry.attributes.position.array.slice()
    };
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Rotate logo group
    if (logoGroup) {
        // Always apply a basic rotation
        logoGroup.rotation.y += 0.005;
        logoGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

        // Add mouse interaction if OrbitControls is not available
        if (typeof THREE.OrbitControls === 'undefined' && mouseX !== undefined && mouseY !== undefined) {
            logoGroup.rotation.y += mouseX * 0.001;
            logoGroup.rotation.x += mouseY * 0.001;
        }
    }

    // Animate particles
    const particles = scene.children.find(child => child instanceof THREE.Points);
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const originalPositions = particles.userData.originalPositions;

        for (let i = 0; i < positions.length; i += 3) {
            const time = Date.now() * 0.001;
            const ix = i / 3;

            positions[i] = originalPositions[i] + Math.sin(time + ix) * 0.1;
            positions[i + 1] = originalPositions[i + 1] + Math.cos(time + ix) * 0.1;
            positions[i + 2] = originalPositions[i + 2] + Math.sin(time + ix) * 0.1;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.001;
    }

    // Render scene
    if (renderer) renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    if (!camera || !renderer) return;

    const container = document.getElementById('logo-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// Handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const container = document.getElementById('logo-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Check if mouse is over our container
    if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    ) {
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

// Clean up resources
function cleanup3DLogo() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Remove event listeners
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onMouseMove);

    // Dispose of Three.js resources
    if (scene) {
        scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    // Clear references
    scene = null;
    camera = null;
    renderer = null;
    logoGroup = null;
    isInitialized = false;
}

// Helper function to load scripts dynamically
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Use Intersection Observer to only initialize when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                init3DLogo();
                observer.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const container = document.getElementById('logo-container');
    if (container) observer.observe(container);
});

// Export functions for external use
window.init3DLogo = init3DLogo;
window.cleanup3DLogo = cleanup3DLogo;
