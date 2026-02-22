const express = require('express')
const router = express.Router()
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getAdminStats
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/auth')

router.get('/', protect, getOrders)
router.get('/admin/all', protect, getAllOrders)
router.get('/admin/stats', protect, admin, getAdminStats)
router.get('/:id', protect, getOrder)
router.post('/', protect, createOrder)
router.put('/:id/status', protect, updateOrderStatus)
router.put('/:id/cancel', protect, cancelOrder)

module.exports = router
