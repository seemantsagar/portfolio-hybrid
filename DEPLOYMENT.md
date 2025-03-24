# Deployment Guide

This document provides instructions for deploying the Hybrid Portfolio website.

## Local Setup

1. Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/portfolio-hybrid.git
cd portfolio-hybrid
```

2. Open the `index.html` file in your web browser to view the website locally

## GitHub Deployment

### Option 1: GitHub Pages

1. Create a new GitHub repository named `portfolio-hybrid`
2. Initialize it with a README
3. Upload all the project files to the repository
4. Go to the repository Settings > Pages
5. Set the source to the main branch
6. Your site will be published at `https://yourusername.github.io/portfolio-hybrid/`

### Option 2: Using Your Own Domain

1. Follow the steps for GitHub Pages deployment
2. In the repository Settings > Pages, set up a custom domain
3. Create the necessary DNS records with your domain provider:
   - For an apex domain: Create A records pointing to GitHub's IP addresses
   - For a subdomain: Create a CNAME record pointing to your GitHub Pages URL

## Performance Optimization

For production deployment, consider these additional steps:

1. Minify CSS and JavaScript files
2. Optimize images (compress, use WebP format)
3. Enable browser caching with proper headers
4. Use a CDN for faster content delivery

## Post-Deployment

1. Run Lighthouse audits to ensure performance targets are met (90+ score)
2. Test the website across different browsers and devices
3. Verify all interactive elements are working correctly

## Update Instructions

To update the deployed website:

1. Make changes to your local copy
2. Commit and push changes to GitHub
3. GitHub Pages will automatically rebuild and deploy your site

## Troubleshooting

If you encounter issues with the WebGL rendering:
- Check browser console for errors
- Verify Three.js is loaded correctly
- The site includes fallback modes that will activate automatically if WebGL is not supported
