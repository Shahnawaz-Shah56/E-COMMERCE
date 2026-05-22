import { productModel } from "../models/product.model.js"

async function createProducts(req, res) {
    try {
        const { name, description, price, category, stock } = req.body

        const product = await productModel.create({
            name,
            description,
            price,
            category,
            stock
        })

        res.status(201).json({
            message: 'product created',
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

async function getProducts(req, res) {
    try {
        const id = req.params.id

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: 'product not found'
            })
        }

        res.status(200).json({
            message: 'product fetched',
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

async function deleteProducts(req, res) {
    try {
        const id = req.params.id

        const product = await productModel.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({
                message: 'product not found'
            })
        }

        res.status(200).json({
            message: 'product deleted'
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

async function patchProducts(req, res) {
    try {
        const id = req.params.id
        const updates = req.body

        const product = await productModel.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )

        if (!product) {
            return res.status(404).json({
                message: 'product not found'
            })
        }

        res.status(200).json({
            message: 'product updated',
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock
        })
    } catch (error) {
        res.status(500).json({
            message: 'some error occured',
            error: error.message
        })
    }
}

export default { createProducts, getProducts, deleteProducts, patchProducts }