const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'restaurant'],
        default: 'user'
    },
    usertype: { type: String }, // Added for compatibility
    approval: { type: String }, // Added for compatibility
    avatar: {
        type: String,
        default: ''
    },
    addresses: [{
        type: {
            type: String,
            enum: ['Home', 'Office', 'Other'],
            default: 'Home'
        },
        address: String,
        city: String,
        pincode: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    favoriteDishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    paymentMethods: [{
        type: { type: String, enum: ['Card', 'UPI'], required: true },
        cardNumber: String, // Store only last 4 strings usually, but for demo maybe full or masked
        upiId: String,
        cardHolder: String,
        expiry: String,
        isDefault: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ==================== ADMIN SCHEMA ====================
const adminSchema = new mongoose.Schema({
    categories: { type: Array },
    promotedRestaurants: []
});

// ==================== RESTAURANT SCHEMA ====================
const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerId: { type: String }, // Added for compatibility
    title: { type: String },   // Added for compatibility (alias for name?)
    mainImg: { type: String }, // Added for compatibility (alias for image?)
    menu: { type: Array, default: [] }, // Added for compatibility
    // Existing fields
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
});
restaurantSchema.index({ location: '2dsphere' });

// ==================== PRODUCT (FoodItem) SCHEMA ====================
const productSchema = new mongoose.Schema({
    // Compatibility fields
    title: { type: String },
    itemImg: { type: String },
    menuCategory: { type: String },
    restaurantId: { type: String },
    // Existing fields
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
    isNewProduct: {
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
    discount: { type: Number }, // Added compatibility
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});
productSchema.index({ name: 'text', description: 'text' });

// ==================== ORDER SCHEMA ====================
const orderSchema = new mongoose.Schema({
    // Compatibility fields
    userId: { type: String },
    mobile: { type: String },
    pincode: { type: String },
    restaurantName: { type: String },
    foodItemId: { type: String },
    foodItemName: { type: String },
    foodItemImg: { type: String },
    quantity: { type: Number },
    // Existing fields
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String,
        customizations: [{
            name: String,
            option: String,
            price: Number
        }]
    }],
    deliveryAddress: {
        type: {
            type: String,
            default: 'Home'
        },
        address: String,
        city: String,
        pincode: String
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi', 'card', 'wallet'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'placed', 'confirmed', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryOtp: {
        type: String
    },
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    tip: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    couponCode: {
        type: String,
        default: ''
    },
    estimatedDeliveryTime: {
        type: String,
        default: '25-35 min'
    },
    deliveredAt: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    },
    orderDate: { type: String }, // Compatibility
    orderStatus: { type: String } // Compatibility
}, {
    timestamps: true
});

// ==================== CART SCHEMA ====================
const cartSchema = new mongoose.Schema({
    userId: { type: String },
    restaurantId: { type: String },
    restaurantName: { type: String },
    foodItemId: { type: String },
    foodItemName: { type: String },
    foodItemImg: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number }
});

// ==================== CATEGORY SCHEMA ====================
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🍽️'
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// ==================== CONTENT SCHEMA ====================
const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['banner', 'testimonial', 'offer', 'mood', 'chef', 'how_it_works', 'announcement', 'stat_config', 'trust_badge', 'typewriter_text', 'app_cta', 'section_config'],
        index: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: String,
    image: String,
    icon: String,
    metadata: {
        color: String,
        link: String,
        code: String,
        rating: Number,
        role: String,
        specialty: String,
        stats: Object,
        order: Number,
        identifier: String,
        badge: String,
        buttonText: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Admin: mongoose.model('Admin', adminSchema),
    Restaurant: mongoose.model('Restaurant', restaurantSchema),
    Product: mongoose.model('Product', productSchema),
    FoodItem: mongoose.model('FoodItem', productSchema), // Alias for compatibility
    Order: mongoose.model('Order', orderSchema),
    Cart: mongoose.model('Cart', cartSchema),
    Category: mongoose.model('Category', categorySchema),
    Content: mongoose.model('Content', contentSchema)
};
