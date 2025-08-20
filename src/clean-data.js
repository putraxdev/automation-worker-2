const fs = require('fs-extra');
const path = require('path');

const DATA_PATH = process.env.CRON_DATA_PATH || '/home/cron';

// Calculate date one month ago
const getOneMonthAgo = () => {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);
  return oneMonthAgo;
};

// Parse date from filename (format: cron_type_MMDDYYYY_HH.MM.csv)
const parseDateFromFilename = (filename) => {
  try {
    const parts = filename.split('_');
    if (parts.length < 4) return null;
    
    const datePart = parts[2]; // MMDDYYYY
    const timePart = parts[3].replace('.csv', ''); // HH.MM
    
    if (datePart.length !== 8) return null;
    
    const month = parseInt(datePart.substr(0, 2)) - 1; // Month is 0-indexed
    const day = parseInt(datePart.substr(2, 2));
    const year = parseInt(datePart.substr(4, 4));
    
    const [hours, minutes] = timePart.split('.').map(Number);
    
    return new Date(year, month, day, hours, minutes);
  } catch (error) {
    console.error(`Error parsing date from filename ${filename}:`, error);
    return null;
  }
};

// Get file size in bytes
const getFileSize = (filepath) => {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Clean old files
const cleanOldFiles = async () => {
  console.log('=== Starting Data Cleansing ===');
  console.log(`Cleansing time: ${new Date().toISOString()}`);
  console.log(`Data path: ${DATA_PATH}`);
  
  try {
    // Ensure directory exists
    if (!fs.existsSync(DATA_PATH)) {
      console.log(`Directory ${DATA_PATH} does not exist. Nothing to clean.`);
      return;
    }

    const files = fs.readdirSync(DATA_PATH);
    const csvFiles = files.filter(file => file.endsWith('.csv') && file.startsWith('cron_'));
    
    console.log(`Found ${csvFiles.length} CSV files to check`);
    
    if (csvFiles.length === 0) {
      console.log('No CSV files found for cleaning');
      return;
    }

    const oneMonthAgo = getOneMonthAgo();
    console.log(`Deleting files older than: ${oneMonthAgo.toISOString()}`);
    
    let deletedCount = 0;
    let deletedSize = 0;
    let keptCount = 0;
    let errorCount = 0;

    for (const file of csvFiles) {
      const filepath = path.join(DATA_PATH, file);
      const fileDate = parseDateFromFilename(file);
      
      if (!fileDate) {
        console.log(`Skipping file with invalid date format: ${file}`);
        errorCount++;
        continue;
      }
      
      const fileSize = getFileSize(filepath);
      
      if (fileDate < oneMonthAgo) {
        try {
          fs.unlinkSync(filepath);
          deletedCount++;
          deletedSize += fileSize;
          console.log(`Deleted: ${file} (${formatFileSize(fileSize)}) - Date: ${fileDate.toISOString()}`);
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error);
          errorCount++;
        }
      } else {
        keptCount++;
        console.log(`Kept: ${file} (${formatFileSize(fileSize)}) - Date: ${fileDate.toISOString()}`);
      }
    }

    console.log('=== Cleansing Summary ===');
    console.log(`Total files checked: ${csvFiles.length}`);
    console.log(`Files deleted: ${deletedCount}`);
    console.log(`Files kept: ${keptCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total space freed: ${formatFileSize(deletedSize)}`);
    console.log(`Cleansing completed at: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('Error in data cleansing:', error);
    throw error;
  }
};

// List current files for debugging
const listCurrentFiles = async () => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.log(`Directory ${DATA_PATH} does not exist`);
      return;
    }

    const files = fs.readdirSync(DATA_PATH);
    const csvFiles = files.filter(file => file.endsWith('.csv') && file.startsWith('cron_'));
    
    console.log(`\n=== Current CSV Files in ${DATA_PATH} ===`);
    
    if (csvFiles.length === 0) {
      console.log('No CSV files found');
      return;
    }

    let totalSize = 0;
    
    csvFiles.forEach(file => {
      const filepath = path.join(DATA_PATH, file);
      const fileDate = parseDateFromFilename(file);
      const fileSize = getFileSize(filepath);
      totalSize += fileSize;
      
      console.log(`${file} - ${formatFileSize(fileSize)} - ${fileDate ? fileDate.toISOString() : 'Invalid date'}`);
    });
    
    console.log(`\nTotal: ${csvFiles.length} files, ${formatFileSize(totalSize)}`);
    
  } catch (error) {
    console.error('Error listing files:', error);
  }
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--list')) {
    listCurrentFiles()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error listing files:', error);
        process.exit(1);
      });
  } else {
    cleanOldFiles()
      .then(() => {
        console.log('Data cleansing completed successfully');
        process.exit(0);
      })
      .catch(error => {
        console.error('Data cleansing failed:', error);
        process.exit(1);
      });
  }
}

module.exports = {
  cleanOldFiles,
  listCurrentFiles,
  parseDateFromFilename
};
