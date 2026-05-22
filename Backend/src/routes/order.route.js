import express from 'express'
import orderController from '../controllers/order.controller.js'


const route = express.Router()

route.post('/', orderController.orderProduct)

export default route