#!/bin/bash
# Script to package the portfolio-hybrid project for easy sharing

# Print colored text
print_color() {
    COLOR='\033[1;36m' # Cyan
    NC='\033[0m' # No Color
    printf "${COLOR}$1${NC}\n"
}

# Current directory should be the project root
PROJECT_DIR=$(pwd)
PROJECT_NAME=$(basename "$PROJECT_DIR")
DATE_STAMP=$(date +"%Y%m%d")
PACKAGE_NAME="${PROJECT_NAME}_${DATE_STAMP}.zip"

print_color "=== Packaging $PROJECT_NAME ==="

# Check if zip command is available
if ! command -v zip &> /dev/null; then
    print_color "Error: 'zip' command not found. Please install zip utility."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_color "On macOS, you can install it with: brew install zip"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_color "On Ubuntu/Debian, you can install it with: sudo apt-get install zip"
        print_color "On Fedora/RHEL, you can install it with: sudo dnf install zip"
    fi
    exit 1
fi

# Create package directory
TEMP_DIR="${PROJECT_DIR}/../${PROJECT_NAME}_package"
if [ -d "$TEMP_DIR" ]; then
    print_color "Removing existing package directory..."
    rm -rf "$TEMP_DIR"
fi

mkdir -p "$TEMP_DIR"
if [ $? -ne 0 ]; then
    print_color "Error creating temporary directory."
    exit 1
fi

# Copy files to package directory
print_color "Copying project files..."
cp -R "$PROJECT_DIR"/* "$TEMP_DIR/"
if [ $? -ne 0 ]; then
    print_color "Error copying files."
    exit 1
fi

# Remove scripts and any development-only files
print_color "Cleaning up package..."
rm -f "$TEMP_DIR/package_project.sh"
rm -f "$TEMP_DIR/setup_repository.sh"

# Create ZIP archive
print_color "Creating archive: $PACKAGE_NAME..."
cd "${PROJECT_DIR}/.."
zip -r "$PACKAGE_NAME" "$(basename "$TEMP_DIR")" -x "*/\.*" "*/node_modules/*" "*/\.*"
if [ $? -ne 0 ]; then
    print_color "Error creating ZIP archive."
    exit 1
fi

# Cleanup
print_color "Cleaning up..."
rm -rf "$TEMP_DIR"

# Success message
print_color "\n=== Packaging Complete ==="
print_color "Archive created: $(dirname "$PROJECT_DIR")/$PACKAGE_NAME"
print_color "You can now share this ZIP file or upload it to GitHub."
