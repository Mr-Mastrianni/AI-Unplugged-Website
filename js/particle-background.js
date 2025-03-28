// Particle Animation Background
let particleScene, particleCamera, particleRenderer;
let particleSystem, particleAnimationId;

function initParticleSystem() {
    // Create container if it doesn't exist
    let container = document.getElementById('particle-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'particle-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '0';
        container.style.pointerEvents = 'none';
        
        const guaranteeSection = document.querySelector('#roi-guarantee');
        if (guaranteeSection) {
            guaranteeSection.style.position = 'relative';
            guaranteeSection.style.overflow = 'hidden';
            guaranteeSection.prepend(container);
        } else {
            return; // Don't initialize if section doesn't exist
        }
    }
    
    // Setup scene
    particleScene = new THREE.Scene();
    
    // Setup camera
    particleCamera = new THREE.PerspectiveCamera(
        75, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    particleCamera.position.z = 30;
    
    // Setup renderer with transparency
    particleRenderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    particleRenderer.setSize(container.clientWidth, container.clientHeight);
    particleRenderer.setClearColor(0x000000, 0);
    container.appendChild(particleRenderer.domElement);
    
    // Create particle system
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', onParticleResize);
    
    // Start animation loop
    animateParticles();
    
    // Add interaction to particles
    container.style.pointerEvents = 'auto';
    container.addEventListener('mousemove', onParticleMouseMove);
    container.addEventListener('touchmove', onParticleTouchMove);
    
    // Scroll effect - adjust camera as the user scrolls
    window.addEventListener('scroll', onScroll);
}

function createParticles() {
    // Number of particles
    const particleCount = 200;
    
    // Create geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Color palette (Google Material colors)
    const palette = [
        new THREE.Color(0x4285f4), // Blue
        new THREE.Color(0x34a853), // Green
        new THREE.Color(0xfbbc05), // Yellow
        new THREE.Color(0xea4335)  // Red
    ];
    
    for (let i = 0; i < particleCount; i++) {
        // Position particles in a sphere
        const radius = 20 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
        
        // Randomly select color from palette
        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Random sizes
        sizes[i] = 0.5 + Math.random() * 1.5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create shader material
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png') }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                
                // Gentle oscillation
                vec3 pos = position;
                pos.x += sin(pos.y * 0.02 + time) * 2.0;
                pos.y += cos(pos.x * 0.02 + time) * 2.0;
                pos.z += sin(pos.z * 0.02 + time) * 2.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                
                // Add glow effect
                if (gl_FragColor.a < 0.3) discard;
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    
    // Create the particle system
    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    particleScene.add(particleSystem);
    
    // Add a blue point light at the center to enhance glow
    const pointLight = new THREE.PointLight(0x4285f4, 0.8, 50);
    pointLight.position.set(0, 0, 0);
    particleScene.add(pointLight);
}

function animateParticles() {
    particleAnimationId = requestAnimationFrame(animateParticles);
    
    // Update uniforms for shader animation
    particleSystem.material.uniforms.time.value += 0.01;
    
    // Gentle rotation of the whole system
    particleSystem.rotation.y += 0.002;
    particleSystem.rotation.x += 0.001;
    
    // Render
    particleRenderer.render(particleScene, particleCamera);
}

function onParticleResize() {
    const container = document.getElementById('particle-container');
    if (!container || !particleCamera || !particleRenderer) return;
    
    particleCamera.aspect = container.clientWidth / container.clientHeight;
    particleCamera.updateProjectionMatrix();
    particleRenderer.setSize(container.clientWidth, container.clientHeight);
}

function onParticleMouseMove(event) {
    if (!particleSystem) return;
    
    // Convert mouse position to normalized device coordinates
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Move particles based on mouse position
    gsap.to(particleSystem.rotation, {
        x: y * 0.2,
        y: x * 0.2,
        duration: 2,
        ease: "power2.out"
    });
}

function onParticleTouchMove(event) {
    if (!particleSystem || !event.touches[0]) return;
    
    // Convert touch position to normalized device coordinates
    const rect = event.target.getBoundingClientRect();
    const x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    
    // Move particles based on touch position
    gsap.to(particleSystem.rotation, {
        x: y * 0.2,
        y: x * 0.2,
        duration: 2,
        ease: "power2.out"
    });
}

function onScroll() {
    const guaranteeSection = document.querySelector('#roi-guarantee');
    if (!guaranteeSection || !particleCamera) return;
    
    const rect = guaranteeSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        // Calculate how far through the section we've scrolled
        const percentScrolled = 1 - (rect.bottom / (window.innerHeight + rect.height));
        
        // Move camera based on scroll position
        gsap.to(particleCamera.position, {
            z: 30 - percentScrolled * 5,
            duration: 0.5
        });
    }
}

function stopParticleAnimation() {
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the Three.js is loaded
    if (typeof THREE === 'undefined') {
        const scripts = document.querySelectorAll('script');
        let threeJsLoaded = false;
        
        scripts.forEach(script => {
            if (script.src.includes('three.min.js') || script.src.includes('three.js')) {
                threeJsLoaded = true;
            }
        });
        
        if (!threeJsLoaded) {
            loadScripts([
                'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js'
            ], initParticleSystem);
        } else {
            initParticleSystem();
        }
    } else {
        initParticleSystem();
    }
});

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