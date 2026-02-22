const { Product } = require('../Schema')

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { restaurant, category, isVeg, bestseller, search, sort } = req.query

        let query = { isAvailable: true }

        if (restaurant) query.restaurant = restaurant
        if (category) query.category = category
        if (isVeg === 'true') query.isVeg = true
        if (bestseller === 'true') query.isBestseller = true
        if (search) {
            query.$text = { $search: search }
        }

        let sortOption = {}
        if (sort === 'price-low') sortOption = { price: 1 }
        else if (sort === 'price-high') sortOption = { price: -1 }
        else if (sort === 'rating') sortOption = { rating: -1 }
        else if (sort === 'name') sortOption = { name: 1 }
        else sortOption = { createdAt: -1 }

        const products = await Product.find(query)
            .populate('restaurant', 'name image')
            .populate('category', 'name')
            .sort(sortOption)

        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get products by restaurant
// @route   GET /api/products/restaurant/:restaurantId
// @access  Public
const getProductsByRestaurant = async (req, res) => {
    try {
        const products = await Product.find({
            restaurant: req.params.restaurantId,
            isAvailable: true
        })
            .populate('category', 'name')
            .sort({ categoryName: 1, isBestseller: -1 })

        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('restaurant', 'name image deliveryTime')
            .populate('category', 'name')

        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin/Restaurant
const createProduct = async (req, res) => {
    try {
        const { Restaurant } = require('../Schema')

        // If restaurant owner, ensure they are adding to their own restaurant
        if (req.user.role === 'restaurant') {
            const restaurant = await Restaurant.findOne({ owner: req.user._id })
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found for this user' })
            }
            req.body.restaurant = restaurant._id
        }

        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin/Restaurant
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check ownership if user is restaurant
        if (req.user.role === 'restaurant') {
            const { Restaurant } = require('../Schema')
            const restaurant = await Restaurant.findOne({ owner: req.user._id })

            if (!restaurant || product.restaurant.toString() !== restaurant._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this product' })
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        res.json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Restaurant
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check ownership if user is restaurant
        if (req.user.role === 'restaurant') {
            const { Restaurant } = require('../Schema')
            const restaurant = await Restaurant.findOne({ owner: req.user._id })

            if (!restaurant || product.restaurant.toString() !== restaurant._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this product' })
            }
        }

        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: 'Product deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getProductsByRestaurant,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}
