/**
 * MCP Operation: write_file for progressive enhancements [3]
 * 
 * Interactions and UI Enhancement Component
 * Scroll-triggered animations and interactive elements
 * Part of Portfolio Hybrid - Blending Charles Bruyerre's Hybrid Genre Framework 
 * with Tim Quirino's Sci-Fi Visual Narrative
 */

document.addEventListener('DOMContentLoaded', () => {
  // Performance metrics - Lighthouse optimization
  let scrollListenersAdded = false;
  const perfMetrics = {
    scrollEvents: 0,
    lastScrollTime: 0,
    scrollThrottleMs: 100 // Throttle scroll events for performance
  };
  
  // Selectors
  const selectors = {
    navLinks: '.nav-controls a',
    projectEntries: '.project-entry',
    skillRings: '.skill-ring',
    loreContainer: '.lore-container',
    formFields: '.form-field input, .form-field textarea',
    contactForm: '#contact-form'
  };
  
  // Get elements
  const navLinks = document.querySelectorAll(selectors.navLinks);
  const projectEntries = document.querySelectorAll(selectors.projectEntries);
  const skillRings = document.querySelectorAll(selectors.skillRings);
  const loreContainer = document.querySelector(selectors.loreContainer);
  const formFields = document.querySelectorAll(selectors.formFields);
  const contactForm = document.querySelector(selectors.contactForm);
  
  // Utility: Throttle function for performance
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = performance.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback.apply(this, args);
      }
    };
  };
  
  // Utility: Check if element is in viewport
  const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  
  // Navigation smooth scroll with highlighting
  const initNavigation = () => {
    navLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Smooth scroll to target
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Add active class to clicked link
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  };
  
  // Update active navigation based on scroll position
  const updateActiveNavOnScroll = throttle(() => {
    const scrollPosition = window.scrollY;
    
    // Track for performance metrics
    perfMetrics.scrollEvents++;
    perfMetrics.lastScrollTime = performance.now();
    
    // Find which section is currently visible
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const offset = 100; // Adjust based on your header height
        
        if (rect.top <= offset && rect.bottom >= offset) {
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }, perfMetrics.scrollThrottleMs);
  
  // Project entry hover effects
  const initProjectEntries = () => {
    projectEntries.forEach(project => {
      // Create hologram effect
      const hologram = project.querySelector('.hologram-content');
      
      if (hologram) {
        // Random scan line start position
        const randomStart = Math.random() * 100;
        hologram.style.setProperty('--scan-start', `${randomStart}%`);
        
        // 3D tilt effect on hover
        project.addEventListener('mousemove', event => {
          const rect = project.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const tiltX = (y - centerY) / (rect.height / 2) * 5;
          const tiltY = (centerX - x) / (rect.width / 2) * 5;
          
          project.style.transform = `translateY(-10px) scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        // Reset on mouse leave
        project.addEventListener('mouseleave', () => {
          project.style.transform = '';
        });
      }
    });
  };
  
  // Animate skill rings when they come into view
  const animateSkillRings = () => {
    skillRings.forEach(ring => {
      if (isInViewport(ring, 100) && !ring.classList.contains('animated')) {
        ring.classList.add('animated');
        
        const percentage = ring.getAttribute('data-percentage');
        const circle = ring.querySelector('.progress-ring-circle');
        
        if (circle) {
          const radius = circle.getAttribute('r');
          const circumference = 2 * Math.PI * radius;
          
          circle.style.strokeDasharray = `${circumference} ${circumference}`;
          circle.style.strokeDashoffset = circumference;
          
          // Animate the circle
          setTimeout(() => {
            circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
          }, 100);
        }
      }
    });
  };
  
  // Show lore container when scrolled into view
  const animateLoreContainer = () => {
    if (loreContainer && isInViewport(loreContainer, 100) && !loreContainer.classList.contains('visible')) {
      loreContainer.classList.add('visible');
    }
  };
  
  // Interactive form field visualizations
  const initFormInteractions = () => {
    formFields.forEach(field => {
      const visualization = field.nextElementSibling;
      
      if (visualization && visualization.classList.contains('field-visualization')) {
        // Initialize visualizer particles
        for (let i = 0; i < 3; i++) {
          const particle = document.createElement('div');
          particle.className = 'field-particle';
          particle.style.position = 'absolute';
          particle.style.borderRadius = '50%';
          particle.style.width = `${4 + i * 2}px`;
          particle.style.height = `${4 + i * 2}px`;
          particle.style.backgroundColor = 'var(--accent-blue)';
          particle.style.opacity = '0.7';
          
          // Random position
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.left = `${Math.random() * 100}%`;
          
          // Add unique animation delay
          particle.style.animation = `float ${3 + i * 0.5}s infinite alternate ease-in-out`;
          particle.style.animationDelay = `${i * 0.3}s`;
          
          visualization.appendChild(particle);
        }
        
        // Update visualization on input
        field.addEventListener('input', () => {
          // Change intensity based on content length
          const contentLength = field.value.length;
          const intensity = Math.min(contentLength / 20, 1);
          
          // Update particles
          const particles = visualization.querySelectorAll('.field-particle');
          particles.forEach((particle, index) => {
            particle.style.opacity = 0.3 + intensity * 0.7;
            
            // Textarea gets special treatment
            if (field.tagName === 'TEXTAREA') {
              particle.style.backgroundColor = 'var(--spice-orange)';
            }
          });
        });
      }
    });
  };
  
  // Quantum form submission effect
  const initContactForm = () => {
    if (contactForm) {
      contactForm.addEventListener('submit', event => {
        event.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;
        
        // Form validation
        if (!name || !email || !message) {
          alert('Please fill out all fields.');
          return;
        }
        
        // Create quantum transmission effect
        const formContainer = contactForm.closest('.frequency-modulator');
        formContainer.classList.add('transmitting');
        
        // Add particles to spice container if API exists
        if (window.spiceParticles) {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              window.spiceParticles.addParticle();
            }, i * 100);
          }
        }
        
        // Simulate form submission (would be replaced with actual API call)
        setTimeout(() => {
          // Show success message
          contactForm.innerHTML = `
            <div class="transmission-success">
              <h3>Transmission Successful</h3>
              <p>Your message has been quantum-entangled with our communication network.</p>
              <p>Thank you for your transmission, ${name}.</p>
            </div>
          `;
          
          // Remove transmission effect
          formContainer.classList.remove('transmitting');
        }, 2000);
      });
    }
  };
  
  // Scroll-triggered lore entries
  const initScrollTriggeredLore = () => {
    const loreEntries = [
      {
        threshold: 0.3, // Appears after scrolling 30% of the page
        title: "From the Imperial Archives",
        content: "The merging of Arrakeen technical prowess with ancient Bene Gesserit wisdom has created a new form of interface design."
      },
      {
        threshold: 0.6, // Appears after scrolling 60% of the page
        title: "Classified Report: Spice Interface",
        content: "Those who master the spice-enhanced design patterns can fold space between user and machine, creating intuitive pathways through complex systems."
      },
      {
        threshold: 0.9, // Appears near the bottom of the page
        title: "Personal Journal of Master Designer",
        content: "When the design aligns with the planetary movements, a resonance occurs that transcends conventional interaction paradigms."
      }
    ];
    
    if (loreContainer) {
      // Scroll handler to update lore based on scroll position
      const updateLoreContent = throttle(() => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Find appropriate lore entry based on scroll position
        let activeEntry = null;
        for (let i = loreEntries.length - 1; i >= 0; i--) {
          if (scrollPercent >= loreEntries[i].threshold) {
            activeEntry = loreEntries[i];
            break;
          }
        }
        
        // Update lore content if we have an active entry
        if (activeEntry && loreContainer.classList.contains('visible')) {
          const titleElement = loreContainer.querySelector('.lore-title');
          const contentElement = loreContainer.querySelector('.lore-content');
          
          if (titleElement && contentElement) {
            // Only update if content has changed
            if (titleElement.textContent !== activeEntry.title) {
              // Fade out
              loreContainer.style.opacity = '0';
              
              // Update content after fade
              setTimeout(() => {
                titleElement.textContent = activeEntry.title;
                contentElement.textContent = activeEntry.content;
                
                // Fade back in
                loreContainer.style.opacity = '1';
              }, 500);
            }
          }
        }
      }, 500); // Longer throttle for this less critical function
      
      // Add scroll listener
      window.addEventListener('scroll', updateLoreContent);
    }
  };
  
  // Initialize all scroll animations
  const initScrollAnimations = () => {
    if (scrollListenersAdded) return;
    
    // Add scroll event listeners
    window.addEventListener('scroll', throttle(() => {
      animateSkillRings();
      animateLoreContainer();
    }, perfMetrics.scrollThrottleMs));
    
    // Mark as added
    scrollListenersAdded = true;
    
    // Initial check for elements already in viewport
    animateSkillRings();
    animateLoreContainer();
  };
  
  // Initialize all interactive elements
  const init = () => {
    // Core interactions
    initNavigation();
    initProjectEntries();
    initFormInteractions();
    initContactForm();
    
    // Scroll-based interactions
    initScrollAnimations();
    initScrollTriggeredLore();
    
    // Listen for navigation changes
    window.addEventListener('scroll', updateActiveNavOnScroll);
    
    // Add to global namespace for debugging
    window.portfolioInteractions = {
      perfMetrics,
      isInViewport
    };
  };
  
  // Initialize when DOM is ready
  init();
});

// Error boundary
try {
  if (!window.requestAnimationFrame || !document.querySelector || !document.addEventListener) {
    console.warn('Modern browser features not available. Falling back to static version.');
    document.body.classList.add('fallback-mode');
  }
} catch (error) {
  console.error('Interactions initialization error:', error);
  document.body.classList.add('fallback-mode');
}
