const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ''
    },
    cuisine: [{
        type: String,
        required: true
    }],
    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    deliveryTime: {
        type: String,
        default: '25-35 min'
    },
    priceRange: {
        type: String,
        enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'],
        default: '₹₹'
    },
    minOrder: {
        type: Number,
        default: 99
    },
    deliveryFee: {
        type: Number,
        default: 40
    },
    freeDeliveryAbove: {
        type: Number,
        default: 299
    },
    address: {
        street: String,
        area: String,
        city: String,
        pincode: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    openTime: {
        type: String,
        default: '09:00'
    },
    closeTime: {
        type: String,
        default: '23:00'
    },
    isPureVeg: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    offers: [{
        code: String,
        discount: String,
        description: String,
        minOrder: Number
    }],
    tags: [{
        type: String
    }]
}, {
    timestamps: true
})

// Index for location-based queries
restaurantSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Restaurant', restaurantSchema)
