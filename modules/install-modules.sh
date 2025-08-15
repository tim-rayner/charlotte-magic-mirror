#!/bin/bash

# MagicMirror Module Installation Script
# This script installs the required modules for Charlotte's Magic Mirror

set -e  # Exit on any error

echo "Installing MagicMirror modules..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to clone or update a module
install_module() {
    local repo_url=$1
    local module_name=$2
    
    echo "Installing $module_name..."
    
    if [ -d "$SCRIPT_DIR/$module_name" ]; then
        echo "  $module_name already exists, updating..."
        cd "$SCRIPT_DIR/$module_name"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "  Could not update $module_name"
        cd "$SCRIPT_DIR"
    else
        echo "  Cloning $module_name..."
        cd "$SCRIPT_DIR"
        git clone "$repo_url" "$module_name"
    fi
    
    # Install npm dependencies if package.json exists
    if [ -f "$SCRIPT_DIR/$module_name/package.json" ]; then
        echo "  Installing npm dependencies for $module_name..."
        cd "$SCRIPT_DIR/$module_name"
        npm install
        cd "$SCRIPT_DIR"
    fi
    
    echo "  ✓ $module_name installed successfully"
}

# Install each module
install_module "https://github.com/BigBot89/MMM-AccuWeatherForecastDeluxe.git" "MMM-AccuWeatherForecastDeluxe"
install_module "https://github.com/EnderFlop/MMM-Moon.git" "MMM-Moon"
install_module "https://github.com/kevinatown/MMM-Screencast.git" "MMM-Screencast"
install_module "https://github.com/BrianHepler/MMM-WeatherBackground.git" "MMM-WeatherBackground"

echo ""
echo "All modules installed successfully!"
echo ""
echo "Note: Make sure to configure each module in your config/config.js file."
