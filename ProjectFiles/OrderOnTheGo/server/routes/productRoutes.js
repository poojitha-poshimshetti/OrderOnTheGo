const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProductsByRestaurant,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/auth')

router.get('/', getProducts)
router.get('/restaurant/:restaurantId', getProductsByRestaurant)
router.get('/:id', getProduct)
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

module.exports = router
