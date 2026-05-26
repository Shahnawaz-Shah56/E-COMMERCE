import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from '../config/env.js'
import { userModel } from '../models/user.model.js'
import { sessionModel } from '../models/session.model.js'

const isUserLoggedIn = async function(req, res, next) {
    try {
        // get access token from header
        const accessToken = req.headers.authorization?.split(" ")[1]

        if (!accessToken) {
            return res.status(401).json({
                message: 'please login first'
            })
        }

        const decoded = jwt.verify(accessToken, JWT_TOKEN)

        // check session exists and not revoked
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            revoked: false
        })

        if (!session) {
            return res.status(401).json({
                message: 'session expired please login again'
            })
        }

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: 'user not found'
            })
        }

        req.user = user
        next()

    } catch (error) {
        res.status(401).json({
            message: 'invalid token'
        })
    }
}

export default isUserLoggedIn