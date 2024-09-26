const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const mogourl = process.env.MONGO_URL;

mongoose.connect(mogourl, {})
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
