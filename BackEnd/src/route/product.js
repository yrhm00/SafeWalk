import Router from 'express';
import {
    addProduct,
    updateProduct,
    getProduct, deleteProduct
} from "../controler/product.js";

const router = Router();

router.post("/", addProduct);
router.patch("/", updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;