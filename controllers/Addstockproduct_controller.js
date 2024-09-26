const Addstock = require('../models/Addstock');
const AddStock=require('../models/Addstock');

const Addstockproduct = async (req, res) => {
    const { product_id, product_name, product_quantity, product_price_unit } = req.body;

        try {
          // Check if required fields are provided
          if (!product_name || !product_id) {
            return res.status(400).json({
              error: true,
              message: "Missing required fields: product name or product ID",
            });
          }
      
          // Create a new stock entry with the initial stock and current date
          const Newstockadd = new AddStock({
            product_id,
            product_name,
            product_quantity,
            product_price_unit,
            initial_stock: product_quantity,  // Set the initial stock quantity
            initial_stock_date: new Date()    // Set the date when the stock is added
          });
      
          // Save the new stock product in the database
          await Newstockadd.save();
      
          return res.status(200).json({
            error: false,
            message: "Product added in stock successfully.",
            data: [Newstockadd]
          });
      
        } catch (error) {
          return res.status(500).json({
            error: true,
            message: "Internal server error"
          });
        }
      };
      

// --------------------------------------get all stock product list------------------------------

const Getallstockproduct=async (req,res)=>{

    try{

        const getproduct=await Addstock.find({is_deleted:{$ne:1}});
        
        if(!getproduct){
            return res.status(400).json({
                error:true,
                message:"Product not found"
            })
        }

        return res.status(200).json({
            error:false,
            message:"All stock product list here",
            data:[getproduct]
        })


    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal sever error"
        })
    }

}

// -----------------------------update stock product----------------------


const Updateproduct = async (req, res) => {
  const { id } = req.params;
  const {
      product_id,
      product_name,
      product_price_unit,
      initial_stock
  } = req.body;

  try {
      if (!id) {
          return res.status(404).json({
              error: true,
              message: "Something went wrong || id not found",
          });
      }

      if (!product_name && !initial_stock) {
          return res.status(400).json({
              error: true,
              message: "Something went wrong || missing required field",
          });
      }

      const existingProduct = await Addstock.findById(id);

      if (!existingProduct) {
          return res.status(404).json({
              error: true,
              message: "Product not found",
          });
      }

      
      const updatedProduct = {
          product_id,
          product_name,
          initial_stock,
          product_price_unit,
          
      };

      const productUpdate = await Addstock.findByIdAndUpdate(id, updatedProduct, {
          new: true,
      });

      return res.status(200).json({
          error: false,
          message: "Data Updated Successfully",
          data: [productUpdate],
      });
  } catch (error) {
      return res.status(500).json({
          error: true,
          message: "Internal server error",
      });
  }
};




// ---------------------------------delete stock product-------------------------

const Deletestockproduct=async (req,res)=>{


     const {id}=req.params;

     try{

        if(!id){
            return res.status(400).json({
            error:true,
            message:"Something went wrong || missing id"
            })
        }


        const productdata=await Addstock.findByIdAndUpdate(id,{is_deleted:1},{new:true});
        return res.status(200).json({
            error:false,
            message:"Product deleted successfully..",
            data:[productdata]
        })

     }catch(error)
     {
        return res.status(500).json({
            error:true,
            message:"Internal server  error"
        })
     }
}
// ------------------------------Issue stock--------------------------------

const IssueStock = async (req, res) => {
    const { id } = req.params; // Stock product ID
    const { issue_quantity } = req.body; // Quantity to issue
  
    try {
      // Find the product by ID
      const stockProduct = await AddStock.findById(id);
  
      if (!stockProduct) {
        return res.status(404).json({
          error: true,
          message: "Product not found",
        });
      }
  
      if (issue_quantity > stockProduct.product_quantity) {
        return res.status(400).json({
          error: true,
          message: "Insufficient stock to issue the requested quantity",
        });
      }
  
      // Update stock quantities and add issuance history
      stockProduct.product_quantity -= issue_quantity; // Reduce available quantity
      stockProduct.issued_stock_history.push({  // Add the issued quantity and date to the history
        issued_quantity: issue_quantity,
        issued_date: new Date()
      });
  
      await stockProduct.save();
  
      return res.status(200).json({
        error: false,
        message: "Stock issued successfully",
        data: stockProduct,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  };
  

module.exports={Addstockproduct,Getallstockproduct,Updateproduct,Deletestockproduct,IssueStock}