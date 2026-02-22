const { Order } = require('../Schema')

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('restaurant', 'name image')
            .sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name image phone')
            .populate('items.product', 'name image')

        if (order && order.user.toString() === req.user._id.toString()) {
            res.json(order)
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            restaurant,
            items,
            deliveryAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            discount,
            tip,
            total,
            couponCode,
            notes
        } = req.body

        const order = await Order.create({
            user: req.user._id,
            restaurant,
            items,
            deliveryAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            discount,
            tip,
            total,
            couponCode,
            notes,
            status: 'placed'
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant')

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Check authorization: Admin or Restaurant Owner
        if (req.user.role !== 'admin') {
            const { Restaurant } = require('../Schema')
            const restaurant = await Restaurant.findOne({ owner: req.user._id })

            if (!restaurant || order.restaurant._id.toString() !== restaurant._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this order' })
            }
        }

        order.status = req.body.status || order.status

        if (req.body.status === 'confirmed') {
            order.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString()
        }

        if (req.body.status === 'delivered') {
            order.deliveredAt = Date.now()
            order.paymentStatus = 'paid'
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order && order.user.toString() === req.user._id.toString()) {
            if (['pending', 'placed', 'confirmed', 'accepted'].includes(order.status)) {
                order.status = 'cancelled'
                const updatedOrder = await order.save()
                res.json(updatedOrder)
            } else {
                res.status(400).json({ message: 'Cannot cancel order at this stage' })
            }
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get all orders (Admin) or Restaurant orders (Restaurant)
// @route   GET /api/orders/admin/all
// @access  Private/Admin/Restaurant
const getAllOrders = async (req, res) => {
    try {
        let query = {}

        // If user is restaurant owner, filter by their restaurant
        if (req.user.role === 'restaurant') {
            const { Restaurant } = require('../Schema')
            const restaurant = await Restaurant.findOne({ owner: req.user._id })

            if (!restaurant) {
                return res.json([])
            }
            query = { restaurant: restaurant._id }
        }
        // If not admin and not restaurant, reject
        else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get admin stats
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name')
            .populate('items.product', 'name price')

        const users = await require('../Schema').User.countDocuments()

        const totalOrders = orders.length
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0)
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

        // Calculate order status counts
        const orderStatus = {
            placed: 0,
            preparing: 0,
            out_for_delivery: 0,
            delivered: 0
        }

        orders.forEach(order => {
            const status = order.status === 'confirmed' ? 'placed' : order.status
            if (Object.prototype.hasOwnProperty.call(orderStatus, status)) {
                orderStatus[status]++
            }
        })

        // Get recent orders (Top 5)
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .lean()

        const formattedRecentOrders = recentOrders.map(order => ({
            id: order._id,
            customer: order.user ? order.user.name : 'Unknown',
            items: order.items ? order.items.length : 0,
            total: order.total,
            status: order.status === 'confirmed' ? 'placed' : order.status,
            time: new Date(order.createdAt).toLocaleDateString()
        }))

        // Calculate popular items
        const itemMap = {}
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const itemName = item.name || (item.product && item.product.name) || 'Unknown Item'
                    if (!itemMap[itemName]) {
                        itemMap[itemName] = { name: itemName, orders: 0, revenue: 0 }
                    }
                    itemMap[itemName].orders += item.quantity || 1
                    itemMap[itemName].revenue += (item.price || 0) * (item.quantity || 1)
                })
            }
        })

        const popularItems = Object.values(itemMap)
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 5)

        res.json({
            totalOrders,
            totalRevenue,
            totalUsers: users,
            avgOrderValue,
            orderStatus,
            recentOrders: formattedRecentOrders,
            popularItems
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getAdminStats
}
