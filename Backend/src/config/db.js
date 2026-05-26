import mongoose from 'mongoose'
import { MONGO_URI } from './env.js'

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('db connected ✅')
    } catch (error) {
        console.log('db failed to connect ❌', error)
        process.exit(1)
    }
}

export default connectDB