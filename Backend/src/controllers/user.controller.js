import { userModel } from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from "../config/env.js";
import { registerSchema, loginSchema } from '../validators/user.validator.js'
import { sessionModel } from "../models/session.model.js";

async function userRegistration(req, res) {
    try {
        
        const result = registerSchema.safeParse(req.body)
        if(!result.success){
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

    const { username, email, password } = req.body;

    const doesUserExist = await userModel.findOne({
        $or:[
            { username }, { email }
        ]
    })

    if (doesUserExist) {
        return res.status(403).json({
            message: 'user already exists'
        })
    }

    const hashedPassword = await  bcrypt.hash(password , 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const refreshToken = jwt.sign({id: user._id},JWT_TOKEN,{expiresIn:"7d"})

    const session = await sessionModel.create({
        user: user._id,
        refreshToken,
        ip: req.ip,
        userAgent: req.headers["user-Agent"],
        revoked:false
    })

    const accessToken = jwt.sign({id: user._id, sessionId: session._id },JWT_TOKEN,{expiresIn:"15m"})
    
    

    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: 'user registered successfully',
        _id: user._id,
        username: user.username,
        email: user.email,
        accessToken
    })
    } catch (error) {
        res.status(500).json({
            message:'some error occured', error: error.message
        })
    }
}

async function loginUser(req, res){
    try {
        
        const result = loginSchema.safeParse(req.body)
if(!result.success){
    return res.status(400).json({
        message: result.error.issues[0].message
    })
}
    
    const { username, email, password } = req.body

    const isUserValid = await userModel.findOne({
        $or:[
            { username }, { email }
        ]
    })

    if (!isUserValid) {
        return res.status(403).json({
            message: 'wrong credentials'
        })
    }

    const verifyPassword = await bcrypt.compare(password, isUserValid.password)

    if(!verifyPassword){
        return res.status(403).json({
            message: 'wrong credentials'
        })
    }
  
const refreshToken = jwt.sign({ id: isUserValid._id }, JWT_TOKEN, { expiresIn: "7d" })

  const session = await sessionModel.create({
        user: user._id,
        refreshToken,
        ip: req.ip,
        userAgent: req.headers["user-Agent"],
        revoked:false
    })

      const accessToken = jwt.sign({ id: isUserValid._id }, JWT_TOKEN, { expiresIn: "15m" })

await userModel.findbyIdAndUpdate(isUserValid._id, { refreshToken })

res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
})

res.status(200).json({
    message: 'user logged in successfully',
    _id: isUserValid._id,
    username: isUserValid.username,
    email: isUserValid.email,
    accessToken
})

    } catch (error) {
        res.status(500).json({
            message:'some err occured', error: error.message
        })
    }
}

async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message: "refreshToken is missing"
            })
        }

        const decoded = jwt.verify(refreshToken, JWT_TOKEN)

        // find session in DB
        const session = await sessionModel.findOne({
            refreshToken,
            revoked: false
        })

        if (!session) {
            return res.status(401).json({
                message: "invalid or expired token"
            })
        }

        // create new tokens
        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            JWT_TOKEN,
            { expiresIn: "7d" }
        )

        // update session with new refresh token
        session.refreshToken = newRefreshToken
        await session.save()

        const accessToken = jwt.sign(
            { id: decoded.id, sessionId: session._id },
            JWT_TOKEN,
            { expiresIn: "15m" }
        )

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "accessToken fetched successfully",
            accessToken
        })
    } catch (error) {
        res.status(500).json({
            message: "some error occured",
            error: error.message
        })
    }
}
async function logOutUser(req, res){
    try {
        
   
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({
            message:'Token is missing'
        })
    }
    const session = await sessionModel.findOne({
        refreshToken,
        revoked: false
    })
    if(!session){
        return res.status(401).json({
            message: 'invalid token'
        })
    }
    session.revoked = true
    await session.save()
    res.clearCookie('refreshToken')
    res.status(200).json({
        message:'loggedOut successfully'
    })

     } catch (error) {
        res.status(500).json({
            message:'some error occured', error: error.message
        })
    }
}

async function logOutAllDevices(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Token is missing'
            })
        }

        await sessionModel.updateMany(
            { user: req.user._id },
            { revoked: true }
        )

        res.clearCookie('refreshToken')

        res.status(200).json({
            message: 'Logged out from all devices successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

export default { userRegistration, loginUser, refreshToken, logOutUser, logOutAllDevices };