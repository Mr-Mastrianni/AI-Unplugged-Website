// Fallback for 3D logo if Three.js fails to load
function createLogoFallback() {
    // Check if the 3D logo container exists
    const container = document.getElementById('logo-container');
    if (!container) return;
    
    // Check if the container is empty or only has the loading indicator
    if (container.querySelector('#logo-canvas')) return;
    
    // Clear the container
    container.innerHTML = '';
    
    // Create a fallback SVG logo with animation
    const svgContainer = document.createElement('div');
    svgContainer.className = 'svg-logo-container';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.display = 'flex';
    svgContainer.style.justifyContent = 'center';
    svgContainer.style.alignItems = 'center';
    
    // Create the SVG logo with animation
    svgContainer.innerHTML = `
        <svg width="280" height="280" viewBox="0 0 48 48" class="animated-logo" style="filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.7));">
            <!-- Circuit board background -->
            <rect width="48" height="48" rx="8" fill="#0a0a12" class="logo-base">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </rect>
            
            <!-- Circuit lines -->
            <g class="circuit-lines">
                <path d="M8 12H40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M8 24H40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M8 36H40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M12 8V40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M24 8V40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M36 8V40" stroke="#00ff00" stroke-width="0.5" stroke-dasharray="2 2">
                    <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                </path>
            </g>
            
            <!-- Connection nodes -->
            <g class="nodes">
                <circle cx="12" cy="12" r="2" fill="#00ffff" opacity="0.8">
                    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="24" cy="24" r="2" fill="#00ffff" opacity="0.8">
                    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="0.4s" />
                </circle>
                <circle cx="36" cy="36" r="2" fill="#00ffff" opacity="0.8">
                    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="0.8s" />
                </circle>
                <circle cx="12" cy="36" r="2" fill="#00ffff" opacity="0.8">
                    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" begin="1.2s" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1.2s" />
                </circle>
                <circle cx="36" cy="12" r="2" fill="#00ffff" opacity="0.8">
                    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" begin="1.6s" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1.6s" />
                </circle>
            </g>
            
            <!-- AI letters -->
            <g class="letters">
                <path d="M14 18L18 30H22L26 18H22L20 26L18 18H14Z" fill="#00ff00" class="primary">
                    <animate attributeName="fill" values="#00ff00;#00ffff;#00ff00" dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M28 18V22H32V26H28V30H36V18H28Z" fill="#00ff00" class="primary">
                    <animate attributeName="fill" values="#00ff00;#00ffff;#00ff00" dur="3s" repeatCount="indefinite" begin="1s" />
                </path>
            </g>
            
            <!-- Glow effect -->
            <rect width="48" height="48" rx="8" fill="url(#paint0_radial)" fill-opacity="0.3">
                <animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
            </rect>
            
            <!-- Gradient definitions -->
            <defs>
                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) rotate(90) scale(24)">
                    <stop stop-color="#00ff00"/>
                    <stop offset="1" stop-color="#00ff00" stop-opacity="0"/>
                </radialGradient>
            </defs>
        </svg>
    `;
    
    // Add the SVG container to the main container
    container.appendChild(svgContainer);
    
    // Add rotation animation
    const logo = svgContainer.querySelector('.animated-logo');
    if (logo) {
        logo.style.animation = 'rotate3d 15s linear infinite';
    }
}

// Check if the 3D logo has loaded after a timeout
setTimeout(() => {
    const canvas = document.getElementById('logo-canvas');
    if (!canvas || !canvas.getContext('webgl')) {
        console.warn('WebGL not available or 3D logo failed to load, using fallback');
        createLogoFallback();
    }
}, 3000); // Wait 3 seconds before checking

// Add the fallback to the window object
window.createLogoFallback = createLogoFallback;
