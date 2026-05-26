import userController from "../controllers/user.controller.js";
import express from 'express'


const route = express.Router()

route.post('/registerUser', userController.userRegistration)

route.post('/loginUser', userController.loginUser)
route.post('/', userController.refreshToken)
route.post('/', userController.logOutUser)
route.post('/', userController.logOutAllDevices)

export default route;