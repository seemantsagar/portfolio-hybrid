#!/bin/bash
# Script to set up a GitHub repository and push the portfolio-hybrid project

# Print colored text
print_color() {
    COLOR='\033[1;36m' # Cyan
    NC='\033[0m' # No Color
    printf "${COLOR}$1${NC}\n"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_color "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Current directory should be the project root
PROJECT_DIR=$(pwd)
PROJECT_NAME=$(basename "$PROJECT_DIR")

if [ "$PROJECT_NAME" != "portfolio_hybrid" ]; then
    print_color "Warning: Current directory name is not 'portfolio_hybrid'. Continue anyway? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        exit 1
    fi
fi

print_color "=== Setting up Git repository for $PROJECT_NAME ==="

# Initialize Git repository if not already initialized
if [ ! -d .git ]; then
    print_color "Initializing Git repository..."
    git init
    if [ $? -ne 0 ]; then
        print_color "Error initializing Git repository."
        exit 1
    fi
else
    print_color "Git repository already initialized."
fi

# Add all files to Git
print_color "Adding files to Git..."
git add .
if [ $? -ne 0 ]; then
    print_color "Error adding files to Git."
    exit 1
fi

# Commit changes
print_color "Committing files..."
git commit -m "Initial commit: Portfolio website blending Charles Bruyerre's Hybrid Genre Framework with Tim Quirino's Sci-Fi Visual Narrative"
if [ $? -ne 0 ]; then
    print_color "Error committing files. If you see 'Author identity unknown' error, configure Git with:"
    print_color "  git config --global user.email \"your-email@example.com\""
    print_color "  git config --global user.name \"Your Name\""
    exit 1
fi

# Instructions for GitHub repository creation
print_color "\n=== Next Steps ==="
print_color "1. Create a new GitHub repository at: https://github.com/new"
print_color "2. Name your repository: portfolio-hybrid"
print_color "3. Make it public"
print_color "4. Do NOT initialize with README, .gitignore, or license (we've already done this)"
print_color "5. Click 'Create repository'"
print_color "6. Then run the following commands to push your code:"
print_color "\n   git remote add origin https://github.com/YOUR-USERNAME/portfolio-hybrid.git"
print_color "   git branch -M main"
print_color "   git push -u origin main"
print_color "\nReplace 'YOUR-USERNAME' with your actual GitHub username."

print_color "\n=== Setup Complete ==="
print_color "After pushing to GitHub, you can enable GitHub Pages in repository settings to deploy your site."
