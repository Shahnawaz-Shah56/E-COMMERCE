import cookieParser from 'cookie-parser'
import express from 'express'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import orderRoute from './routes/order.route.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', userRoute)
app.use('/api/products', productRoute)
app.use('/api/order', orderRoute)
export default app;