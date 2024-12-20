import mongoose from 'mongoose';

const ContractSchema = mongoose.Schema({
    cropName : {type:String,
                required : true},

    pricePerUnit:{
        price:{type:Number},
        unit:{type:String}
    },
    quantity:{
        weight:{type:Number},
        unit:{type:String}
    },
    farmerId:{type:mongoose.Schema.Types.ObjectId,ref:"Farmer"},

    retailerId:{type:mongoose.Schema.Types.ObjectId,ref:"Retailer"},

    farmingMethod:{
        type : String
    },

    deliverDate:{type:Date},

    deliveryAddress:{
        address:{type:String},
        city:{type:String},
        state:{type:String},
        pincode:{type:Number}
    },

    payment:{
        type:String,
        enum :["pending","Paid"]
    },

  
    status:{
        type:String,
        enum:["pending","fulfilled"],
        default: "pending",
    }








},{timestamps:true})

const Contract = mongoose.model("Contract",ContractSchema);






export default Contract ;


