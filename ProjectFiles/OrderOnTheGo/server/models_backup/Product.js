const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {
        type: String,
        default: 'Main Course'
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    isNew: {
        type: Boolean,
        default: false
    },
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
    preparationTime: {
        type: String,
        default: '15-20 min'
    },
    customizations: [{
        name: String,
        options: [{
            name: String,
            price: Number
        }]
    }],
    tags: [{
        type: String
    }]
}, {
    timestamps: true
})

// Index for searching
productSchema.index({ name: 'text', description: 'text' })

module.exports = mongoose.model('Product', productSchema)
