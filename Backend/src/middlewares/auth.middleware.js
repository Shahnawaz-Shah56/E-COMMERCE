import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from '../config/env.js'
import { userModel } from '../models/user.model.js'

const isUserLoggedIn = async function(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: 'create account to make orders'
            })
        }

        const decodedToken = jwt.verify(token, JWT_TOKEN)

        const user = await userModel.findById(decodedToken._id)
        req.user = user

        next()
    } catch (error) {
        res.status(401).json({
            message: 'invalid token'
        })
    }
}

export default isUserLoggedIn