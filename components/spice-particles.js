/**
 * MCP Operation: write_file for particle system [3]
 * 
 * Spice Particle Emitter Component
 * 3D particle system with collision detection
 * Part of Portfolio Hybrid - Blending Charles Bruyerre's Hybrid Genre Framework 
 * with Tim Quirino's Sci-Fi Visual Narrative
 */

document.addEventListener('DOMContentLoaded', () => {
  // Container element for particles
  const spiceContainer = document.getElementById('spice-particle-emitter');
  
  // Exit if container not found or browser doesn't support required features
  if (!spiceContainer || !window.requestAnimationFrame) {
    console.warn('Spice particle emitter: Dependencies not available');
    return;
  }
  
  // Configuration for the particle system
  const config = {
    particleCount: 30,
    minSize: 5,
    maxSize: 20,
    minSpeed: 0.5,
    maxSpeed: 2,
    colors: [
      'rgba(255, 138, 0, 0.7)',  // Spice orange
      'rgba(179, 135, 40, 0.6)',  // Ancient gold
      'rgba(100, 255, 218, 0.5)'  // Accent blue
    ],
    containerWidth: spiceContainer.offsetWidth,
    containerHeight: spiceContainer.offsetHeight,
    glowIntensity: 0.7,
    collisionRadius: 20,
    particleLifetime: 8000, // milliseconds
    emissionRate: 500, // milliseconds between new particles
    boundaryElasticity: 0.8
  };
  
  // Store for active particles
  const particles = [];
  
  // Mouse position for interaction
  const mouse = {
    x: undefined,
    y: undefined,
    radius: config.collisionRadius
  };
  
  // Track whether mouse is over container
  let mouseOverContainer = false;
  
  // Resize handler
  const handleResize = () => {
    config.containerWidth = spiceContainer.offsetWidth;
    config.containerHeight = spiceContainer.offsetHeight;
  };
  
  // Mouse move handler for interaction
  const handleMouseMove = (event) => {
    if (!mouseOverContainer) return;
    
    // Get container's position
    const rect = spiceContainer.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };
  
  // Mouse enter handler
  const handleMouseEnter = () => {
    mouseOverContainer = true;
  };
  
  // Mouse leave handler
  const handleMouseLeave = () => {
    mouseOverContainer = false;
    mouse.x = undefined;
    mouse.y = undefined;
  };
  
  // Add event listeners
  window.addEventListener('resize', handleResize);
  spiceContainer.addEventListener('mousemove', handleMouseMove);
  spiceContainer.addEventListener('mouseenter', handleMouseEnter);
  spiceContainer.addEventListener('mouseleave', handleMouseLeave);
  
  // Particle class
  class Particle {
    constructor() {
      this.init();
    }
    
    init() {
      // Random position within container
      this.x = Math.random() * config.containerWidth;
      this.y = Math.random() * config.containerHeight;
      this.z = Math.random() * 100; // For 3D effect
      
      // Random size
      this.baseSize = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      this.size = this.baseSize * (this.z / 100 + 0.5); // Size based on z-depth
      
      // Random direction and speed
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
      this.velocityX = Math.cos(angle) * speed;
      this.velocityY = Math.sin(angle) * speed;
      this.velocityZ = (Math.random() - 0.5) * speed;
      
      // Random color from config
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      // Create DOM element
      this.element = document.createElement('div');
      this.element.className = 'particle';
      this.element.style.position = 'absolute';
      this.element.style.borderRadius = '50%';
      this.element.style.backgroundColor = this.color;
      this.element.style.boxShadow = `0 0 ${config.glowIntensity * 10}px ${this.color}`;
      this.element.style.width = `${this.size}px`;
      this.element.style.height = `${this.size}px`;
      this.element.style.transform = 'translate(-50%, -50%)';
      this.element.style.willChange = 'transform, opacity';
      
      // Add to container
      spiceContainer.appendChild(this.element);
      
      // Set lifetime
      this.creationTime = performance.now();
      this.lifetime = config.particleLifetime + Math.random() * 2000; // Add some randomness
    }
    
    update() {
      // Calculate age
      const age = performance.now() - this.creationTime;
      const lifePercent = age / this.lifetime;
      
      // Remove if too old
      if (lifePercent >= 1) {
        this.remove();
        return false;
      }
      
      // Opacity based on lifetime (fade in and out)
      const opacity = lifePercent < 0.1 ? lifePercent * 10 : 
                     lifePercent > 0.9 ? (1 - lifePercent) * 10 : 
                     1;
      
      // Move particle
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.z += this.velocityZ;
      
      // Keep z in bounds
      if (this.z < 0) {
        this.z = 0;
        this.velocityZ *= -config.boundaryElasticity;
      } else if (this.z > 100) {
        this.z = 100;
        this.velocityZ *= -config.boundaryElasticity;
      }
      
      // Update size based on z
      this.size = this.baseSize * (this.z / 100 + 0.5);
      
      // Boundary collision detection
      if (this.x < 0) {
        this.x = 0;
        this.velocityX *= -config.boundaryElasticity;
      } else if (this.x > config.containerWidth) {
        this.x = config.containerWidth;
        this.velocityX *= -config.boundaryElasticity;
      }
      
      if (this.y < 0) {
        this.y = 0;
        this.velocityY *= -config.boundaryElasticity;
      } else if (this.y > config.containerHeight) {
        this.y = config.containerHeight;
        this.velocityY *= -config.boundaryElasticity;
      }
      
      // Mouse interaction - repel particles
      if (mouseOverContainer && mouse.x !== undefined && mouse.y !== undefined) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size / 2) {
          // Calculate repulsion direction
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - distance) / mouse.radius;
          
          // Apply force
          this.velocityX += Math.cos(angle) * force;
          this.velocityY += Math.sin(angle) * force;
        }
      }
      
      // Particle-to-particle collision
      particles.forEach(otherParticle => {
        if (otherParticle === this) return;
        
        const dx = this.x - otherParticle.x;
        const dy = this.y - otherParticle.y;
        const dz = this.z - otherParticle.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const minDistance = (this.size + otherParticle.size) / 2;
        
        if (distance < minDistance) {
          // Calculate repulsion direction
          const angle = Math.atan2(dy, dx);
          const force = (minDistance - distance) / minDistance * 0.05;
          
          // Apply force
          this.velocityX += Math.cos(angle) * force;
          this.velocityY += Math.sin(angle) * force;
          this.velocityZ += dz > 0 ? force : -force;
          
          // Slight color blend on collision
          if (Math.random() > 0.8) {
            this.color = otherParticle.color;
            this.element.style.backgroundColor = this.color;
            this.element.style.boxShadow = `0 0 ${config.glowIntensity * 10}px ${this.color}`;
          }
        }
      });
      
      // Update DOM element
      this.element.style.width = `${this.size}px`;
      this.element.style.height = `${this.size}px`;
      this.element.style.opacity = opacity;
      this.element.style.transform = `translate(calc(${this.x}px - 50%), calc(${this.y}px - 50%)) translateZ(${this.z / 10}px)`;
      
      return true; // Particle is still active
    }
    
    remove() {
      // Remove from DOM
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      // Mark for removal from array
      return false;
    }
  }
  
  // Initialize particles
  const initParticles = () => {
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  };
  
  // Emit new particles periodically
  let lastEmissionTime = 0;
  const emitParticles = (timestamp) => {
    if (timestamp - lastEmissionTime > config.emissionRate) {
      // Only emit if we're below the max count
      if (particles.length < config.particleCount) {
        particles.push(new Particle());
      }
      
      lastEmissionTime = timestamp;
    }
  };
  
  // Animation loop
  const animate = (timestamp) => {
    // Update and filter out dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
      }
    }
    
    // Emit new particles
    emitParticles(timestamp);
    
    // Continue animation loop
    requestAnimationFrame(animate);
  };
  
  // Start the particle system
  initParticles();
  animate(performance.now());
  
  // Expose API for external control
  window.spiceParticles = {
    config,
    addParticle: () => {
      particles.push(new Particle());
    },
    removeParticle: () => {
      if (particles.length > 0) {
        const particle = particles.pop();
        particle.remove();
      }
    },
    setCollisionRadius: (radius) => {
      mouse.radius = radius;
    }
  };
});

// Error boundary
try {
  // Feature detection for required capabilities
  if (!window.requestAnimationFrame) {
    console.warn('RequestAnimationFrame not supported. Falling back to static version.');
    document.body.classList.add('fallback-mode');
  }
} catch (error) {
  console.error('Spice particle emitter error:', error);
  document.body.classList.add('fallback-mode');
}
