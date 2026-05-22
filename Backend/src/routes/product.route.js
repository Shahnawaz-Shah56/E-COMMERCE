import productController from "../controllers/product.controller.js";
import express from 'express'


const route = express.Router()


route.post('/', productController.createProducts)
route.get('/:id', productController.getProducts)
route.delete('/:id', productController.deleteProducts)


export default route
