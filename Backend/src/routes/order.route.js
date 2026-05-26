import express from 'express'
import orderController from '../controllers/order.controller.js'
import isUserLoggedIn from '../middlewares/auth.middleware.js'


const route = express.Router()

route.post('/',isUserLoggedIn,orderController.orderProduct)

export default route