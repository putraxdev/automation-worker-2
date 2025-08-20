const cron = require('node-cron');
const { testConnection } = require('./database');
const { collectAllData } = require('./collect-data');
const { cleanOldFiles } = require('./clean-data');

// Set timezone to Jakarta
process.env.TZ = 'Asia/Jakarta';

console.log('🚀 Automation Worker Starting...');
console.log(`📅 Current time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
console.log(`🌍 Timezone: ${process.env.TZ}`);

// Test database connection on startup
const initializeApp = async () => {
  try {
    console.log('🔍 Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed. Exiting...');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    console.log('⏰ Setting up cron jobs...');
    
    // Schedule data collection at 08:00, 12:00, and 15:00 WIB
    cron.schedule('0 8,12,15 * * *', async () => {
      console.log('\n📊 Scheduled data collection triggered');
      try {
        await collectAllData();
        console.log('✅ Scheduled data collection completed\n');
      } catch (error) {
        console.error('❌ Scheduled data collection failed:', error);
      }
    }, {
      timezone: 'Asia/Jakarta'
    });

    // Schedule data cleansing daily at 02:00 WIB
    cron.schedule('0 2 * * *', async () => {
      console.log('\n🧹 Scheduled data cleansing triggered');
      try {
        await cleanOldFiles();
        console.log('✅ Scheduled data cleansing completed\n');
      } catch (error) {
        console.error('❌ Scheduled data cleansing failed:', error);
      }
    }, {
      timezone: 'Asia/Jakarta'
    });

    console.log('✅ Cron jobs scheduled successfully');
    console.log('📋 Schedule:');
    console.log('   - Data Collection: 08:00, 12:00, 15:00 WIB');
    console.log('   - Data Cleansing: 02:00 WIB daily');
    console.log('\n🔄 Application is running and waiting for scheduled tasks...');
    
    // Keep the application running
    setInterval(() => {
      const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      console.log(`💓 Heartbeat: ${now}`);
    }, 60000 * 60); // Every hour
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
initializeApp();
