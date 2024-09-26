const mongoose=require('mongoose');

const BillSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  total_gst: {
    type: Number,
    required: true,
  },
  include_gst: { // New field to indicate if GST is included
    type: Boolean,
    // required: true,
  },
  products: [
    {
      product_name: String,
      product_id: String,
      purchase_quantity: Number,
      product_price: Number,
      gst_rate: Number,
      cgst: Number,
      sgst: Number,
      total_price: Number,
      total_gst: Number,
    },
  ],
  bill_date: { 
    type: Date,
    default: Date.now,
  },
  invoice_no: {
    type: String,
  },
  pdf_url: { 
    type: String,
    required: true,
  },
  is_deleted:{
    type:Boolean,
    default:0

  }
});

module.exports = mongoose.model("Bill", BillSchema);
