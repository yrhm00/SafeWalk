import {pool} from "../../database/database.js";
import * as productModel from "../model/productDB.js";

export const getProduct = async (req, res)=> {
   try {
       const produit = await productModel.readProduct(pool, req.params);
       if (produit) {
           res.send(produit);
       } else {
           res.sendStatus(404);
       }
   } catch (err) {
       res.sendStatus(500);
   }
};