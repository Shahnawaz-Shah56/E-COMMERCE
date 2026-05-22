import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
                , required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
totalPrice: {
    type: Number,
    required: true
},
status: {
    type: String,
    default: 'pending'
},
address: {
    type: String,
    required: true
},

}, {timestamps: true})

export const orderModel = mongoose.model(
    'order', orderSchema
)