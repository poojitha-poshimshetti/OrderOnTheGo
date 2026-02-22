const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Force restart 8
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/restaurants', require('./routes/restaurantRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/content', require('./routes/contentRoutes')) // New Content Routes

// Health check
app.get('/', (req, res) => {
    res.json({
        message: '🚀 OrderOnTheGo API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            restaurants: '/api/restaurants',
            products: '/api/products',
            orders: '/api/orders',
            categories: '/api/categories',
            content: '/api/content'
        }
    })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Server Error', error: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📍 API: http://localhost:${PORT}`)
})
