const Quotation = require("../models/add_bill_product");
const Customer = require("../models/Add_customer"); // Assuming you have this Client model

// -------------------------- Add Quotation Products for a Client and Return Data --------------
const Billaddproduct = async (req, res) => {
  const { client_id, products } = req.body; // Expecting client_id and an array of products

  try {
    // Check for required fields
    if (!client_id || !products || products.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Missing client_id or products",
      });
    }

    // Check if the client exists
    const client = await Customer.findById(client_id);
    if (!client) {
      return res.status(404).json({
        error: true,
        message: "Client not found",
      });
    }

    // Validate each product and calculate total cost
    const productListWithTotalCost = products.map((product) => {
      const { product_name, product_id, purchase_quantity, product_price } = product;

      // Validate product fields
      if (!product_name || !product_id || purchase_quantity === undefined || product_price === undefined) {
        throw new Error("Missing required fields in one or more products");
      }

      // Validate purchase_quantity and product_price
      if (purchase_quantity <= 0 || product_price < 0) {
        throw new Error("Purchase quantity must be greater than 0 and product price cannot be negative.");
      }

      const total_cost = purchase_quantity * product_price; // Calculate total cost for the product

      return {
        product_name,
        product_id,
        purchase_quantity,
        product_price,
        total_cost, // Include total cost in the returned object
        client_id: client_id, // Attach client_id for each product
      };
    });

    // Insert the products associated with the client
    const newProductList = await Quotation.insertMany(productListWithTotalCost);

    // Fetch the added products and include the client details
    const quotationsWithClientDetails = await Quotation.find({ client_id }).populate("client_id");
    
    console.log("Quotations with Client Details:", quotationsWithClientDetails);
    
    res.status(200).json({
      error: false,
      message: "Products added successfully and retrieved with client details.",
      data: quotationsWithClientDetails,
    });
  } catch (error) {
    console.error("Error:", error); // Log error for debugging
    res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};

// Exporting the controller function
module.exports = { Billaddproduct };
