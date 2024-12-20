import mongoose from 'mongoose';



const RetailerSchema = new mongoose.Schema({
        name :{
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
        
        role: {
            type: String,
            default: 'Retailer'  
          },
       
        phoneNo:{
            type:Number,
           
        },

        

        organization:{
            type:String
        },

        locationInfo:{
            address:{type:String},
            city:{type:String},
            state:{type:String},
            pincode:{type:Number}
           
        },
        contracts:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Contract'
             }],

         porposals:[{
               type:mongoose.Schema.Types.ObjectId,
               ref:'CropProposal'
            }],    

        // adding contract fields for tracking contracts
        AppliedCrops:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Crop'
        }],

        



        registrationDate:{
            type:Date,
            default:Date.now()
        }
      


  
});

const Retailer = mongoose.model("Retailer",RetailerSchema);
export default Retailer;

