import mongoose from "mongoose";


// connecting mongodb a


const dbconnect = async ()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("mongodb connected successfully");
    }).catch((error)=>{
          console.log(`mongodb coonection error ${error}`)
    })
}



export default dbconnect;