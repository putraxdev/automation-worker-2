.PHONY: build up down logs clean test collect clean-data install demo

# Demo - Full setup and test
demo:
	@echo "🚀 Running full demo..."
	./demo.sh

# Default target
help:
	@echo "Available commands:"
	@echo "  make demo         - Run full demo (recommended for first time)"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - Show logs"
	@echo "  make clean        - Clean up containers and volumes"
	@echo "  make test         - Run tests"
	@echo "  make test-manual  - Run manual test (collection + cleaning)"
	@echo "  make collect      - Manual data collection"
	@echo "  make clean-data   - Manual data cleansing"
	@echo "  make health       - System health check"
	@echo "  make status       - Show container status"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Build Docker images
build:
	@echo "🏗️  Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "📊 Database will be initialized with sample data"
	@echo "⏰ Cron jobs scheduled for:"
	@echo "   - Data Collection: 08:00, 12:00, 15:00 WIB"
	@echo "   - Data Cleansing: 02:00 WIB daily"
	@echo ""
	@echo "🔍 Check logs with: make logs"

# Start services and show logs
up-logs:
	@echo "🚀 Starting services with logs..."
	docker-compose up

# Stop all services
down:
	@echo "🛑 Stopping services..."
	docker-compose down

# Show logs
logs:
	@echo "📋 Showing logs..."
	docker-compose logs -f

# Show logs for specific service
logs-app:
	@echo "📋 Showing application logs..."
	docker-compose logs -f automation-worker

logs-db:
	@echo "📋 Showing database logs..."
	docker-compose logs -f postgres

# Clean up everything
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Show container status
status:
	@echo "📊 Container status:"
	docker-compose ps

# Manual data collection
collect:
	@echo "📊 Running manual data collection..."
	docker-compose exec automation-worker npm run collect

# Manual data cleansing
clean-data:
	@echo "🧹 Running manual data cleansing..."
	docker-compose exec automation-worker npm run clean

# List collected files
list-files:
	@echo "📁 Listing collected files..."
	docker-compose exec automation-worker node src/clean-data.js --list

# Run tests
test:
	@echo "🧪 Running tests..."
	npm test

# Manual test (collection + cleaning)
test-manual:
	@echo "🧪 Running manual test..."
	docker-compose exec automation-worker npm run test-manual

# System health check
health:
	@echo "🏥 Running health check..."
	docker-compose exec automation-worker npm run health

# Development mode (with file watching)
dev:
	@echo "🔧 Starting development mode..."
	npm run dev

# Access database
db-shell:
	@echo "🐘 Accessing database shell..."
	docker-compose exec postgres psql -U postgres -d automation_db

# Check data directory
check-data:
	@echo "📁 Checking data directory..."
	ls -la ./data/

# Restart services
restart:
	@echo "🔄 Restarting services..."
	docker-compose restart

# View real-time logs with timestamps
logs-tail:
	@echo "📋 Following logs with timestamps..."
	docker-compose logs -f -t

# Quick setup (install + build + up)
setup: install build up
	@echo "🎉 Setup complete!"
	@echo ""
	@echo "🔗 Quick commands:"
	@echo "  make logs       - View logs"
	@echo "  make collect    - Manual collection"
	@echo "  make status     - Check status"
	@echo "  make down       - Stop services"
