import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
         trim: true
    },
    password:{
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: ''
    }
})

export const userModel = mongoose.model('user' , userSchema)