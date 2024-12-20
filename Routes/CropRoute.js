import express from 'express';
import { Authmiddleware } from '../middleware/Auth.middleware.js';
import { cropListing ,allListedCrops,allProposedCrop} from '../controllers/Crop.Controler.js';

const Router = express.Router();



Router.post("/croplist",Authmiddleware,cropListing);
Router.get("/getListedCrops",Authmiddleware,allListedCrops);
Router.get("/getAllavailableCrops",allProposedCrop);




export default Router ;