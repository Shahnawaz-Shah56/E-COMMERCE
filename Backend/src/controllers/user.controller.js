import { userModel } from "../models/user.model.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from "../config/env.js";

async function userRegistration(req, res) {
    try {
        
    
    const { username, email, password } = req.body;

    const doesUserExist = await userModel.find(
    {
        $or:[
            {username}, {email}
        ]
    }
    )
    if(doesUserExist){
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

    const token = jwt.sign({username: user.username, _id: user._id },JWT_TOKEN)

    res.cookie('token', token)

    res.status(201).json({
        message: 'user registered successfully',
        _id: user._id,
        username: user.username,
        email: user.email
    })
    } catch (error) {
        res.status(500).json({
            message:'some error occured', error: error.message
        })
    }
}

async function loginUser(req, res){
    try {
        
    
    const { username, email, password} = req.body

    const isUserValid = await userModel.findOne({
        $or:[
            { username }, { email }
        ]
    })

    if(!isUserValid){
     return  res.status(403).json({
            message: 'wrong credentials'
        })
    }

    const verifyPassword = await bcrypt.compare(password, isUserValid.password)

    if(!verifyPassword){
        return res.status(403).json({
            message: 'wrong credentials'
        })
    }

    const token = jwt.sign({
        _id: isUserValid._id, username: isUserValid.username
    }, JWT_TOKEN)

    res.cookie('token', token)

    res.status(200).json({
        message: 'user logged in successfully', 
        _id: isUserValid._id,
        username: isUserValid.username,
        email: isUserValid.email
    })


    } catch (error) {
        res.status(500).json({
            message:'some err occured', error: error.message
        })
    }
}

export default { userRegistration, loginUser }