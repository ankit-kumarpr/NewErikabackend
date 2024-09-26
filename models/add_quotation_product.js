const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Client
    ref: "Customer", // Client model
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  purchase_quantity: {
    type: Number,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quotation", QuotationSchema);
