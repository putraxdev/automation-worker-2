# 🚀 Automation Worker 2 - Quick Setup Guide

## ⚡ Quick Start (1 Command)

```bash
# Clone repository dan masuk ke directory
cd automation-worker-2

# Jalankan demo lengkap
./demo.sh
```

## 📋 Step-by-Step Manual

### 1. Prerequisites
- Docker & Docker Compose installed
- Port 5432 tidak digunakan (untuk PostgreSQL)

### 2. Setup
```bash
# Install dependencies
npm install

# Build containers
make build

# Start services
make up
```

### 3. Testing
```bash
# Health check
make health

# Manual test
make test-manual

# View logs
make logs
```

## 🎯 What This System Does

### Data Collection (3x per hari)
- **08:00 WIB**: Collect products data → `cron_products_MMDDYYYY_08.00.csv`
- **12:00 WIB**: Collect sales data → `cron_sales_MMDDYYYY_12.00.csv` 
- **15:00 WIB**: Collect users data → `cron_users_MMDDYYYY_15.00.csv`

### Data Cleansing (1x per hari)
- **02:00 WIB**: Delete files older than 1 month

### Sample Data
- 200 Products (Electronics, Clothing, etc.)
- 100 Users (with activity data)
- 500 Sales transactions

## 🔧 Key Commands

```bash
make demo         # Full demo dengan testing
make up           # Start services
make down         # Stop services
make logs         # View real-time logs
make health       # System health check
make collect      # Manual data collection
make clean-data   # Manual data cleansing
make status       # Container status
```

## 📁 File Output

Files disimpan di: `./data/`

Format naming: `cron_{type}_{MMDDYYYY}_{HH.MM}.csv`

Example:
- `data/cron_products_08202025_08.00.csv`
- `data/cron_sales_08202025_12.00.csv`
- `data/cron_users_08202025_15.00.csv`

## 🐛 Troubleshooting

### Common Issues
1. **Port 5432 in use**: Stop local PostgreSQL
2. **Permission denied**: `chmod +x demo.sh`
3. **Docker not running**: Start Docker service

### Debug Commands
```bash
make logs         # Check logs
make health       # System status
docker-compose ps # Container status
```

## ✅ Success Indicators

After running `./demo.sh`, you should see:
- ✅ All services running
- ✅ Database connected
- ✅ Sample data loaded
- ✅ CSV files generated
- ✅ Cron jobs scheduled

## 🔍 Monitoring

```bash
# Real-time logs
make logs

# Check collected files
ls -la ./data/

# Database access
make db-shell
```

---

**🎉 That's it! Your automation system is ready!**

The system will automatically:
- Collect data 3 times daily (08:00, 12:00, 15:00 WIB)  
- Clean old files daily (02:00 WIB)
- Generate CSV files with proper naming convention
- Log all activities for monitoring
