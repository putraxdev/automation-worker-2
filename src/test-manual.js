const { collectAllData } = require('./collect-data');
const { cleanOldFiles } = require('./clean-data');

console.log('🧪 Running manual test of data collection and cleansing...\n');

const runTest = async () => {
  try {
    console.log('📊 Testing data collection...');
    await collectAllData();
    
    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🧹 Testing data cleansing...');
    await cleanOldFiles();
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

runTest();
