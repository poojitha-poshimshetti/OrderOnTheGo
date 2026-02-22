const { Restaurant, Order } = require('../Schema')

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
    try {
        const { cuisine, isOpen, isPureVeg, featured, search, sort } = req.query

        let query = {}

        if (cuisine) query.cuisine = { $in: cuisine.split(',') }
        if (isOpen === 'true') query.isOpen = true
        if (isPureVeg === 'true') query.isPureVeg = true
        if (featured === 'true') query.isFeatured = true
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } }
            ]
        }

        let sortOption = {}
        if (sort === 'rating') sortOption = { rating: -1 }
        else if (sort === 'delivery') sortOption = { deliveryTime: 1 }
        else if (sort === 'name') sortOption = { name: 1 }
        else sortOption = { createdAt: -1 }

        const restaurants = await Restaurant.find(query).sort(sortOption)
        res.json(restaurants)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)

        if (restaurant) {
            res.json(restaurant)
        } else {
            res.status(404).json({ message: 'Restaurant not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
    try {
        const {
            name, email, password, phone, // Owner details
            restaurantName, image, cuisine, address, location, description // Restaurant details
        } = req.body

        // 1. Create Owner User
        const { User } = require('../Schema')
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'restaurant'
        })

        // 2. Create Restaurant
        const restaurant = await Restaurant.create({
            owner: user._id,
            name: restaurantName,
            image,
            cuisine,
            address,
            location,
            description
        })

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            restaurant
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get restaurant details for logged in owner
// @route   GET /api/restaurants/my-restaurant
// @access  Private/Restaurant
const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id })
        if (restaurant) {
            res.json(restaurant)
        } else {
            res.status(404).json({ message: 'Restaurant not found for this user' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (restaurant) {
            res.json(restaurant)
        } else {
            res.status(404).json({ message: 'Restaurant not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id)

        if (restaurant) {
            res.json({ message: 'Restaurant deleted' })
        } else {
            res.status(404).json({ message: 'Restaurant not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Verify Delivery OTP
// @route   POST /api/orders/:id/verify-otp
// @access  Private/Restaurant
const verifyDeliveryOtp = async (req, res) => {
    try {
        const { otp } = req.body
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        if (order.status !== 'out_for_delivery') {
            return res.status(400).json({ message: 'Order is not out for delivery' })
        }

        if (order.deliveryOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }

        order.status = 'delivered'
        order.paymentStatus = 'paid'
        order.deliveredAt = Date.now()
        await order.save()

        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    getMyRestaurant,
    updateRestaurant,
    deleteRestaurant,
    verifyDeliveryOtp
}
