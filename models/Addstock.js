const mongoose = require('mongoose');

const AddstockSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_price_unit: {
    type: Number,
  },
  initial_stock: { // New field to store the initial stock quantity
    type: Number,
    required: true,
  },
  initial_stock_date: { // New field to store the date when the stock was added
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: 0,
  },
  issued_stock_history: [ // New field to store the history of issued stocks
    {
      issued_quantity: {
        type: Number,
      },
      issued_date: {
        type: Date,
      }
    }
  ]
});

module.exports = mongoose.model('AddStock', AddstockSchema);
