const fs = require('fs-extra');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { getAllProducts, getSalesData, getUserActivity } = require('./database');

// Ensure data directory exists
const DATA_PATH = process.env.CRON_DATA_PATH || '/home/cron';
fs.ensureDirSync(DATA_PATH);

// Format date for filename
const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}${day}${year}`;
};

// Format time for filename
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes}`;
};

// Collect products data
const collectProductsData = async () => {
  try {
    const now = new Date();
    const dateStr = formatDate(now);
    const timeStr = formatTime(now);
    const filename = `cron_products_${dateStr}_${timeStr}.csv`;
    const filepath = path.join(DATA_PATH, filename);

    console.log(`Collecting products data at ${now.toISOString()}`);
    
    const products = await getAllProducts();
    
    if (products.length === 0) {
      console.log('No products data found');
      return;
    }

    const csvWriter = createCsvWriter({
      path: filepath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Product Name' },
        { id: 'price', title: 'Price' },
        { id: 'category', title: 'Category' },
        { id: 'stock', title: 'Stock' },
        { id: 'created_at', title: 'Created At' }
      ]
    });

    await csvWriter.writeRecords(products);
    console.log(`Products data saved to ${filename} (${products.length} records)`);
    
    return filename;
  } catch (error) {
    console.error('Error collecting products data:', error);
    throw error;
  }
};

// Collect sales data
const collectSalesData = async () => {
  try {
    const now = new Date();
    const dateStr = formatDate(now);
    const timeStr = formatTime(now);
    const filename = `cron_sales_${dateStr}_${timeStr}.csv`;
    const filepath = path.join(DATA_PATH, filename);

    console.log(`Collecting sales data at ${now.toISOString()}`);
    
    const sales = await getSalesData();
    
    if (sales.length === 0) {
      console.log('No sales data found');
      return;
    }

    const csvWriter = createCsvWriter({
      path: filepath,
      header: [
        { id: 'product_name', title: 'Product Name' },
        { id: 'price', title: 'Price' },
        { id: 'category', title: 'Category' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'total_amount', title: 'Total Amount' },
        { id: 'sale_date', title: 'Sale Date' }
      ]
    });

    await csvWriter.writeRecords(sales);
    console.log(`Sales data saved to ${filename} (${sales.length} records)`);
    
    return filename;
  } catch (error) {
    console.error('Error collecting sales data:', error);
    throw error;
  }
};

// Collect user activity data
const collectUserActivity = async () => {
  try {
    const now = new Date();
    const dateStr = formatDate(now);
    const timeStr = formatTime(now);
    const filename = `cron_users_${dateStr}_${timeStr}.csv`;
    const filepath = path.join(DATA_PATH, filename);

    console.log(`Collecting user activity data at ${now.toISOString()}`);
    
    const users = await getUserActivity();
    
    if (users.length === 0) {
      console.log('No user activity data found');
      return;
    }

    const csvWriter = createCsvWriter({
      path: filepath,
      header: [
        { id: 'id', title: 'User ID' },
        { id: 'username', title: 'Username' },
        { id: 'email', title: 'Email' },
        { id: 'last_login', title: 'Last Login' },
        { id: 'login_count', title: 'Login Count' },
        { id: 'status', title: 'Status' }
      ]
    });

    await csvWriter.writeRecords(users);
    console.log(`User activity data saved to ${filename} (${users.length} records)`);
    
    return filename;
  } catch (error) {
    console.error('Error collecting user activity data:', error);
    throw error;
  }
};

// Main collection function
const collectAllData = async () => {
  console.log('=== Starting Data Collection ===');
  console.log(`Collection time: ${new Date().toISOString()}`);
  
  try {
    const results = await Promise.allSettled([
      collectProductsData(),
      collectSalesData(),
      collectUserActivity()
    ]);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`=== Collection Complete ===`);
    console.log(`Successful: ${successful}, Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('Failed collections:');
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Collection ${index + 1}: ${result.reason}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Error in data collection:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  collectAllData()
    .then(() => {
      console.log('Data collection completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Data collection failed:', error);
      process.exit(1);
    });
}

module.exports = {
  collectAllData,
  collectProductsData,
  collectSalesData,
  collectUserActivity
};
