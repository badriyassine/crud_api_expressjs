import { connectdb, getdb } from "./db.js";
import express from "express"
const app = express();
const port = 3000;

app.use(express.json());

const users = [];

// connect to database
connectdb();

// start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// get products
app.get("/products", (req, res) => {
  const db = getdb();
  db
    ? res.status(404).send("No products found!")
    : res.status(200).send(users);
});

// add product
app.post("/products", async (req, res) => {
  try {
    const db = getdb();
    const product = req.body;

    // check if product already exists 
    const existingProduct = await db
      .collection("products")
      .findOne({ id: product.id });

    if (existingProduct) {
      return res.status(409).send("Product already exists");
    }

    // insert product
    await db.collection("products").insertOne(product);

    res.status(201).send("Product added successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});


// update product
app.put("/products/:id", async (req, res) => {
  try {
    const db = getdb();
    const id = Number(req.params.id);
    const updatedData = req.body;

    // check if product exists
    const existingProduct = await db
      .collection("products")
      .findOne({ id });

    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // update product
    await db.collection("products").updateOne(
      { id },               
      { $set: updatedData }  
    );

    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});



// delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const db = getdb();
    const id = Number(req.params.id);

    // check if product exists
    const existingProduct = await db
      .collection("products")
      .findOne({ id });

    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // delete product
    await db.collection("products").deleteOne({ id });

    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});


