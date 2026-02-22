const express = require('express')
const router = express.Router()
const {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getMyRestaurant,
    verifyDeliveryOtp
} = require('../controllers/restaurantController')
const { protect, admin } = require('../middleware/auth')

router.get('/', getRestaurants)
router.get('/my-restaurant', protect, getMyRestaurant) // Must be before /:id
router.get('/:id', getRestaurant)
router.post('/', protect, admin, createRestaurant)
router.put('/:id', protect, admin, updateRestaurant)
router.delete('/:id', protect, admin, deleteRestaurant)
router.post('/orders/:id/verify-otp', protect, verifyDeliveryOtp)

module.exports = router
