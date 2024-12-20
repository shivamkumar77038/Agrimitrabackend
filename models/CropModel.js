import mongoose from 'mongoose';


const cropSchema = new mongoose.Schema({

    farmer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Farmer",
        required:true
    },
    farmerName:{
        type:String,
        required:true
        
    },



    cropName:{
        type:String,
        required:true
        
    },

    quantity:{
        weight:{type:String},
        unit:{type:String}
    },

    category:{
        type:String,
        required:true
    },


    harvestedDate:{
        type:Date,
        required:true
    },

    pricePerunit :{
        price:{type:Number},
        unit:{type:String},
       
    },

   
    farmingMethod:{
        type:String,
        required:true
    },

    farmLocation:{
        address:{type:String},
        city:{type:String},
        state:{type:String},
        pincode:{type:Number},
        
    },

    bidder:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Retailer'
    },{timestamps:true}]



},{timestamps:true});

const Crop = mongoose.model("Crop",cropSchema);

export default Crop;