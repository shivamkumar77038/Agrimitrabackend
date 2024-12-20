import mongoose from 'mongoose';

const FarmerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

     gmail:{
          type:String,
          required:true,
          unique:true
     },

     password:{
        type:String,
        required:true
     },

     phoneNo:{
        type:String,
        required:true,
        
     },
     role: {
        type: String,
        default: 'Farmer'  
      },


     farmLocation: {
        address : {type:String,required:true},
        city:{type:String},
        state:{type:String},
        pincode:{type:Number}   
     },

     farmSize:{
      size:{type:Number},
      unit:{type:String}
     },

     farmingMethod:{
        type:String,
     },
      

     // adding contracts
     contracts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Contract'
     }],
        
     crops:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Crop'
   }],

   appliedProposal :[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"CropProposal"
      }
   ],



     registrationDate: {
        type: Date,
        default: Date.now 
      }


})
const Farmer = mongoose.model("Farmer",FarmerSchema);
export default Farmer;