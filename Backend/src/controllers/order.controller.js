import { orderModel } from "../models/order.model.js"
import { productModel } from "../models/product.model.js"

async function orderProduct(req, res) {
    try {
        const { productId, quantity, address } = req.body

        // get product to calculate total price
        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: 'product not found'
            })
        }

        const totalPrice = product.price * quantity

        const order = await orderModel.create({
            products: [{ product: productId, quantity }],
            receiver: req.user._id,
            totalPrice,
            address
        })

        res.status(201).json({
            message: 'order placed successfully',
            _id: order._id,
            totalPrice: order.totalPrice,
            status: order.status,
            address: order.address
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

export default { orderProduct }