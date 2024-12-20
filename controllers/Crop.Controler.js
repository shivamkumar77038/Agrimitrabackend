import Crop from "../models/CropModel.js";
import Farmer from "../models/FarmerModel.js";



//crop listing
const cropListing = async(req,res)=>{

    const loginuser = req.user;
    
      
    const user = await Farmer.findById(loginuser.id);
    if(!user){
        res.status(400).json({message:"You are not Authorised"});
    }
   
    const {cropName,weight,weightunit,category,harvestedDate,price,unit,farmingMethod} = req.body;      

    try{
        const crop = await Crop.create({
            farmer : user._id,
            farmerName : user.name,
            cropName:cropName,
            quantity:{
                weight:Number(weight),
                unit: weightunit
            },
            category:category,
            harvestedDate: harvestedDate,

            pricePerunit:{
                price:Number(price),
                unit:unit
            },
            farmingMethod:farmingMethod,
            farmLocation: user.farmLocation
        })
        

        user.crops.push(crop._id);
        await user.save();
        
        res.status(200).json({message:"Crop Listed Successfully"});


    }catch(error){
          console.log("error in cropListing",error);
          res.status(500).json({message:"internal server error"})
    }
        
}

//get all listed crops
const allListedCrops = async (req,res)=>{
 
    try{
    const loginuser = req.user.id;   
    
   const user =  await Farmer.findById(loginuser);
   
    if(!user){
        res.status(400).json({message:"You are not Authorised"});
    }

   
        const allcrop = await Crop.find({farmer:user._id});
        res.status(200).json(allcrop);


    }catch(error){
        console.log("error in allListedcrops in crop controller",error);
        res.status(500).json({message:"internal server error"})
    }

}

// all available proposed crop
const allProposedCrop = async(req,res)=>{
    try{
        const allcrop = await Crop.find();
        res.status(200).json(allcrop);


    }catch(error){
        console.log("error in gettingAllProposedCrop",error);
        res.status(500).json({message:"internal server error"})
    }
}
export {cropListing,allListedCrops,allProposedCrop};