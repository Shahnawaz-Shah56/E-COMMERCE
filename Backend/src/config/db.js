import mongoose from 'mongoose'
import  { MONGO_URI, DB_NAME } from './env.js'



async function connectDB(){
    try {
        
    
    mongoose.connect(`${ MONGO_URI }/${ DB_NAME }`)
    console.log('db connected')

    } catch (error) {
        console.log('db failed to connect', error)
        process.exit(1)
    }

}

export default connectDB