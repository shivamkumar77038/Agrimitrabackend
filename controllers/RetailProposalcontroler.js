import CropProposal from "../models/RetailCropDemandModel.js";
import Crop from "../models/CropModel.js";
import Retailer from "../models/RetailerModel.js";

const getAllavailableProposal = async(req,res)=>{
    
        try{
            const allcrop = await CropProposal.find();
            res.status(200).json(allcrop);
    
        }catch(error){
            console.log("error in gettingAllProposedCrop",error);
            res.status(500).json({message:"internal server error"})
        }


}

const submitProposal = async(req,res)=>{
    try{
         const cropid = req.params.id;
         const id = req.user.id;
         const user = await Retailer.findById(id);
         if(!user){
           return  res.status(401).json({message:"Login as a retailer to access this option"})
         }
         
         const proposalcrop = await Crop.findById(cropid);
         if (!proposalcrop) {
            return res.status(404).json({ message: "Crop not found" });
          }
       

        if (proposalcrop.bidder.includes(id)){
            return res.status(400).json({ message: "You have already applied" });
        }else{

         proposalcrop.bidder.push(id);
         await proposalcrop.save();

         user.AppliedCrops.push(cropid);
         await user.save();
    
          res.status(200).json({message:"Request Successfully Submitted"})
        }


    }catch(error){
        console.log("error in Reatilproposal",error);
       res.status(500).json({message:"Internal Server Error"})
    }
}


export {getAllavailableProposal,submitProposal};