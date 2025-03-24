/**
 * MCP Operation: write_file for WebGL integration [3]
 * 
 * Planet Renderer Component
 * Volumetric planet with two moons in orbital paths
 * Part of Portfolio Hybrid - Blending Charles Bruyerre's Hybrid Genre Framework 
 * with Tim Quirino's Sci-Fi Visual Narrative
 */

// Performance tracking for Lighthouse score
const perfMetrics = {
  startTime: performance.now(),
  frameCount: 0,
  fps: 0,
  lastFrameTime: 0
};

document.addEventListener('DOMContentLoaded', () => {
  // Canvas setup
  const canvas = document.getElementById('planet-canvas');
  const metricsContainer = document.getElementById('metrics-container');
  
  // Check for WebGL support
  if (!canvas || !window.THREE) {
    console.warn('WebGL or Three.js not available. Falling back to static version.');
    document.body.classList.add('fallback-mode');
    return;
  }
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  canvas.parentNode.appendChild(loadingIndicator);
  
  // Initialize Three.js
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setPixelRatio(window.devicePixelRatio > 1.5 ? 1.5 : window.devicePixelRatio);
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  
  // Camera setup - perspective for 3D effect
  const camera = new THREE.PerspectiveCamera(
    45, 
    canvas.offsetWidth / canvas.offsetHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 0, 15);
  
  // Scene setup with ambient light
  const scene = new THREE.Scene();
  
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
  scene.add(ambientLight);
  
  // Directional light for shadows and highlights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
  
  // Accent light with slight color
  const accentLight = new THREE.PointLight(0x64ffda, 1.5, 20);
  accentLight.position.set(-5, 1, 3);
  scene.add(accentLight);
  
  // Create the main planet
  const planetGeometry = new THREE.SphereGeometry(3, 64, 64);
  
  // Custom shader material for the planet
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#0a192f') },
      uColor2: { value: new THREE.Color('#172a45') },
      uAccent: { value: new THREE.Color('#64ffda') },
      uGlow: { value: new THREE.Color('#ff8a00') }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uAccent;
      uniform vec3 uGlow;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Noise functions
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }
      
      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = p.x + p.y * 57.0 + p.z * 113.0;
        return mix(
          mix(
            mix(hash(n), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x),
            f.y),
          mix(
            mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x),
            f.y),
          f.z);
      }
      
      float fbm(vec3 p) {
        float sum = 0.0;
        float amp = 1.0;
        float freq = 1.0;
        
        for(int i = 0; i < 6; i++) {
          sum += amp * noise(p * freq);
          amp *= 0.5;
          freq *= 2.0;
        }
        
        return sum;
      }
      
      void main() {
        // Base planet atmosphere gradient
        float atmosphereGradient = dot(vNormal, vec3(0, 0, 1)) * 0.5 + 0.5;
        vec3 baseColor = mix(uColor1, uColor2, atmosphereGradient);
        
        // Surface features with noise
        vec3 noisePos = vPosition * 2.0 + vec3(0.0, 0.0, uTime * 0.05);
        float noiseSample = fbm(noisePos);
        
        // Surface highlights
        float highlightIntensity = smoothstep(0.6, 0.8, noiseSample);
        vec3 surfaceHighlights = mix(baseColor, uAccent, highlightIntensity * 0.3);
        
        // Atmosphere glow on edges
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 3.0);
        vec3 atmosphereGlow = mix(surfaceHighlights, uGlow, fresnel * 0.6);
        
        // Final color
        gl_FragColor = vec4(atmosphereGlow, 1.0);
      }
    `
  });
  
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);
  
  // Create the orbital paths
  const createOrbitalPath = (radius, color, segments = 128) => {
    const pathGeometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      positions.push(
        radius * Math.cos(theta),
        0,
        radius * Math.sin(theta)
      );
    }
    
    pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const pathMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });
    
    return new THREE.Line(pathGeometry, pathMaterial);
  };
  
  // First moon orbital path
  const moonPath1 = createOrbitalPath(7, 0x64ffda);
  scene.add(moonPath1);
  
  // Second moon orbital path
  const moonPath2 = createOrbitalPath(9, 0xff8a00);
  scene.add(moonPath2);
  
  // Create the first moon
  const moon1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const moon1Material = new THREE.MeshStandardMaterial({
    color: 0x64ffda,
    roughness: 0.7,
    metalness: 0.2,
    emissive: 0x64ffda,
    emissiveIntensity: 0.2
  });
  
  const moon1 = new THREE.Mesh(moon1Geometry, moon1Material);
  scene.add(moon1);
  
  // Create the second moon
  const moon2Geometry = new THREE.SphereGeometry(0.7, 32, 32);
  const moon2Material = new THREE.MeshStandardMaterial({
    color: 0xff8a00,
    roughness: 0.6,
    metalness: 0.3,
    emissive: 0xff8a00,
    emissiveIntensity: 0.2
  });
  
  const moon2 = new THREE.Mesh(moon2Geometry, moon2Material);
  scene.add(moon2);
  
  // Add stars to the background
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1000;
  const starsPositions = [];
  
  for (let i = 0; i < starsCount; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    
    if (Math.sqrt(x*x + y*y + z*z) > 20) {
      starsPositions.push(x, y, z);
    }
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  
  // Resize handler
  const handleResize = () => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Dynamic CTA text update based on "planetary alignment"
  const updateCtaText = () => {
    const ctaButton = document.getElementById('voice-cta');
    if (!ctaButton) return;
    
    const alignmentPhase = (performance.now() / 5000) % 3;
    
    if (alignmentPhase < 1) {
      ctaButton.textContent = 'Harness the Voice';
    } else if (alignmentPhase < 2) {
      ctaButton.textContent = 'Summon the Waters';
    } else {
      ctaButton.textContent = 'Command the Spice';
    }
  };
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    const time = performance.now() * 0.001; // Convert to seconds
    
    // Update FPS counter
    perfMetrics.frameCount++;
    
    if (time - perfMetrics.lastFrameTime >= 1) { // Update every second
      perfMetrics.fps = Math.round(perfMetrics.frameCount / (time - perfMetrics.lastFrameTime));
      perfMetrics.lastFrameTime = time;
      perfMetrics.frameCount = 0;
      
      if (metricsContainer) {
        metricsContainer.textContent = `FPS: ${perfMetrics.fps}`;
      }
    }
    
    // Rotate planet
    planet.rotation.y = time * 0.1;
    
    // Update shader time uniform
    if (planetMaterial.uniforms) {
      planetMaterial.uniforms.uTime.value = time;
    }
    
    // Update moon positions
    moon1.position.x = Math.cos(time * 0.3) * 7;
    moon1.position.z = Math.sin(time * 0.3) * 7;
    
    moon2.position.x = Math.cos(time * 0.2 + Math.PI) * 9;
    moon2.position.z = Math.sin(time * 0.2 + Math.PI) * 9;
    
    // Tilt the orbital paths
    moonPath1.rotation.x = Math.PI * 0.1;
    moonPath2.rotation.x = -Math.PI * 0.05;
    
    // Update CTA based on "planetary alignment"
    updateCtaText();
    
    // Render scene
    renderer.render(scene, camera);
  };
  
  // Initialize animation loop
  animate();
  
  // Remove loading indicator after short delay
  setTimeout(() => {
    if (loadingIndicator && loadingIndicator.parentNode) {
      loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
  }, 1500);
  
  // Expose controller for external access
  window.planetController = {
    scene,
    camera,
    renderer,
    planet,
    moon1,
    moon2
  };
});

// Error boundary for WebGL rendering
try {
  if (!window.WebGLRenderingContext) {
    console.warn('WebGL not supported. Falling back to static version.');
    document.body.classList.add('fallback-mode');
  }
} catch (error) {
  console.error('Planet renderer error:', error);
  document.body.classList.add('fallback-mode');
}
