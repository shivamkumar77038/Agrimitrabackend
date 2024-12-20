
import express from 'express';
const Router = express.Router();
import {Authmiddleware} from '../middleware/Auth.middleware.js'
import { retailerSignUp ,retailerLogin,demandlist,getCropProposal,deleteProposal,getfarmerequest,signeContract,getcontracts,appliedCrops } from '../controllers/RetailerController.js';


Router.post("/signup",retailerSignUp)

Router.post("/login",retailerLogin)

Router.post('/listdemand',Authmiddleware,demandlist);

Router.get('/getAllCropProposals',Authmiddleware,getCropProposal)

Router.delete('/delete/:id',Authmiddleware,deleteProposal);

Router.get('/getFarmersRequest/:id',Authmiddleware,getfarmerequest);

Router.post('/signeContract/:id',Authmiddleware,signeContract);

Router.get('/getContracts',Authmiddleware,getcontracts);

Router.get('/getAppliedCrops',Authmiddleware,appliedCrops);


export default Router ;