const mysql = require("mysql2/promise");

// Create a pool of connections to the database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mks@12345",
  database: "grocery_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create products table if not exists
async function createProductsTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        company VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        shipping BOOLEAN NOT NULL
      )
    `);
    console.log("Products table created successfully");
  } catch (error) {
    console.error("Error creating products table:", error);
  } finally {
    connection.release();
  }
}

// Function to get a connection from the pool
async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  createProductsTable,
  getConnection,
};
