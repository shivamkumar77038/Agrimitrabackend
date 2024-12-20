import express, { urlencoded } from 'express';
import dbconnect from './mongodbconnect/Dbconnect.js';
import dotenv from 'dotenv';
import cors from "cors";

// imported retailers routes 
import retailRoutes from './Routes/RetailerRoute.js';
import farmerRoutes from './Routes/FarmerRoute.js';
import CropRoute from './Routes/CropRoute.js';
import ProposalRoute from "./Routes/RetailProposal.js";


//imported farmers routes


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));


dotenv.config();
const port = process.env.PORT || 5000;

// database connection 
dbconnect();

app.get("/",(req,res)=>{
    res.send("hello world");
})

// retailer routes
app.use("/retail",retailRoutes);


//farmers routes
app.use("/farmer",farmerRoutes);

//crop routes
app.use("/crop",CropRoute);


//retailproposal routes
app.use("/retailProposal",ProposalRoute);






app.listen(port,()=>{
    console.log("server running on port 7000");
});