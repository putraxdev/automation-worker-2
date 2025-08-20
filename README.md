# Automation Worker 2 - Data Collection & Cleansing System

🚀 **Sistem otomatis untuk pengumpulan dan pembersihan data menggunakan cron job dengan Docker, Node.js, dan PostgreSQL**

## 📋 Deskripsi

Sistem ini mengotomatisasi proses pengumpulan data dari database PostgreSQL dan menyimpannya dalam format CSV. Data dikumpulkan 3 kali sehari (08:00, 12:00, 15:00 WIB) dan file yang sudah berumur lebih dari 1 bulan akan otomatis dihapus setiap hari jam 02:00 WIB.

## ✨ Fitur

- ⏰ **Automated Data Collection**: Pengumpulan data otomatis 3x sehari
- 🧹 **Automatic Data Cleansing**: Pembersihan file otomatis setelah 1 bulan
- 🐘 **PostgreSQL Integration**: Database dengan sample data (700+ records)
- 🐳 **Docker Containerized**: Setup mudah dengan Docker Compose
- 📊 **CSV Export**: Export data dalam format CSV dengan naming convention yang konsisten
- 🌏 **Jakarta Timezone**: Konfigurasi timezone Indonesia (WIB)
- 📝 **Comprehensive Logging**: Logging detail untuk monitoring
- 🛠️ **Make Commands**: Command shortcuts untuk kemudahan penggunaan

## 🏗️ Arsitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cron Jobs     │    │  Node.js App    │    │  PostgreSQL     │
│                 │    │                 │    │                 │
│ • 08:00 WIB     │───▶│ • Data Collect  │───▶│ • Sample Data   │
│ • 12:00 WIB     │    │ • Data Clean    │    │ • 200 Products  │
│ • 15:00 WIB     │    │ • CSV Export    │    │ • 100 Users     │
│ • 02:00 WIB     │    │                 │    │ • 500 Sales     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   CSV Files     │
                       │                 │
                       │ /home/cron/     │
                       │ cron_MMDDYYYY_  │
                       │ HH.MM.csv       │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Make (optional, untuk shortcuts)

### 1. Clone Repository

```bash
git clone <repository-url>
cd automation-worker-2
```

### 2. Quick Demo (Recommended)

```bash
# Jalankan demo script yang akan setup semua dan test
./demo.sh
```

### 3. Setup & Run (Manual)

```bash
make setup
```

Atau step by step:

```bash
# Install dependencies
npm install

# Build dan start services
docker-compose up -d
```

### 4. Verify Installation

```bash
# Check status
make status

# View logs
make logs

# Manual test
make test-manual

# List collected files
make list-files
```

## 📊 Data Collection Schedule

| Waktu | Aktivitas | Format File |
|-------|-----------|-------------|
| 08:00 WIB | Data Collection | `cron_products_MMDDYYYY_08.00.csv` |
| 12:00 WIB | Data Collection | `cron_sales_MMDDYYYY_12.00.csv` |
| 15:00 WIB | Data Collection | `cron_users_MMDDYYYY_15.00.csv` |
| 02:00 WIB | Data Cleansing | Hapus file > 1 bulan |

## 🎮 Available Commands

### Make Commands (Recommended)

```bash
make help           # Tampilkan semua commands
make setup          # Install + Build + Start
make up             # Start services
make down           # Stop services
make logs           # Show logs
make status         # Container status
make collect        # Manual data collection
make clean-data     # Manual data cleansing
make list-files     # List CSV files
make clean          # Cleanup semua
```

### Docker Compose Commands

```bash
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f            # Follow logs
docker-compose ps                 # Status
```

### Manual Commands

```bash
# Manual data collection
docker-compose exec automation-worker npm run collect

# Manual data cleansing
docker-compose exec automation-worker npm run clean

# Access database
docker-compose exec postgres psql -U postgres -d automation_db
```
## 📁 File Structure

```
automation-worker-2/
├── src/
│   ├── index.js           # Main application
│   ├── collect-data.js    # Data collection logic
│   ├── clean-data.js      # Data cleansing logic
│   └── database.js        # Database connection
├── init-db/
│   └── 01-init.sql        # Database initialization
├── data/                  # CSV files storage (host accessible)
├── tests/
│   └── *.test.js          # Test files
├── docker-compose.yml     # Docker services
├── Dockerfile            # App container
├── Makefile              # Command shortcuts
└── package.json          # Dependencies
```

## 📊 CSV Output Location

CSV files akan disimpan di folder **`data/`** pada host machine (bukan di dalam container), sehingga mudah diakses:

```bash
# Check collected CSV files
ls -la data/

# Example files:
# data/cron_products_08202025_08.00.csv
# data/cron_sales_08202025_12.00.csv  
# data/cron_users_08202025_15.00.csv
```

## 📈 Sample Data

Database akan otomatis terisi dengan:

- **200 Products**: Electronics, Clothing, Home & Garden, dll
- **100 Users**: User accounts dengan activity data
- **500 Sales**: Transaction records

## 🔧 Configuration

### Environment Variables

```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=automation_db
DB_USER=postgres
DB_PASSWORD=password123

# Application
NODE_ENV=production
TZ=Asia/Jakarta
CRON_DATA_PATH=/home/cron
```

### Custom Cron Schedule

Edit file `crontab` untuk mengubah jadwal:

```bash
# Data collection times
0 8,12,15 * * * cd /app && node src/collect-data.js

# Data cleansing time
0 2 * * * cd /app && node src/clean-data.js
```

## 📊 Monitoring & Logs

### View Logs

```bash
# All logs
make logs

# App logs only
make logs-app

# Database logs only
make logs-db
```

### Check Collected Files

```bash
# List files with details
make list-files

# Check data directory
ls -la ./data/
```

### Database Access

```bash
# Access PostgreSQL
make db-shell

# Or
docker-compose exec postgres psql -U postgres -d automation_db
```

## 🧪 Testing

```bash
# Run tests
npm test

# Or with make
make test
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 5432 already in use**
   ```bash
   # Stop local PostgreSQL
   sudo systemctl stop postgresql
   ```

2. **Permission denied for data directory**
   ```bash
   # Fix permissions
   sudo chmod 755 ./data
   ```

3. **Container won't start**
   ```bash
   # Check logs
   make logs
   
   # Rebuild
   make clean
   make build
   make up
   ```

### Debug Commands

```bash
# Container status
docker-compose ps

# Inspect specific container
docker-compose logs automation-worker

# Access container shell
docker-compose exec automation-worker sh
```

## 📋 Maintenance

### Manual Operations

```bash
# Force data collection now
make collect

# Force data cleansing now
make clean-data

# Restart services
make restart

# Update application
git pull
make build
make up
```

### Backup Data

```bash
# Backup collected CSV files
cp -r ./data ./backup-$(date +%Y%m%d)

# Backup database
docker-compose exec postgres pg_dump -U postgres automation_db > backup-db-$(date +%Y%m%d).sql
```

## 🔐 Security Notes

- Default database password untuk development saja
- Untuk production, gunakan environment variables yang secure
- Consider menggunakan Docker secrets untuk sensitive data

## 📚 Dependencies

- **Node.js**: Runtime environment
- **PostgreSQL**: Database
- **node-cron**: Job scheduling
- **csv-writer**: CSV file generation
- **pg**: PostgreSQL client

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

## 🚀 Production Deployment

Untuk production deployment:

1. Update environment variables
2. Use secure database credentials
3. Configure proper volume mounting
4. Set up monitoring & alerting
5. Configure log rotation

```bash
# Production docker-compose override
cp docker-compose.yml docker-compose.prod.yml
# Edit production settings
docker-compose -f docker-compose.prod.yml up -d
```