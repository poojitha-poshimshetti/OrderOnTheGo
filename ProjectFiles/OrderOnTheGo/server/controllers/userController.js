const { User } = require('../Schema')

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites')
            .populate('favoriteDishes')

        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.phone = req.body.phone || user.phone
            user.avatar = req.body.avatar || user.avatar

            if (req.body.password) {
                user.password = req.body.password
            }

            const updatedUser = await user.save()

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                avatar: updatedUser.avatar
            })
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Add address
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const { type, address, city, pincode, isDefault } = req.body

        // If new address is default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false)
        }

        user.addresses.push({ type, address, city, pincode, isDefault })
        await user.save()

        res.status(201).json(user.addresses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Delete address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.id
        )
        await user.save()

        res.json(user.addresses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Toggle favorite restaurant
// @route   POST /api/users/favorites/:restaurantId
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const restaurantId = req.params.restaurantId

        const index = user.favorites.indexOf(restaurantId)
        if (index > -1) {
            user.favorites.splice(index, 1)
        } else {
            user.favorites.push(restaurantId)
        }

        await user.save()
        res.json(user.favorites)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Toggle favorite dish
// @route   POST /api/users/favorite-dishes/:productId
// @access  Private
const toggleFavoriteDish = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const productId = req.params.productId

        const index = user.favoriteDishes.indexOf(productId)
        if (index > -1) {
            user.favoriteDishes.splice(index, 1)
        } else {
            user.favoriteDishes.push(productId)
        }

        await user.save()
        res.json(user.favoriteDishes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
const addPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const { type, cardNumber, upiId, cardHolder, expiry, isDefault } = req.body

        if (isDefault) {
            user.paymentMethods.forEach(pm => pm.isDefault = false)
        }

        user.paymentMethods.push({
            type,
            cardNumber,
            upiId,
            cardHolder,
            expiry,
            isDefault: isDefault || user.paymentMethods.length === 0
        })

        await user.save()
        res.status(201).json(user.paymentMethods)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
const deletePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        user.paymentMethods = user.paymentMethods.filter(
            pm => pm._id.toString() !== req.params.id
        )
        await user.save()
        res.json(user.paymentMethods)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get payment methods
// @route   GET /api/users/payment-methods
// @access  Private
const getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.json(user.paymentMethods)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    toggleFavorite,
    toggleFavoriteDish,
    addPaymentMethod,
    deletePaymentMethod,
    getPaymentMethods
}
