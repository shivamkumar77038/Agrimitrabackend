
import mongoose from 'mongoose';



const cropDemandSchema = new mongoose.Schema({
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer', 
    required: true,
  },

  cropName: {
    type: String,
    required: true,
  },

  retailerName: {
    type: String,
    required: true,
  },

  farmingMethod: {
    type: String,
    required: true,
  },

  category: {
    type: String, // e.g., "Vegetables", "Fruits", "Grains"
    
  },
 
  quantity: {
    weight: {type:Number},
    unit : {type:String},
  },


  desiredPrice: {
      price:{type:Number},
      unit:{type:String}
  },

  deliverydate : {
    type: Date, // Date by which the buyer wants delivery
  
  },
  deliverylocation: {
       address:{type:String},
       city:{type:String},
       State:{type:String},
       pincode:{type:String}

    },
  
 
  status: {
    type: String,
    enum: ['Open', 'Under Contract', 'Fulfilled'],
    default: 'Open',
  },

  description: {
    type: String, // Additional requirements or notes from the buyer
  },

  bidders:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Farmer"
  }],

  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CropProposal = mongoose.model('CropProposal', cropDemandSchema);

export default CropProposal;
