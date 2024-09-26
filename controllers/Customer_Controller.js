const Customer = require("../models/Add_customer");

// -----------------------------------Add Customer--------------------------

const AddCutomer = async (req, res) => {
  const {
    cus_name,
    cus_mail,
    company_name,
    Locality,
    City,
    State,
    zip,
    GST,
    phone,
    Date,
    is_same_bill_ship,
    scus_name,
    scompany_name,
    scus_mail,
    sLocality,
    sCity,
    sState,
    szip,
    sGST,
    sphone,
  } = req.body;

  try {
    if (!zip && !cus_mail && !phone && !is_same_bill_ship) {
      res.status(400).json({
        error: false,
        message: "Something went wrong || Missing require feild",
      });
    }

    // ----------check billing client and ship client same or not
    if (!is_same_bill_ship) {
      if (!szip && sphone) {
        res.status(400).json({
          error: true,
          message: "something went wrong || missign ship details feild",
        });
      }
    }

    // -----------------------new cusotmer save-------------
    const NewCustomer = new Customer({
      cus_name,
      cus_mail,
      company_name,
      Locality,
      City,
      State,
      zip,
      GST,
      phone,
      Date,
      is_same_bill_ship,
      scus_name: is_same_bill_ship ? cus_name : scus_name,
      scompany_name: is_same_bill_ship ? company_name : scompany_name,
      scus_mail: is_same_bill_ship ? cus_mail : scus_mail,
      sLocality: is_same_bill_ship ? Locality : sLocality,
      sCity: is_same_bill_ship ? City : sCity,
      sState: is_same_bill_ship ? State : sState,
      szip: is_same_bill_ship ? zip : szip,
      sGST: is_same_bill_ship ? GST : sGST,
      sphone: is_same_bill_ship ? phone : sphone,
    });

    await NewCustomer.save();

    console.log("Customer Data we save", NewCustomer);
    res.status(200).json({
      error: false,
      message: "Customer addedd successfully",
      data: [NewCustomer],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Inter Server error",
    });
  }
};

// get all customer list

const GetCustomer = async (req, res) => {
  try {
    const getcus = await Customer.find({ is_deleted: { $ne: 1 } });
    if (getcus.length < 0) {
      res.status(400).json({
        error: true,
        message: "No Customer found",
      });
    }

    res.status(200).json({
      error: false,
      message: "All customers data..",
      data: [getcus],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ---------------------------------delete customers data------------------------------------

const DeleteCustomer=async(req,res)=>{

  const {id}=req.params;
  try{

    if(!id){
      res.status(400).json({
        error:false,
        message:"Something went wrong"
      })
    }

    const delcus=await Customer.findByIdAndUpdate(id,{is_deleted:1},{new:true});

    if(!delcus){
      res.status(404).json({
        error:true,
        message:"Customer not found"
      })
    }
    res.status(200).json({
      error:false,
      message:"Customer deleted successfully..",
      data:[delcus]
    })


  }catch(error){
    res.status(500).json({
      error:false,
      message:"Internal server error"
    })
  }
}

// --------------------------------get single customer------------------------------

const GetsingleCustomer=async(req,res)=>{
   const {id}=req.params;
   try{

    if(!id){
      res.status(400).json({
        error:true,
        message:"Something went wrong"
      })
    }
    const getcustomer=await Customer.findById(id);

    if(!getcustomer){
      res.status(404).json({
        error:true,
        message:"Customer not found"
      })
    }

    res.status(200).json({
      error:true,
      message:"Customer data find successfully..",
      data:[getcustomer]
    })




   }catch(error){
    res.status(500).json({
      error:true,
      message:"Internal server error"
    })
   }
}


// --------------------------update customer------------------------------


const Updatecustomer=async(req,res)=>{

const {id}=req.params;
const { cus_name,
  cus_mail,
  company_name,
  Locality,
  City,
  State,
  zip,
  GST,
  phone,
 
  is_same_bill_ship,
  scus_name,
  scompany_name,
  scus_mail,
  sLocality,
  sCity,
  sState,
  szip,
  sGST,
  sphone,}=req.body;

try{

  if (!is_same_bill_ship) {
    if (!szip && sphone) {
      res.status(400).json({
        error: true,
        message: "something went wrong || missign ship details feild",
      });
    }
  }

  const Updatecustomer={
    cus_name,
    cus_mail,
    company_name,
    Locality,
    City,
    State,
    zip,
    GST,
    phone,
    is_same_bill_ship,
    scus_name: is_same_bill_ship ? cus_name : scus_name,
    scompany_name: is_same_bill_ship ? company_name : scompany_name,
    scus_mail: is_same_bill_ship ? cus_mail : scus_mail,
    sLocality: is_same_bill_ship ? Locality : sLocality,
    sCity: is_same_bill_ship ? City : sCity,
    sState: is_same_bill_ship ? State : sState,
    szip: is_same_bill_ship ? zip : szip,
    sGST: is_same_bill_ship ? GST : sGST,
    sphone: is_same_bill_ship ? phone : sphone,
  }

  const upcustomers = await Customer.findByIdAndUpdate(id, Updatecustomer, { new: true });

  res.status(200).json({
    error:false,
    message:"Customer updated successfully",
    data:[upcustomers]
  })

}catch(error){
  res.status(500).json({
    error:true,
    messsage:"Internal server error"
  })
}

  

}

module.exports = { AddCutomer, GetCustomer,DeleteCustomer,GetsingleCustomer,Updatecustomer };
