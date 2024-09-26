const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  cus_name: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
  },
  cus_mail: {
    type: String,
    required: true,
  },
  Locality: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  GST: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  is_same_bill_ship: {
    type: Boolean,
    default: true,
  },
  scus_name: {
    type: String,
  },
  scompany_name: {
    type: String,
  },
  scus_mail: {
    type: String,
  },
  sLocality: {
    type: String,
  },
  sCity: {
    type: String,
  },
  sState: {
    type: String,
  },
  szip: {
    type: Number,
    minlength: 6,
    maxlength: 6,
  },
  sGST: {
    type: String,
  },
  sphone: {
    type: Number,
  },
  is_deleted: {
    type: Boolean,
    default: 0,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
