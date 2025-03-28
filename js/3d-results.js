let resultsScene,resultsCamera,resultsRenderer;let barCharts=[];let resultsAnimationId;let isResultsInitialized=false;function initResultsVisualization(){if(isResultsInitialized)return;isResultsInitialized=true;let container=document.getElementById('results-3d-container');if(!container){container=document.createElement('div');container.id='results-3d-container';container.style.position='absolute';container.style.top='0';container.style.left='0';container.style.width='100%';container.style.height='100%';container.style.zIndex='0';const resultsSection=document.querySelector('#results-section .calculator-results');if(resultsSection){resultsSection.style.position='relative';resultsSection.prepend(container);}}
resultsScene=new THREE.Scene();resultsCamera=new THREE.PerspectiveCamera(60,container.clientWidth/container.clientHeight,0.1,1000);resultsCamera.position.set(0,3,5);resultsCamera.lookAt(0,0,0);resultsRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true});resultsRenderer.setSize(container.clientWidth,container.clientHeight);resultsRenderer.setClearColor(0x000000,0);container.appendChild(resultsRenderer.domElement);const ambientLight=new THREE.AmbientLight(0x404040,0.5);resultsScene.add(ambientLight);const directionalLight=new THREE.DirectionalLight(0xffffff,0.8);directionalLight.position.set(1,3,2);resultsScene.add(directionalLight);const blueLight=new THREE.PointLight(0x4285f4,0.8,8);blueLight.position.set(-3,2,3);resultsScene.add(blueLight);const greenLight=new THREE.PointLight(0x34a853,0.8,8);greenLight.position.set(3,2,3);resultsScene.add(greenLight);createBarCharts();const controls=new THREE.OrbitControls(resultsCamera,resultsRenderer.domElement);controls.enableDamping=true;controls.dampingFactor=0.05;controls.rotateSpeed=0.5;controls.enableZoom=false;controls.autoRotate=true;controls.autoRotateSpeed=0.5;window.addEventListener('resize',onResultsResize);animateResults();container.style.opacity=0;gsap.to(container,{opacity:1,duration:1.5,delay:0.5});}
function createBarCharts(){barCharts.forEach(chart=>{chart.children.forEach(child=>{if(child.geometry)child.geometry.dispose();if(child.material)child.material.dispose();});resultsScene.remove(chart);});barCharts=[];const monthlySavings=parseFloat(document.getElementById('monthly-savings').textContent.replace(/[^0-9.-]+/g,''));const annualSavings=parseFloat(document.getElementById('annual-savings').textContent.replace(/[^0-9.-]+/g,''));const roiPercentage=parseFloat(document.getElementById('roi-percentage').textContent.replace(/[^0-9%]+/g,''));const maxValue=Math.max(monthlySavings,annualSavings/12,roiPercentage/20);const monthlyHeight=(monthlySavings/maxValue)*3;const annualHeight=(annualSavings/12/maxValue)*3;const roiHeight=(roiPercentage/20/maxValue)*3;const barChartGroup=new THREE.Group();barChartGroup.position.set(0,0,0);const baseGeometry=new THREE.BoxGeometry(10,0.1,5);const baseMaterial=new THREE.MeshPhongMaterial({color:0x1a1a1a,specular:0x111111,shininess:30});const baseMesh=new THREE.Mesh(baseGeometry,baseMaterial);baseMesh.position.y=-0.05;barChartGroup.add(baseMesh);const gridHelper=new THREE.GridHelper(10,10,0x555555,0x333333);gridHelper.position.y=0.01;barChartGroup.add(gridHelper);createBar(barChartGroup,-3,monthlyHeight,0,0x4285f4,'Monthly');createBar(barChartGroup,0,annualHeight,0,0x34a853,'Annual');createBar(barChartGroup,3,roiHeight,0,0xfbbc05,'ROI %');resultsScene.add(barChartGroup);barCharts.push(barChartGroup);animateBarGrowth();}
function createBar(parent,x,height,z,color,label){const barGeometry=new THREE.BoxGeometry(1.5,height,1.5);const barMaterial=new THREE.MeshStandardMaterial({color:color,metalness:0.5,roughness:0.3,emissive:color,emissiveIntensity:0.2,transparent:true,opacity:0.9});const barMesh=new THREE.Mesh(barGeometry,barMaterial);barMesh.position.set(x,height/2,z);barMesh.userData.finalHeight=height;barMesh.scale.y=0;const glowGeometry=new THREE.BoxGeometry(1.6,height,1.6);const glowMaterial=new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:0.15});const glowMesh=new THREE.Mesh(glowGeometry,glowMaterial);glowMesh.position.set(x,height/2,z);glowMesh.scale.y=0;const textGeometry=new THREE.TextGeometry(label,{font:new THREE.Font(),size:0.3,height:0.05});const textMaterial=new THREE.MeshBasicMaterial({color:0xffffff});const textMesh=new THREE.Mesh(textGeometry,textMaterial);textMesh.position.set(x-0.5,0.2,z+0.8);textMesh.rotation.x=-Math.PI/4;parent.add(barMesh);parent.add(glowMesh);const loader=new THREE.FontLoader();loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function(font){const textGeometry=new THREE.TextGeometry(label,{font:font,size:0.3,height:0.05});textMesh.geometry=textGeometry;textMesh.geometry.center();textMesh.position.set(x,0.2,z+0.8);parent.add(textMesh);});return{bar:barMesh,glow:glowMesh};}
function animateBarGrowth(){barCharts.forEach(chart=>{chart.children.forEach(child=>{if(child.userData.finalHeight!==undefined){gsap.to(child.scale,{y:1,duration:1.5,ease:"elastic.out(1, 0.3)",delay:0.5});}});});}
function animateResults(){resultsAnimationId=requestAnimationFrame(animateResults);barCharts.forEach(chart=>{chart.rotation.y+=0.005;});resultsRenderer.render(resultsScene,resultsCamera);}
function onResultsResize(){const container=document.getElementById('results-3d-container');if(!container||!resultsCamera||!resultsRenderer)return;resultsCamera.aspect=container.clientWidth/container.clientHeight;resultsCamera.updateProjectionMatrix();resultsRenderer.setSize(container.clientWidth,container.clientHeight);}
function stopResultsAnimation(){if(resultsAnimationId){cancelAnimationFrame(resultsAnimationId);}}
function updateResultsVisualization(){if(!isResultsInitialized){initResultsVisualization();}else{createBarCharts();}}
document.addEventListener('DOMContentLoaded',function(){const calculatorNavItems=document.querySelectorAll('.calculator-nav-item');calculatorNavItems.forEach(item=>{item.addEventListener('click',function(){if(this.getAttribute('data-section')==='results-section'){setTimeout(initResultsVisualization,300);}});});document.addEventListener('calculatorUpdated',updateResultsVisualization);});function dispatchUpdateEvent(){document.dispatchEvent(new CustomEvent('calculatorUpdated'));}