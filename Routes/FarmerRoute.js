import express from 'express';
const Router = express.Router();
import {Authmiddleware} from '../middleware/Auth.middleware.js'
import { farmerSignUp,farmerLogin,deletecrop,submitProposalRequest,GetallRequests,signedContract,getcontracts,aplliedProposals} from '../controllers/Farmer.controler.js';

Router.post('/signup',farmerSignUp);
Router.post('/login',farmerLogin);
Router.delete('/delete/:id',Authmiddleware,deletecrop);
Router.post('/Proposal/:id',Authmiddleware,submitProposalRequest);
Router.get('/getBuyersRequest/:id',Authmiddleware,GetallRequests);
Router.post('/signeContract/:id',Authmiddleware,signedContract);
Router.get('/getContracts',Authmiddleware,getcontracts);
Router.get('/getallAplliedProposals',Authmiddleware,aplliedProposals);





export default Router ;