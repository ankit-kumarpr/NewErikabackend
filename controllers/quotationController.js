const Bill = require("../models/Quotation");
const Quotation = require("../models/add_bill_product");
const Customer = require("../models/Add_customer");
const generateBillPDF = require("../utils/genratebillpdf");
const path = require("path");
const numberToWords = require("number-to-words");




const Createfinalbill = async (req, res) => {
  const { client_id, bill_date, include_gst, clientData } = req.body; // clientData contains new customer info

  try {
    // Check if the client exists in the database
    let client = await Customer.findById(client_id);
    
    // If the client does not exist, create a new customer
    if (!client) {
      client = new Customer(clientData); // Create a new Customer instance
      await client.save(); // Save the new customer to the database
    }

    // Fetch quotations for the client
    const quotations = await Quotation.find({ client_id });

    let totalAmount = 0;
    let totalGST = 0;
    let totalGST18 = 0;

    // Process product details from quotations
    const productDetails = quotations.map((quotation) => {
      const { product_price, purchase_quantity } = quotation;
      const gstRate = include_gst ? 0.18 : 0; // Set GST rate based on user input
      const cgstRate = include_gst ? 0.09 : 0; // Set CGST rate based on user input
      const sgstRate = include_gst ? 0.09 : 0; // Set SGST rate based on user input

      const totalPrice = product_price; // Ensure total price is calculated correctly
      const cgst = totalPrice * cgstRate;
      const sgst = totalPrice * sgstRate;
      const totalGst = cgst + sgst;
      const totalGst18 = totalPrice * gstRate;

      totalAmount += totalPrice;
      totalGST += totalGst;
      totalGST18 += totalGst18;

      return {
        product_name: quotation.product_name,
        product_id: quotation.product_id,
        purchase_quantity,
        product_price,
        gst_rate: gstRate,
        cgst,
        sgst,
        total_price: totalPrice,
        total_gst: totalGst,
      };
    });

    // Generate invoice number
    const currentYearMonth = new Date(bill_date).toISOString().slice(0, 7).replace("-", "");
    const lastBill = await Bill.findOne({ invoice_no: new RegExp(`^erika${currentYearMonth}`) })
      .sort({ invoice_no: -1 })
      .exec();

    let invoiceSuffix = "01";
    if (lastBill) {
      const lastSuffix = parseInt(lastBill.invoice_no.slice(-2), 10);
      invoiceSuffix = (lastSuffix + 1).toString().padStart(2, "0");
    }
    const invoice_no = `erika${currentYearMonth}${invoiceSuffix}`;

    // Calculate the total amount and convert it to words
    const totalBillAmount = totalAmount + totalGST;
    const amountInWords = numberToWords.toWords(totalBillAmount);

    // Create new bill
    const newBill = new Bill({
      client_id: client._id, // Use the client ID from the existing or new client
      total_amount: totalBillAmount,
      total_gst: totalGST,
      products: productDetails,
      invoice_no,
      date: new Date(bill_date), // Use the user-defined date
    });

    // Define the file path for the PDF after creating the newBill
    const pdfPath = path.join(__dirname, "..", "uploadbillpdf", `bill_${newBill._id}.pdf`);
    
    // Generate the PDF
    await generateBillPDF(newBill, client, pdfPath);

    // Save the PDF URL in the newBill document
    newBill.pdf_url = `/uploadbillpdf/bill_${newBill._id}.pdf`; // Save the PDF URL
    await newBill.save(); // Save the bill with the PDF URL

    // Send the response with all required details
    res.status(201).json({
      error: false,
      message: "Bill created successfully",
      data: {
        bill: newBill,
        customer: client, // Return the customer details
        invoice_no: newBill.invoice_no,
        total_gst_18: totalGST18,
        amount_in_words: amountInWords,
        pdfUrl: newBill.pdf_url, // Return the PDF URL
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};




// /----------------------get all quotation data--------------------
const Getallbills = async (req, res) => {
  try {
    const bills = await Bill.find({ is_deleted: { $ne: 1 } }) 
      .populate('client_id') 
      .exec();

    if (!bills) { 
      return res.status(404).json({ error: true, message: "No bills found" });
    }

    res.status(200).json({
      error: false,
      message: "Bills fetched successfully",
      data: bills, 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};


// ----------------------------Delete Bill-----------------------
const Deleteeachbill = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Something went wrong",
    });
  }

  try {
    const delbill = await Bill.findByIdAndUpdate(
      id,
      { is_deleted: 1 }, 
      { new: true }
    );

    if (!delbill) {
      return res.status(404).json({
        error: true,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Quotation deleted successfully.",
      data: delbill,
    });

  } catch (error) {
    console.error("Error:", error); 
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ------------------------------------Revenu api------------------------------------

// ------------------------------------Revenue API------------------------------------
const GetMonthlyRevenue = async (req, res) => {
  const { startDate, endDate } = req.body; 

  // Validate date inputs
  if (!startDate || !endDate) {
    return res.status(400).json({
      error: true,
      message: "Start date and end date are required",
    });
  }

  try {
    
    const start = new Date(startDate);
    const end = new Date(endDate);

   
    const revenueData = await Bill.aggregate([
      {
        $match: {
          bill_date: {
            $gte: start,
            $lte: end,
          },
          is_deleted: { $ne: 1 } 
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$bill_date" },
            month: { $month: "$bill_date" }
          },
          totalRevenue: { $sum: "$total_amount" } 
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } 
      }
    ]);

    // Format the response to a more readable format
    const formattedRevenueData = revenueData.map(item => ({
      year: item._id.year,
      month: item._id.month,
      totalRevenue: item.totalRevenue
    }));

    res.status(200).json({
      error: false,
      message: "Monthly revenue calculated successfully",
      data: formattedRevenueData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};

// module.exports = { Createfinalbill, Getallbills, Deleteeachbill, GetMonthlyRevenue };





module.exports = { Createfinalbill,Getallbills,Deleteeachbill,GetMonthlyRevenue };
