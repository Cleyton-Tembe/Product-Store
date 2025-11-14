import { Router } from "express";
import { addProduct, deleteProduct, getAll, updateProduct } from "../Controller/products.js";

const route = Router()


route.get('/All', getAll)

route.post("", addProduct)

route.patch("/update/:id", updateProduct)

route.delete('/delete/:id', deleteProduct)

export default route;