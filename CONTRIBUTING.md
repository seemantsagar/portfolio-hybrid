# Contributing to the Hybrid Portfolio

Thank you for considering contributing to this project! This document outlines the process and guidelines for contributing.

## Development Process

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- Familiarity with Three.js is helpful for WebGL components
- No build tools required - this is a vanilla project

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/portfolio-hybrid.git
   cd portfolio-hybrid
   ```

2. Start a local server
   You can use any local server. For example:
   - With Python: `python -m http.server`
   - With Node.js: `npx serve`
   - With VS Code: Use the Live Server extension

3. View the site at `localhost:8000` (or the port your server uses)

## Project Structure

- `/index.html` - Main HTML structure
- `/styles/` - CSS files
  - `main.css` - Core styling
  - `animations.css` - Animation effects
- `/components/` - JavaScript modules
  - `planet-renderer.js` - WebGL planet visualization
  - `spice-particles.js` - Particle system
  - `interactions.js` - UI interactions and animations
- `/assets/` - Static assets
  - `/favicon/` - Favicon files
  - `/js/` - Additional scripts
- `/.github/` - GitHub-specific files

## Coding Guidelines

### HTML
- Use semantic HTML5 elements
- Include appropriate ARIA attributes for accessibility
- Maintain the established document structure

### CSS
- Follow the existing CSS variable system
- Add new variables to the `:root` section when needed
- Keep media queries in the appropriate section

### JavaScript
- Use ES6+ features
- Add appropriate error boundaries
- Follow the module pattern established in the components

## Pull Request Process

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request with a clear description of changes

## Performance Guidelines

This project aims for a 90+ Lighthouse score. Please ensure:

- Images are properly optimized
- JavaScript is non-blocking (use defer/async)
- CSS is efficient and minimizes repaints
- Accessibility is maintained throughout
- HTML is valid and semantic

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
