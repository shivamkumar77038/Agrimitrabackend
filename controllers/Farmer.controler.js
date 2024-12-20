import Farmer from "../models/FarmerModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Crop from "../models/CropModel.js";
import CropProposal from "../models/RetailCropDemandModel.js";
import Contract from "../models/ContractModel.js";
import Retailer from "../models/RetailerModel.js";




// farmer signup function
const farmerSignUp = async(req,res)=>{

    const {name,email,password,phoneNo,farmingMethod,address,city,state,pincode,size,unit} = req.body;


     const userExist = await Farmer.findOne({gmail:email});


     if(userExist){

        return res.status(400).json({message:"User Exists"});

     }

     const hash = bcrypt.hashSync(password,Number(process.env.BCRYPT_ROUND));
     
     
    try{
        const user = await Farmer.create({
            name:name,
            gmail:email,
            password : hash,
            phoneNo:phoneNo,
            farmingMethod:farmingMethod,
            farmLocation:{
                address:address,
                city:city,
                state:state,
                pincode:Number(pincode)
            },
            famrsize:{
                size:Number(size),
                unit:unit
            }

        })
        const token = jwt.sign({gmail:user.gmail,id:user._id,role:user.role },process.env.JWT_SECKRET_KEY);
      

        return res.status(200).json({token:token,message:"Registered Successfully",user:{name:user.name,role:user.role}});

      
    }
    catch(error){
        console.log(error);
       return res.status(500).json(error)
    

    }
    }
  
// farmer login function
const farmerLogin = async(req,res)=>{
    const {email,password} = req.body ;
        const user = await Farmer.findOne({gmail:email})
        
        if(!user){
         console.log("user not found");
                return res.status(400).json({message:"User Not Found"});
        }
        try{
                
             const decryptPass = await bcrypt.compare(password,user.password);
             if(decryptPass){
                const token =   jwt.sign({gmail:user.gmail,id:user._id,role:user.role },process.env.JWT_SECKRET_KEY);
                  
                 return res.status(200).json({message:"Login Successfully",token:token,user:{name:user.name,role:user.role}});

             }else{
              
                return res.status(400).json({message:"Wrong Credentials"});
             }
             
              

        }catch(error){
         console.log("error found in retai login",error);
           return res.status(500).json("internal error");
           
             
        } 


}



//delete contract crop
const deletecrop = async(req,res)=>{
    try{
         const userid = req.user.id;
         const user = await Farmer.findById(id);
         if(!user){
           return  res.status(401).json({message:"You are Noy Authorised"})
         }

        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
           }
        const result = await Crop.findByIdAndDelete(id)
        if(result){
            res.status(200).json({message:"Crop Deleted Successfully"})
        }else{
            res.status(500).json({message:"internal server error"})
        }   



    }catch(error){
        console.log("error in proposal delete",error);
        res.status(500).json({message:"internal server error"})
    }

}

//applied for a proposal
const submitProposalRequest = async(req,res)=>{
    try{
         const cropid = req.params.id;
         const id = req.user.id;
         const user = await Farmer.findById(id);
         if(!user){
           return  res.status(401).json({message:"Log in as a farmer to access this option"})
         }
         
         const proposalcrop = await CropProposal.findById(cropid);
         if (!proposalcrop) {
            return res.status(404).json({ message: "Crop Proposal not found" });
          }



        if (proposalcrop.bidders.includes(id)){
            
            return res.status(400).json({ message: "You have already applied" });
            
            
        }else{

         proposalcrop.bidders.push(id);
         await proposalcrop.save();
         user.appliedProposal.push(cropid);
         await user.save();
         
          res.status(200).json({message:"Request Successfully Submitted"})
        }


    }catch(error){
        console.log("error in farmercontrol",error);
       res.status(500).json({message:"Internal Server Error"})
    }
}

// get All buyer request on a crop proposal
const GetallRequests = async(req,res)=>{
   try{  
            const userid = req.user.id;
            const user = await Farmer.findById(userid);
            if(!user){
            return  res.status(401).json({message:"You are Noy Authorised"})
            }
      
        const cropId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
           }
           

    // Find the crop and populate the bidder field
    const crop = await Crop.findById(cropId).populate({
        path: 'bidder',
        select : 'name gmail phoneNo locationInfo organization _id '
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.status(200).json({
      cropId: crop._id,
      cropName: crop.cropName,
      bidders: crop.bidder, 
    });

   }catch(error){
    console.log("error in getrequestFaremrControler",error)
    res.status(500).json({message:"Internal Server Error"});
   }

}

// signing contracts 
const signedContract = async(req,res)=>{
    try{
        const retailId = req.body.retailId;
        
        
        const cropid = req.params.id;
        const id = req.user.id;
        const user = await Farmer.findById(id);
        if(!user){
          return  res.status(401).json({message:"You are Noy Authorised"})
        }

        const crop = await Crop.findById(cropid);
       
        const retailer = await Retailer.findById(retailId)
       

        const contract = await Contract.create({
            cropName : crop.cropName,
            pricePerUnit:{
                price:Number(crop.pricePerunit.price),
                unit:crop.pricePerunit.unit
            },
           quantity:crop.quantity,
           farmerId : crop.farmer,
           retailerId : retailer._id,
           deliveryAddress: retailer.locationInfo,
           payment:"pending",
           farmingMethod : crop.farmingMethod,
           status : "pending"

        })

        await contract.save();
        
        await Crop.findByIdAndDelete(cropid);
        
        res.status(200).json({message:"Contract Created Sucessfully"});




    }catch(error){

        console.log("error in getrequestFaremrControler",error)
        res.status(500).json({message:"Internal Server Error"});

    }

}

//get all signed contracts
const getcontracts = async(req,res)=>{
    try{
         const id = req.user.id;
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
           }

           const user = await Farmer.findById(id);
           if(!user){
             return  res.status(401).json({message:"You are Noy Authorised"})
           }

          const constract = await Contract.find({farmerId : id});

          res.status(200).json(constract);



    }catch(error){

        console.log("error in farmercontrol",error);
       res.status(500).json({message:"Internal Server Error"})

    }

}

//get all apllied contracts
const aplliedProposals = async(req,res)=>{
    
    try{
        const id = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
           }
          
           const user1 = await Farmer.findById(id);
           if(!user1){
             return  res.status(401).json({message:"You are Noy Authorised"})
           }

        const user = await Farmer.findById(id).populate({
            path : 'appliedProposal',
            select : "cropName retailerName farmingMethod category quantity desiredPrice deliverydate deliverylocation "
          })
     

          res.status(200).json({
            proposaldetail : user.appliedProposal
          })


    }catch(error){
        
        console.log("error occured in apliedproposal in farmer conroller",error);
        res.status(500).json({message:"Internal Server Error"});

    }

   
}




export {farmerSignUp,farmerLogin,deletecrop,submitProposalRequest,GetallRequests,signedContract,getcontracts,aplliedProposals}
