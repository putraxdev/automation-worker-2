#!/bin/bash

echo "🚀 Automation Worker 2 - Demo Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is running
print_step "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi
print_status "Docker is running ✓"

# Check if docker-compose is available
print_step "Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed."
    exit 1
fi
print_status "Docker Compose is available ✓"

# Stop any existing containers
print_step "Stopping existing containers..."
docker-compose down > /dev/null 2>&1
print_status "Stopped existing containers"

# Build containers
print_step "Building containers..."
if ! docker-compose build; then
    print_error "Failed to build containers"
    exit 1
fi
print_status "Containers built successfully ✓"

# Start services
print_step "Starting services..."
if ! docker-compose up -d; then
    print_error "Failed to start services"
    exit 1
fi
print_status "Services started successfully ✓"

# Wait for database to be ready
print_step "Waiting for database to be ready..."
sleep 10

# Check if services are running
print_step "Checking service status..."
if ! docker-compose ps | grep -q "Up"; then
    print_error "Services are not running properly"
    docker-compose logs
    exit 1
fi
print_status "All services are running ✓"

# Run manual test
print_step "Running manual data collection test..."
echo ""
if docker-compose exec -T automation-worker npm run test-manual; then
    print_status "Manual test completed successfully ✓"
else
    print_warning "Manual test had some issues, check logs"
fi

# Show collected files
print_step "Showing collected files..."
echo ""
ls -la ./data/ 2>/dev/null || echo "No files collected yet"

echo ""
print_status "Demo completed! 🎉"
echo ""
echo "📋 Available commands:"
echo "  make logs         - View real-time logs"
echo "  make collect      - Manual data collection"
echo "  make clean-data   - Manual data cleansing"
echo "  make status       - Check container status"
echo "  make down         - Stop services"
echo ""
echo "🔍 Check logs with: make logs"
echo "🛑 Stop services with: make down"
