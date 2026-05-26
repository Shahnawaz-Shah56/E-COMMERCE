import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:[true, "user is required"]
    },
    refreshToken:{
        type: String,
        required: true
    },
    ip:{
        type:String,
        required: true
    },
    userAgent:{
        type: String
        
    },
    revoked:{
        type:Boolean,
        default: false
    }
},{ timestamps:true})
export const sessionModel = mongoose.model('sessions', sessionSchema)