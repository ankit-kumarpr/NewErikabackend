const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Import controllers
const {
  AddCutomer,
  GetCustomer,
  DeleteCustomer,
  GetsingleCustomer,
  Updatecustomer,
} = require("../controllers/Customer_Controller");
const {
  AddProduct,
  Getproducts,
  UpdateProduct,
  DeleteProduct,
  GetProductById,
} = require("../controllers/Product_Controller");
const {
  Quotationaddproduct,
} = require("../controllers/quotation_add_product_controller");

const {Billaddproduct}=require('../controllers/bill_add_product_controller');

const { createBill,Getallquotations,DeleteBill }=require('../controllers/billingController');



const { Createfinalbill,Getallbills,Deleteeachbill,GetMonthlyRevenue }=require('../controllers/quotationController');;

const {Addstockproduct,Getallstockproduct,Updateproduct,Deletestockproduct,IssueStock}=require("../controllers/Addstockproduct_controller");



// Multer file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path.join to ensure proper path resolution
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

// Customer routes
router.post("/addcus", AddCutomer);
router.get("/allcus", GetCustomer);
router.delete("/delcus/:id", DeleteCustomer);
router.get("/singlecus/:id", GetsingleCustomer);
router.put("/updatecus/:id", Updatecustomer);

// Product routes with file upload
router.post("/addproduct", upload.single("product_image"), AddProduct);
router.get("/getproductlist", Getproducts);
router.put("/updateproduct/:id", upload.single("product_image"), UpdateProduct);
router.delete("/deleteproduct/:id", DeleteProduct);
router.get("/getsingleproduct/:id", GetProductById);

// -------------------Quotation product routes------------------

router.post("/selectproducts", Quotationaddproduct);

router.post('/bill',createBill);
router.get('/allquo',Getallquotations);
router.delete('/quodel/:id',DeleteBill);



// --------------------------------------Bill products routes-------------------------

router.post('/selectbillpro',Billaddproduct);


router.post("/realbill",Createfinalbill);
router.get("/allbill",Getallbills);
router.delete("/billdel/:id",Deleteeachbill);


// --------------------------------stock product routes-----------------------

router.post("/addstock",Addstockproduct);
router.get("/getstockproductlist",Getallstockproduct);
router.put("/updatestockproduct/:id",Updateproduct);
router.delete('/delstockpro/:id',Deletestockproduct);

router.post('/issuestock/:id', IssueStock);

// --------------------------------revenu router-------------------------

router.post('/getrevenu',GetMonthlyRevenue );


module.exports = router;
