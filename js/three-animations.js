// Neural Network Visualization with Three.js
let scene, camera, renderer, network;
let nodes = [], connections = [];
let raycaster, mouse, intersectedObject;
let animationFrameId;

// Configuration params
const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 3;
const PARTICLE_COUNT = 150;
const particles = [];

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add to DOM - we'll target a specific container
    const container = document.getElementById('three-container');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        // If container doesn't exist yet, we'll create one
        const newContainer = document.createElement('div');
        newContainer.id = 'three-container';
        newContainer.style.position = 'absolute';
        newContainer.style.top = '0';
        newContainer.style.left = '0';
        newContainer.style.width = '100%';
        newContainer.style.height = '100%';
        newContainer.style.zIndex = '-1';
        newContainer.style.overflow = 'hidden';
        document.querySelector('#roi-calculator').prepend(newContainer);
        newContainer.appendChild(renderer.domElement);
    }
    
    // Create network container
    network = new THREE.Group();
    scene.add(network);
    
    // Setup raycaster for interactivity
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Create controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x4285f4, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Build the network
    createNetwork();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add event listeners for interactivity
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Start animation loop
    animate();
    
    // Gradually fade in the container
    fadeInAnimation();
}

function createNetwork() {
    // Create neural network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x4285f4,
        emissive: 0x0d47a1,
        specular: 0xffffff,
        shininess: 50
    });
    
    // Create nodes at random positions
    for (let i = 0; i < NODE_COUNT; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        
        // Position in 3D space - constraint to a spherical area
        const radius = 6 * Math.random() + 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        node.position.x = radius * Math.sin(phi) * Math.cos(theta);
        node.position.y = radius * Math.sin(phi) * Math.sin(theta);
        node.position.z = radius * Math.cos(phi);
        
        // Store original position
        node.userData.originalPosition = node.position.clone();
        
        // Store original color for hover effects
        node.userData.originalColor = node.material.color.clone();
        
        // Add to nodes array and scene
        nodes.push(node);
        network.add(node);
    }
    
    // Create connections between nearby nodes
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x34a853,
        transparent: true,
        opacity: 0.4
    });
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            
            if (distance < CONNECTION_DISTANCE) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                
                const connection = new THREE.Line(geometry, connectionMaterial.clone());
                connection.userData.startNode = i;
                connection.userData.endNode = j;
                connections.push(connection);
                network.add(connection);
            }
        }
    }
    
    // Add flowing particles
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x34a853,
        transparent: true,
        opacity: 0.8
    });
    
    // Only add particles to connections that exist
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (connections.length === 0) break;
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Choose a random connection
        const connectionIndex = Math.floor(Math.random() * connections.length);
        const connection = connections[connectionIndex];
        
        // Position particle randomly along the connection
        const startNode = nodes[connection.userData.startNode];
        const endNode = nodes[connection.userData.endNode];
        
        const t = Math.random();
        particle.position.copy(startNode.position).lerp(endNode.position, t);
        
        // Store data for animation
        particle.userData.startNode = connection.userData.startNode;
        particle.userData.endNode = connection.userData.endNode;
        particle.userData.t = t;
        particle.userData.speed = 0.005 + Math.random() * 0.01;
        particle.userData.direction = Math.random() > 0.5 ? 1 : -1;
        
        particles.push(particle);
        network.add(particle);
    }
}

function updateNetwork() {
    // Gently animate node positions
    nodes.forEach((node, index) => {
        const time = Date.now() * 0.001;
        const originalPos = node.userData.originalPosition;
        
        // Small oscillation around original position
        node.position.x = originalPos.x + Math.sin(time * 0.5 + index) * 0.2;
        node.position.y = originalPos.y + Math.cos(time * 0.6 + index) * 0.2;
        node.position.z = originalPos.z + Math.sin(time * 0.7 + index) * 0.2;
    });
    
    // Update connection positions to match nodes
    connections.forEach(connection => {
        const startNode = nodes[connection.userData.startNode];
        const endNode = nodes[connection.userData.endNode];
        
        const points = [startNode.position, endNode.position];
        connection.geometry.setFromPoints(points);
    });
    
    // Animate particles along connections
    particles.forEach(particle => {
        const startNode = nodes[particle.userData.startNode];
        const endNode = nodes[particle.userData.endNode];
        
        // Update position along the path
        particle.userData.t += particle.userData.speed * particle.userData.direction;
        
        // If particle reaches end, reset to start
        if (particle.userData.t >= 1) {
            particle.userData.t = 0;
        }
        // If particle reaches start going backwards, reset to end
        else if (particle.userData.t <= 0) {
            particle.userData.t = 1;
        }
        
        // Position the particle along the connection
        particle.position.copy(startNode.position).lerp(endNode.position, particle.userData.t);
    });
}

function pulseNetwork() {
    // Make a wave of activity through the network
    nodes.forEach((node, index) => {
        setTimeout(() => {
            // Pulse animation for each node
            gsap.to(node.material, {
                emissiveIntensity: 2,
                duration: 0.5,
                onComplete: () => {
                    gsap.to(node.material, {
                        emissiveIntensity: 0.5,
                        duration: 0.5
                    });
                }
            });
            
            // Scale animation
            gsap.to(node.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.5,
                onComplete: () => {
                    gsap.to(node.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.5
                    });
                }
            });
        }, index * 50); // Stagger the effect
    });
}

function highlightConnections(nodeIndex) {
    // Reset all connections
    connections.forEach(connection => {
        connection.material.opacity = 0.2;
        connection.material.color.set(0x34a853);
    });
    
    // Highlight connections from this node
    connections.forEach(connection => {
        if (connection.userData.startNode === nodeIndex || connection.userData.endNode === nodeIndex) {
            connection.material.opacity = 0.8;
            connection.material.color.set(0x4285f4);
        }
    });
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes);
    
    // Reset previously hovered node
    if (intersectedObject && (!intersects.length || intersectedObject !== intersects[0].object)) {
        intersectedObject.material.emissive.set(0x0d47a1);
        intersectedObject.material.color.copy(intersectedObject.userData.originalColor);
        intersectedObject = null;
    }
    
    // Set new hovered node
    if (intersects.length > 0) {
        intersectedObject = intersects[0].object;
        intersectedObject.material.emissive.set(0x64b5f6);
        intersectedObject.material.color.set(0x64b5f6);
        
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
}

function onMouseClick(event) {
    // Check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes);
    
    if (intersects.length > 0) {
        const nodeIndex = nodes.indexOf(intersects[0].object);
        highlightConnections(nodeIndex);
        pulseNetwork();
    }
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update network animation
    updateNetwork();
    
    // Render scene
    renderer.render(scene, camera);
}

function fadeInAnimation() {
    const container = document.getElementById('three-container');
    container.style.opacity = 0;
    
    gsap.to(container, {
        opacity: 1,
        duration: 2,
        delay: 0.5
    });
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js when the ROI calculator is shown
function initWithCalculator() {
    // Check if the user is on the calculator page
    if (document.getElementById('roi-calculator')) {
        // Load dependencies
        if (typeof THREE === 'undefined') {
            loadScripts([
                'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js'
            ], initThreeJS);
        } else {
            initThreeJS();
        }
    }
}

// Function to dynamically load scripts
function loadScripts(urls, callback) {
    let loadedCount = 0;
    
    urls.forEach(url => {
        const script = document.createElement('script');
        script.onload = function() {
            loadedCount++;
            if (loadedCount === urls.length) {
                callback();
            }
        };
        script.src = url;
        document.head.appendChild(script);
    });
}

// Trigger effects when sliders change
function setupCalculatorInteraction() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            // Random node to highlight on slider change
            const randomNodeIndex = Math.floor(Math.random() * nodes.length);
            highlightConnections(randomNodeIndex);
        });
        
        slider.addEventListener('change', () => {
            pulseNetwork();
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWithCalculator();
    
    // Setup calculator interactions once the network is ready
    setTimeout(setupCalculatorInteraction, 1000);
    
    // Visual effect when form is submitted or calculation is updated
    const calculatorNavItems = document.querySelectorAll('.calculator-nav-item');
    calculatorNavItems.forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(pulseNetwork, 300);
        });
    });
}); 