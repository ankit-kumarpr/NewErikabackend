const Quotation = require("../models/add_quotation_product");
const Customer = require("../models/Add_customer"); // Assuming you have this Client mode

// -------------------------- Add Quotation Products for a Client and Return Data --------------
const Quotationaddproduct = async (req, res) => {
  const { client_id, products } = req.body; // Expecting client_id and an array of products

  try {
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
      const { product_name, product_id, purchase_quantity, product_price } =
        product;

      if (
        !product_name ||
        !product_id ||
        !purchase_quantity ||
        !product_price
      ) {
        throw new Error("Missing required fields in one or more products");
      }

      return {
        ...product,
        // total_cost: product.purchase_quantity * product.product_price,
        client_id: client_id, // Attach client_id for each product
      };
    });

    // Insert the products associated with the client
    const newProductList = await Quotation.insertMany(productListWithTotalCost);

    // Fetch the added products and include the client details
    const quotationsWithClientDetails = await Quotation.find({
      client_id,
    }).populate("client_id");
    console.log("hhhhhhhhhhh", quotationsWithClientDetails);
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

// module.exports = { Quotationaddproduct };

// --------------------------- update quotation product list-------------------------

module.exports = { Quotationaddproduct };
