const { User } = require('../Schema')
const { generateToken } = require('../middleware/auth')

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body

        // Check if user exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email }).select('+password')

        if (user && (await user.matchPassword(password))) {
            const response = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
                token: generateToken(user._id)
            }

            // If user is a restaurant owner, fetch their restaurant
            if (user.role === 'restaurant') {
                const restaurant = await require('../Schema').Restaurant.findOne({ owner: user._id })
                if (restaurant) {
                    response.restaurantId = restaurant._id
                }
            }

            res.json(response)
        } else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites')
            .populate('favoriteDishes')

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, getMe }
