let scene,camera,renderer,logoMesh;let animationFrameId;let isInitialized=false;let mouseX=0;let mouseY=0;let lastFrameTime=0;let fps=60;let fpsInterval=1000/fps;let isVisible=true;let particleSystem;let clock=typeof THREE!=='undefined'?new THREE.Clock():null;function init3DLogo(){if(isInitialized)return;isInitialized=true;const container=document.getElementById('logo-container');if(!container)return;const fallbackLogo=container.querySelector('.logo-fallback-container');container.innerHTML='';if(fallbackLogo){container.appendChild(fallbackLogo);}
const canvas=document.createElement('canvas');canvas.id='logo-canvas';container.appendChild(canvas);const loading=document.createElement('div');loading.className='logo-loading';loading.innerHTML='<div class="spinner"></div><p>Loading AI Unplugged Logo...</p>';container.appendChild(loading);setTimeout(()=>{initThreeJS(canvas,loading);},100);}
function initThreeJS(canvas,loadingElement){if(typeof THREE==='undefined'){loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',()=>{loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js',()=>{setupScene(canvas,loadingElement);});});}else{if(typeof THREE.OrbitControls==='undefined'){loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js',()=>{setupScene(canvas,loadingElement);});}else{setupScene(canvas,loadingElement);}}}
function setupScene(canvas,loadingElement){try{clock=new THREE.Clock();scene=new THREE.Scene();const aspectRatio=canvas.clientWidth/canvas.clientHeight||1;camera=new THREE.PerspectiveCamera(75,aspectRatio,0.1,1000);camera.position.z=14;try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setSize(canvas.clientWidth,canvas.clientHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0x000000,0);}catch(e){console.error('Failed to create WebGL renderer:',e);createLogoFallback();return;}
const ambientLight=new THREE.AmbientLight(0xffffff,0.5);scene.add(ambientLight);const directionalLight=new THREE.DirectionalLight(0xffffff,1);directionalLight.position.set(5,5,5);scene.add(directionalLight);const greenLight=new THREE.PointLight(0x00ff00,1,10);greenLight.position.set(2,2,2);scene.add(greenLight);const blueLight=new THREE.PointLight(0x0088ff,1,10);blueLight.position.set(-2,-2,2);scene.add(blueLight);createLogo();createParticles();animateParticles();let controls;try{controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=0.05;controls.enableZoom=false;controls.autoRotate=true;controls.autoRotateSpeed=1;}catch(error){console.warn('OrbitControls not available, using basic rotation');}
if(loadingElement){loadingElement.style.opacity=0;setTimeout(()=>{loadingElement.remove();},1000);}
window.addEventListener('resize',onWindowResize);document.addEventListener('mousemove',onMouseMove);lastFrameTime=performance.now();animate();console.log('Three.js scene setup complete');}catch(e){console.error('Error setting up Three.js scene:',e);createLogoFallback();}}
function createLogo(){addLogoImage();logoMesh=new THREE.Group();scene.add(logoMesh);}
function addGlowEffect(mesh){const glowGeometry=new THREE.PlaneGeometry(mesh.geometry.parameters.width*1.1,mesh.geometry.parameters.height*1.1);const glowMaterial=new THREE.MeshBasicMaterial({color:0x00ff00,transparent:true,opacity:0.2,side:THREE.DoubleSide});const glowMesh=new THREE.Mesh(glowGeometry,glowMaterial);glowMesh.position.z=-0.1;mesh.add(glowMesh);animateGlow(glowMesh);}
function animateGlow(mesh){const timeline={time:0,duration:3,update:function(){this.time+=0.01;if(this.time>this.duration){this.time=0;}
const progress=this.time/this.duration;const scale=1+0.05*Math.sin(progress*Math.PI*2);const opacity=0.2+0.1*Math.sin(progress*Math.PI*2);mesh.scale.set(scale,scale,1);mesh.material.opacity=opacity;}};animationTimelines.push(timeline);}
function createParticles(){const particleCount=200;const particles=new THREE.BufferGeometry();const positions=new Float32Array(particleCount*3);const colors=new Float32Array(particleCount*3);const sizes=new Float32Array(particleCount);const speeds=new Float32Array(particleCount);for(let i=0;i<particleCount;i++){const radius=3+Math.random()*3;const theta=Math.random()*Math.PI*2;const phi=Math.random()*Math.PI;positions[i*3]=radius*Math.sin(phi)*Math.cos(theta);positions[i*3+1]=radius*Math.sin(phi)*Math.sin(theta);positions[i*3+2]=radius*Math.cos(phi);colors[i*3]=0;colors[i*3+1]=0.5+Math.random()*0.5;colors[i*3+2]=0.2+Math.random()*0.5;sizes[i]=0.03+Math.random()*0.05;speeds[i]=0.5+Math.random()*1.5;}
particles.setAttribute('position',new THREE.BufferAttribute(positions,3));particles.setAttribute('color',new THREE.BufferAttribute(colors,3));particles.setAttribute('size',new THREE.BufferAttribute(sizes,1));particles.userData={speeds:speeds};const particleMaterial=new THREE.PointsMaterial({size:0.05,vertexColors:true,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,sizeAttenuation:true});try{const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const ctx=canvas.getContext('2d');const gradient=ctx.createRadialGradient(canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width/2);gradient.addColorStop(0,'rgba(255, 255, 255, 1)');gradient.addColorStop(0.5,'rgba(160, 255, 160, 0.5)');gradient.addColorStop(1,'rgba(0, 255, 0, 0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,canvas.width,canvas.height);const texture=new THREE.CanvasTexture(canvas);particleMaterial.map=texture;particleMaterial.needsUpdate=true;}catch(e){console.log('Could not create particle texture:',e);}
particleSystem=new THREE.Points(particles,particleMaterial);scene.add(particleSystem);}
const animationTimelines=[];function animateParticles(){const timeline={time:0,duration:10,update:function(delta){const timeStep=delta||0.016;this.time+=timeStep;if(this.time>this.duration){this.time=0;}
}};animationTimelines.push(timeline);}
function updateParticles(delta){if(!particleSystem||!particleSystem.geometry)return;try{particleSystem.rotation.y+=0.1*delta;particleSystem.rotation.x+=0.05*delta;const positions=particleSystem.geometry.attributes.position;const sizes=particleSystem.geometry.attributes.size;const speeds=particleSystem.geometry.userData?.speeds;if(!positions||!positions.array)return;const safeDelta=isNaN(delta)||delta>0.1?0.016:delta;for(let i=0;i<positions.count;i++){const x=positions.array[i*3];const y=positions.array[i*3+1];const z=positions.array[i*3+2];const distance=Math.sqrt(x*x+y*y+z*z);const speed=(speeds&&speeds[i])?speeds[i]*safeDelta:0.01*safeDelta;const angle=speed*0.2;const newX=x*Math.cos(angle)-z*Math.sin(angle);const newZ=x*Math.sin(angle)+z*Math.cos(angle);const time=performance.now()*0.001;const newY=y+Math.sin(distance+time)*0.01;positions.array[i*3]=newX;positions.array[i*3+1]=newY;positions.array[i*3+2]=newZ;if(sizes&&sizes.array){const baseSizeValue=0.03+(Math.sin(i)*0.02);const pulseAmount=0.02*Math.sin(time+i);sizes.array[i]=baseSizeValue+pulseAmount;}}
positions.needsUpdate=true;if(sizes&&sizes.array)sizes.needsUpdate=true;}catch(e){console.warn('Error updating particles:',e);}}
function onWindowResize(){const container=document.getElementById('logo-container');if(!container)return;const canvas=document.getElementById('logo-canvas');if(!canvas)return;camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight);}
function onMouseMove(event){mouseX=(event.clientX/window.innerWidth)*2-1;mouseY=-((event.clientY/window.innerHeight)*2-1);}
function animate(timestamp){animationFrameId=requestAnimationFrame(animate);if(!isVisible)return;if(!renderer||!scene||!camera)return;if(!timestamp)timestamp=performance.now();const elapsed=timestamp-lastFrameTime;if(elapsed<fpsInterval)return;const delta=clock?clock.getDelta():0.016;lastFrameTime=timestamp-(elapsed%fpsInterval);try{animationTimelines.forEach(timeline=>{if(timeline&&typeof timeline.update==='function'){timeline.update(delta);}});}catch(e){console.warn('Error updating animation timelines:',e);}
if(particleSystem){try{updateParticles(delta);}catch(e){console.warn('Error updating particles:',e);}}
try{renderer.render(scene,camera);}catch(e){console.warn('Error rendering scene:',e);}}
function loadScript(url,callback){const script=document.createElement('script');script.type='text/javascript';script.src=url;script.onload=callback;document.head.appendChild(script);}
function addLogoImage(){const container=document.getElementById('logo-container');if(!container)return;container.innerHTML='';const logoDiv=document.createElement('div');logoDiv.className='logo-3d-container';logoDiv.style.position='absolute';logoDiv.style.top='0';logoDiv.style.left='0';logoDiv.style.width='100%';logoDiv.style.height='100%';logoDiv.style.display='flex';logoDiv.style.justifyContent='center';logoDiv.style.alignItems='center';logoDiv.style.perspective='1200px';logoDiv.style.perspectiveOrigin='center center';logoDiv.style.transformStyle='preserve-3d';logoDiv.style.backfaceVisibility='visible';logoDiv.style.webkitBackfaceVisibility='visible';const rotateWrapper=document.createElement('div');rotateWrapper.className='logo-rotate-wrapper';rotateWrapper.style.transformStyle='preserve-3d';rotateWrapper.style.backfaceVisibility='visible';rotateWrapper.style.webkitBackfaceVisibility='visible';rotateWrapper.style.animation='logo-rotate 12s linear infinite';rotateWrapper.style.width='100%';rotateWrapper.style.height='100%';rotateWrapper.style.display='flex';rotateWrapper.style.justifyContent='center';rotateWrapper.style.alignItems='center';rotateWrapper.style.transformOrigin='center center';const logoImg=document.createElement('img');logoImg.src='images/ai-unplugged.png';logoImg.alt='AI Unplugged Logo';logoImg.className='logo-image';logoImg.style.width='100%';logoImg.style.height='100%';logoImg.style.objectFit='contain';logoImg.style.animation='logo-pulse 4s ease-in-out infinite, logo-glow 6s ease-in-out infinite';logoImg.style.filter='drop-shadow(0 0 15px rgba(0, 255, 0, 0.8))';logoImg.style.transition='transform 0.3s ease-out, filter 0.3s ease-out';logoImg.style.backfaceVisibility='visible';logoImg.style.webkitBackfaceVisibility='visible';logoImg.style.transformStyle='preserve-3d';logoImg.style.position='relative';const textOverlay=document.createElement('div');textOverlay.className='logo-text-overlay';textOverlay.textContent='AI UNPLUGGED';textOverlay.style.position='absolute';textOverlay.style.bottom='10%';textOverlay.style.left='0';textOverlay.style.width='100%';textOverlay.style.textAlign='center';textOverlay.style.color='#00ff00';textOverlay.style.fontFamily='"Orbitron", sans-serif';textOverlay.style.fontSize='clamp(1rem, 4vw, 2rem)';textOverlay.style.fontWeight='bold';textOverlay.style.textShadow='0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00';textOverlay.style.animation='text-glow 3s ease-in-out infinite';textOverlay.style.zIndex='2';textOverlay.style.letterSpacing='2px';textOverlay.style.backfaceVisibility='visible';textOverlay.style.webkitBackfaceVisibility='visible';textOverlay.style.pointerEvents='none';const preloadImg=new Image();preloadImg.src='images/ai-unplugged.png';rotateWrapper.appendChild(logoImg);rotateWrapper.appendChild(textOverlay);setTimeout(()=>{rotateWrapper.style.animation='logo-rotate 12s linear infinite';},500);let isHovering=false;let rotationX=0;let rotationY=0;let targetRotationX=0;let targetRotationY=0;let animationId=null;const smoothRotate=()=>{rotationX+=(targetRotationX-rotationX)*0.1;rotationY+=(targetRotationY-rotationY)*0.1;rotateWrapper.style.transform=`rotate3d(0,1,0.2,${rotationY}deg)`;if(isHovering){animationId=requestAnimationFrame(smoothRotate);}};container.addEventListener('mousemove',(e)=>{const rect=container.getBoundingClientRect();const centerX=rect.width/2;const centerY=rect.height/2;const mouseX=e.clientX-rect.left;const mouseY=e.clientY-rect.top;targetRotationY=((mouseX-centerX)/centerX)*25;targetRotationX=((centerY-mouseY)/centerY)*25;if(!animationId&&isHovering){animationId=requestAnimationFrame(smoothRotate);}});container.addEventListener('mouseleave',()=>{isHovering=false;if(animationId){cancelAnimationFrame(animationId);animationId=null;}
rotateWrapper.style.animation='logo-rotate 8s linear infinite';logoImg.style.transform='scale(1)';});container.addEventListener('mouseenter',()=>{isHovering=true;rotateWrapper.style.animation='none';if(!animationId){animationId=requestAnimationFrame(smoothRotate);}
logoImg.style.transform='scale(1.05)';});container.addEventListener('touchmove',(e)=>{if(e.touches.length===1){const touch=e.touches[0];const rect=container.getBoundingClientRect();const centerX=rect.width/2;const centerY=rect.height/2;const touchX=touch.clientX-rect.left;const touchY=touch.clientY-rect.top;targetRotationY=((touchX-centerX)/centerX)*25;targetRotationX=((centerY-touchY)/centerY)*25;e.preventDefault();if(!animationId){isHovering=true;rotateWrapper.style.animation='none';animationId=requestAnimationFrame(smoothRotate);}}});container.addEventListener('touchend',()=>{isHovering=false;if(animationId){cancelAnimationFrame(animationId);animationId=null;}
rotateWrapper.style.animation='logo-rotate 8s linear infinite';});logoDiv.appendChild(rotateWrapper);container.appendChild(logoDiv);const style=document.createElement('style');style.textContent=`.logo-3d-container,.logo-rotate-wrapper,.logo-image{backface-visibility:visible!important;-webkit-backface-visibility:visible!important;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;}
@keyframes logo-rotate{0%{transform:rotate3d(0,1,0.2,0deg);}
25%{transform:rotate3d(0,1,0.2,90deg);}
50%{transform:rotate3d(0,1,0.2,180deg);}
75%{transform:rotate3d(0,1,0.2,270deg);}
100%{transform:rotate3d(0,1,0.2,360deg);}}@keyframes logo-pulse{0%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(0,255,0,0.5));}
25%{transform:scale(1.03);filter:drop-shadow(0 0 15px rgba(0,255,0,0.6));}
50%{transform:scale(1.05);filter:drop-shadow(0 0 20px rgba(0,255,0,0.8));}
75%{transform:scale(1.03);filter:drop-shadow(0 0 15px rgba(0,255,0,0.6));}
100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(0,255,0,0.5));}}@keyframes logo-glow{0%{filter:drop-shadow(0 0 10px rgba(0,255,0,0.5))brightness(1);}
50%{filter:drop-shadow(0 0 20px rgba(0,255,0,0.8))brightness(1.2);}
100%{filter:drop-shadow(0 0 10px rgba(0,255,0,0.5))brightness(1);}}@keyframes text-glow{0%{opacity:0.9;text-shadow:0 0 10px#00ff00,0 0 20px#00ff00,0 0 30px#00ff00,0 0 40px#00ff00;}
50%{opacity:1;text-shadow:0 0 15px#00ff00,0 0 25px#00ff00,0 0 35px#00ff00,0 0 45px#00ff00,0 0 55px#00ff00;}
100%{opacity:0.9;text-shadow:0 0 10px#00ff00,0 0 20px#00ff00,0 0 30px#00ff00,0 0 40px#00ff00;}}`;document.head.appendChild(style);}
function createLogoFallback(){const container=document.getElementById('logo-container');if(!container)return;if(container.querySelector('#logo-canvas'))return;container.innerHTML='';const logoContainer=document.createElement('div');logoContainer.className='logo-fallback-container';const logoImg=document.createElement('img');logoImg.src='images/ai-unplugged.png';logoImg.alt='AI Unplugged Logo';logoImg.className='logo-fallback-image';logoContainer.appendChild(logoImg);container.appendChild(logoContainer);const style=document.createElement('style');style.textContent=`@keyframes logo-rotate{0%{transform:perspective(800px)rotateY(0deg);}
100%{transform:perspective(800px)rotateY(360deg);}}.logo-fallback{transform-style:preserve-3d;backface-visibility:hidden;}`;document.head.appendChild(style);}
document.addEventListener('DOMContentLoaded',function(){const initObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){init3DLogo();initObserver.disconnect();setupVisibilityObserver();}});},{threshold:0.1});const container=document.getElementById('logo-container');if(container)initObserver.observe(container);});function setupVisibilityObserver(){const container=document.getElementById('logo-container');if(!container)return;const visibilityObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{isVisible=entry.isIntersecting;if(isVisible&&!animationFrameId){animationFrameId=requestAnimationFrame(animate);}
console.log('Logo visibility:',isVisible);});},{threshold:0.1});visibilityObserver.observe(container);document.addEventListener('visibilitychange',()=>{const isTabVisible=document.visibilityState==='visible';isVisible=isTabVisible&&isVisible;if(isTabVisible&&!animationFrameId){animationFrameId=requestAnimationFrame(animate);}});}
setTimeout(()=>{const canvas=document.getElementById('logo-canvas');const logoContainer=document.getElementById('logo-container');if((!canvas||!canvas.getContext('webgl'))&&(!logoContainer||!logoContainer.querySelector('.logo-image'))){console.warn('WebGL not available or 3D logo failed to load, using fallback');createLogoFallback();}},5000);function cleanup3DLogo(){if(animationFrameId){cancelAnimationFrame(animationFrameId);animationFrameId=null;}
if(scene){scene.traverse(object=>{if(object.geometry){object.geometry.dispose();}
if(object.material){if(Array.isArray(object.material)){object.material.forEach(material=>disposeMaterial(material));}else{disposeMaterial(object.material);}}});while(scene.children.length>0){scene.remove(scene.children[0]);}}
if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement=null;}
scene=null;camera=null;renderer=null;logoMesh=null;particleSystem=null;isInitialized=false;console.log('3D logo resources cleaned up');}
function disposeMaterial(material){if(!material)return;Object.keys(material).forEach(property=>{if(material[property]&&typeof material[property].dispose==='function'){material[property].dispose();}});material.dispose();}
window.addEventListener('beforeunload',cleanup3DLogo);