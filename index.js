const express = require("express");
const bodyParser = require("body-parser");
const { createProductsTable, getConnection } = require("./schema");
const cors = require("cors");

const app = express();
const port = 3000;

// Create products table if not exists
createProductsTable();

// Enable All CORS Requests
app.use(cors());

app.use(bodyParser.json());

// Retrieve all products
app.get("/products", async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Retrieve a product by ID
app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  const connection = await getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Create a new product
app.post("/products", async (req, res) => {
  const {
    name,
    price,
    image,
    colors,
    company,
    description,
    category,
    shipping,
  } = req.body;

  const newColors = JSON.stringify(colors);

  const connection = await getConnection();

  try {
    const [result] = await connection.query(
      `INSERT INTO products (name, price, image, colors, company, description, category, shipping) VALUES ('${name}', '${price}', '${image}', '${newColors}', '${company}', '${description}', '${category}', ${shipping})`
    );
    res.json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Update a product by ID
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;
  const connection = await getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      [name, price, productId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;

  const connection = await getConnection();
  try {
    const [result] = await connection.query(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Error handling and other routes go here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
