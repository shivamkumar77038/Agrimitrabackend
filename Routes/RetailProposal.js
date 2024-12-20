import express from "express";
import { Authmiddleware } from "../middleware/Auth.middleware.js";

const Router = express.Router();
import { getAllavailableProposal,submitProposal } from "../controllers/RetailProposalcontroler.js";


Router.get("/getAllavailableProposal",getAllavailableProposal)
Router.post("/crop/:id",Authmiddleware,submitProposal)


export default Router ;