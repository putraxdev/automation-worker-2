const { testConnection } = require('./database');
const fs = require('fs-extra');
const path = require('path');

const DATA_PATH = process.env.CRON_DATA_PATH || '/home/cron';

const healthCheck = async () => {
  const status = {
    timestamp: new Date().toISOString(),
    database: false,
    dataDirectory: false,
    services: {
      collection: false,
      cleaning: false
    },
    stats: {
      totalFiles: 0,
      totalSize: 0,
      oldestFile: null,
      newestFile: null
    }
  };

  try {
    // Check database connection
    status.database = await testConnection();
    
    // Check data directory
    if (fs.existsSync(DATA_PATH)) {
      status.dataDirectory = true;
      
      // Get file statistics
      const files = fs.readdirSync(DATA_PATH)
        .filter(file => file.endsWith('.csv') && file.startsWith('cron_'));
      
      status.stats.totalFiles = files.length;
      
      if (files.length > 0) {
        let totalSize = 0;
        let oldestTime = Infinity;
        let newestTime = 0;
        let oldestFile = null;
        let newestFile = null;
        
        files.forEach(file => {
          const filepath = path.join(DATA_PATH, file);
          const stats = fs.statSync(filepath);
          totalSize += stats.size;
          
          if (stats.mtime.getTime() < oldestTime) {
            oldestTime = stats.mtime.getTime();
            oldestFile = file;
          }
          
          if (stats.mtime.getTime() > newestTime) {
            newestTime = stats.mtime.getTime();
            newestFile = file;
          }
        });
        
        status.stats.totalSize = totalSize;
        status.stats.oldestFile = oldestFile;
        status.stats.newestFile = newestFile;
      }
    }
    
    // Test collection service
    try {
      const { getAllProducts } = require('./database');
      const products = await getAllProducts();
      status.services.collection = products.length > 0;
    } catch (error) {
      status.services.collection = false;
    }
    
    // Cleaning service is always available if data directory exists
    status.services.cleaning = status.dataDirectory;
    
  } catch (error) {
    console.error('Health check error:', error);
  }
  
  return status;
};

// Format file size
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Display health status
const displayHealth = async () => {
  console.log('🏥 System Health Check');
  console.log('=====================');
  
  const health = await healthCheck();
  
  console.log(`🕐 Timestamp: ${health.timestamp}`);
  console.log(`🗄️  Database: ${health.database ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`📁 Data Directory: ${health.dataDirectory ? '✅ Available' : '❌ Missing'}`);
  console.log(`📊 Collection Service: ${health.services.collection ? '✅ Ready' : '❌ Not Ready'}`);
  console.log(`🧹 Cleaning Service: ${health.services.cleaning ? '✅ Ready' : '❌ Not Ready'}`);
  
  console.log('\n📈 Statistics:');
  console.log(`   Total Files: ${health.stats.totalFiles}`);
  console.log(`   Total Size: ${formatBytes(health.stats.totalSize)}`);
  console.log(`   Oldest File: ${health.stats.oldestFile || 'None'}`);
  console.log(`   Newest File: ${health.stats.newestFile || 'None'}`);
  
  const allHealthy = health.database && health.dataDirectory && 
                    health.services.collection && health.services.cleaning;
  
  console.log(`\n🎯 Overall Status: ${allHealthy ? '✅ Healthy' : '⚠️  Issues Detected'}`);
  
  return health;
};

// Run if called directly
if (require.main === module) {
  displayHealth()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

module.exports = { healthCheck, displayHealth };
