const express = require('express')
const router = express.Router()
const {
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    toggleFavorite,
    toggleFavoriteDish,
    addPaymentMethod,
    deletePaymentMethod,
    getPaymentMethods
} = require('../controllers/userController')
const { protect } = require('../middleware/auth')

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/address', protect, addAddress)
router.delete('/address/:id', protect, deleteAddress)
router.post('/favorites/:restaurantId', protect, toggleFavorite)
router.post('/favorite-dishes/:productId', protect, toggleFavoriteDish)

// Payment Methods
router.get('/payment-methods', protect, getPaymentMethods)
router.post('/payment-methods', protect, addPaymentMethod)
router.delete('/payment-methods/:id', protect, deletePaymentMethod)

module.exports = router
