const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'automation_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Get all products (sample data)
const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

// Get sales data (sample data)
const getSalesData = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        p.name as product_name,
        p.price,
        p.category,
        s.quantity,
        s.sale_date,
        (p.price * s.quantity) as total_amount
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);
    return result.rows;
  } catch (err) {
    console.error('Error fetching sales data:', err);
    throw err;
  }
};

// Get user activity data
const getUserActivity = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        username,
        email,
        last_login,
        login_count,
        status
      FROM users 
      ORDER BY last_login DESC
    `);
    return result.rows;
  } catch (err) {
    console.error('Error fetching user activity:', err);
    throw err;
  }
};

module.exports = {
  pool,
  testConnection,
  getAllProducts,
  getSalesData,
  getUserActivity
};
