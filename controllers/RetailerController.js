
import Retailer from "../models/RetailerModel.js";
import Farmer from "../models/FarmerModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import CropProposal from "../models/RetailCropDemandModel.js";
import Contract from "../models/ContractModel.js";
import Crop from "../models/CropModel.js";




//Retailer signup controler
const retailerSignUp =  async (req,res)=>{
    
     const {name,email,password,phoneNo,organization,address,city,state,pincode} = req.body;


     const userExist = await Retailer.findOne({gmail:email});

     if(userExist){

         res.status(400).json("User Exists");
      return;

     }
     const hash = bcrypt.hashSync(password,Number(process.env.BCRYPT_ROUND));

     //Addding more imformation to register;
    try{
        const user = await Retailer.create({
            name:name,
            gmail:email,
            password : hash,
            phoneNo,
            organization,
            locationInfo:{
               address:address,
               city:city,
               state:state,
               pincode:Number(pincode)
              
           },
        })

        const token =   jwt.sign({gmail:user.gmail,id:user._id},process.env.JWT_SECKRET_KEY);
        

        return res.status(200).json({message:"Registered Successfully",token:token,user:{name:user.name,role:user.role}});
      
    }
    
    catch(error){
       return res.status(500).json(error)
    }
    
     
    }

// Retailer login controler
 const retailerLogin = async(req,res)=>{
        const {email,password} = req.body ;
        const user = await Retailer.findOne({gmail:email})
        
        if(!user){
         
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

 //Retail DemandListing Controller
 const demandlist = async(req,res)=>{
   const loginuser = req.user;
    
      
    const user = await Retailer.findById(loginuser.id);
    if(!user){
          
        res.status(400).json({message:"You are not Authorised"});
        
    }
   
    const {cropName,category,weight,weightunit,farmingMethod,price,unit,deliverydate,address,state,city,pincode} = req.body;      

    try{
        const demand = await CropProposal.create({
            retailer:user._id,
            retailerName:user.name,
            cropName:cropName,
            category:category,
            farmingMethod:farmingMethod,
            quantity:{
               weight:Number(weight),
               unit:weightunit,
            },
            desiredPrice:{
               price:Number(price),
               unit:unit,
            },
            deliverydate:deliverydate,

            deliverylocation: {
               adrress:address,
               city:city,
               State:state,
               pincode:Number(pincode)
        
            },


        })
      

      
        
        res.status(200).json({message:"Proposal Listed Successfully"});


    }catch(error){
          console.log("error in ProposalListing",error);
          res.status(500).json({message:"internal server error"})
    }

 }

 //Reatil get all crop proposals
 const getCropProposal = async(req,res)=>{
   const loginuser = req.user;
   const user = await Retailer.findById(loginuser.id);
   if(!user){
       res.status(400).json({message:"You are not Authorised"});
   }

   try{
      const allProposals = await CropProposal.find({retailer :user._id});
      
      res.status(200).json(allProposals);

   }catch(error){
      console.log("error in gettingallProposals",error);
        res.status(500).json({message:"internal server error"})
   }

 }

 //delete proposals
 const deleteProposal = async(req,res)=>{
    try {
      const userid = req.user.id
      const id = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: 'Invalid ID format' });
        }

        const user = await Retailer.findById(userid);
        if(!user){
              
            res.status(400).json({message:"You are not Authorised"});
            
        }
   
       // Delete the document by ID
       const result = await CropProposal.findByIdAndDelete(id);
   
       if (!result) {
         return res.status(404).json({ message: 'Proposal not found' });
        }
   
       res.status(200).json({ message: 'Proposal deleted successfully' });
      
    }catch(error){
      console.log("error in proposal delete",error);
      res.status(500).json({message:"internal server error"})
    }
 }


 
    // get All farmer request on a crop proposal

 const getfarmerequest = async(req,res)=>{
  try{
        const ProposalId = req.params.id;
        const userid = req.user.id ;
        const user = await Retailer.findById(userid);
        if(!user){
              
            res.status(400).json({message:"You are not Authorised"});
            
        }

        if (!mongoose.Types.ObjectId.isValid(ProposalId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
           }
           

    // Find the crop and populate the bidder field
    const proposal = await CropProposal.findById(ProposalId).populate({
        path: 'bidders',
        select : 'name gmail phoneNo  farmLocation farmingMethod _id ' 
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.status(200).json({
      proposalId: proposal._id,
      cropName: proposal.cropName,
      bidders: proposal.bidders, 
    });

   }catch(error){

  }
  


 }

 // contract signing
 const signeContract = async(req,res)=>{
   try{
      const farmerId = req.body.farmerId;
      
      
      const ProposalId = req.params.id;
      const id = req.user.id;
      const user = await Retailer.findById(id);
      if(!user){
        return  res.status(401).json({message:"You are Noy Authorised"})
      }

      const Proposal = await CropProposal.findById(ProposalId);
     
      const farmer = await Farmer.findById(farmerId)
     

      const contract = await Contract.create({
          cropName : Proposal.cropName,
          pricePerUnit:{
              price:Number(Proposal.desiredPrice.price),
              unit:Proposal.desiredPrice.unit
          },
         quantity:Proposal.quantity,
         farmerId : farmer._id,
         deliveryDate : Proposal.deliverydate,
         retailerId : id,
         deliveryAddress: Proposal.deliverylocation,
         payment:"pending",
         farmingMethod : Proposal.farmingMethod,
         status : "pending"

      })

      await contract.save();

      await CropProposal.findByIdAndDelete(ProposalId);

      res.status(200).json({message:"Contract Created Sucessfully"});




  }catch(error){

      console.log("error in reatil sign contract",error)
      res.status(500).json({message:"Internal Server Error"});

  }

 }

 const getcontracts = async(req,res)=>{
   try{
      const id = req.user.id;

        const user = await Retailer.findById(id);
        if(!user){
          return  res.status(401).json({message:"You are Noy Authorised"})
        }

       const constract = await Contract.find({retailerId : user._id});
       

       res.status(200).json(constract);

   }catch(error){

      console.log("error in farmercontrol",error);
      res.status(500).json({message:"Internal Server Error"})

   }
   }

   // get al applied crops proposal

   const appliedCrops = async(req,res)=>{
    
    try {
      // Validate user ID
      const userId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({  message: 'Invalid user ID format.' });
      }
  
      // Find retailer by ID
      const retailer = await Retailer.findById(userId);
      
      if (!retailer) {
        return res.status(403).json({  message: 'Unauthorized access.' });
      }
  
      // Populate the applied crops
      const retailerWithCrops = await Retailer.findById(userId).populate({
        path: 'AppliedCrops',
        select: 'cropName farmerName farmingMethod category quantity pricePerunit farmLocation harvestedDate',
      });
  
      if (!retailerWithCrops || !retailerWithCrops.AppliedCrops) {
        return res.status(404).json({  message: 'No applied crops found.' });
      }
  
      // Respond with the populated crops
      res.status(200).json({
        proposaldetail: retailerWithCrops.AppliedCrops,
      });
    } catch (error) {
      console.error('Error in retailer appliedCrops controller:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  
     
  }

    export   {retailerSignUp,retailerLogin,demandlist,getCropProposal,deleteProposal,getfarmerequest,signeContract,getcontracts,appliedCrops};