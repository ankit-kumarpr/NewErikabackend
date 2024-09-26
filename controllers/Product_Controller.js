const Product = require("../models/add_product");
const path = require("path");

const AddProduct = async (req, res) => {
  try {
    const { product_name,  id, date, Pack_size,price } = req.body;

    // Check if all required fields are provided
    if (!product_name || !id || !price) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields || Something went wrong",
      });
    }

    // Check if product image file is uploaded
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "Product image is required || Please input prodcut image",
      });
    }

    // File path to store the image
    const product_image = req.file.filename;

    // Create new product
    const newProduct = new Product({
      product_name,
      id,
      date,
      price,
      Pack_size,
      product_image,
    });

    // Save to database
    await newProduct.save();

    res.status(201).json({
      error: false,
      message: "Product added successfully",
      data: [newProduct],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ------------------------------------get product list------------------------------

const Getproducts = async (req, res) => {
  try {
    const productlist = await Product.find({ is_deleted: { $ne: 1 } });

    if (productlist.length == 0) {
      res.status(404).json({
        error: true,
        message: "No products found",
      });
    }

    res.status(200).json({
      error: false,
      message: "All Products list ..",
      data: [productlist],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Inter server error",
    });
  }
};

// -------------------------------------update products-------------------------------
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product image file is uploaded (optional)
    if (req.file) {
      updateData.product_image = req.file.filename; // Update image filename if a new image is provided
    }

    // Find and update the product by id
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Product updated successfully",
      data: [updatedProduct],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// -------------------------------------delete product-------------------------------
const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by id
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { is_deleted: 1 },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// -------------------------------------get single product data--------------------------

const GetProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by id
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Product details",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  AddProduct,
  Getproducts,
  UpdateProduct,
  DeleteProduct,
  GetProductById,
};
