const mongoose = require('mongoose')

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
    image: String, // URL for banners, avatars, etc.
    icon: String,  // For things like Moods or HowItWorks (could be emoji or icon name)
    metadata: {
        // Flexible field for type-specific data
        color: String,      // Gradient colors
        link: String,       // Navigation link
        code: String,       // Coupon code
        rating: Number,     // For testimonials/chef
        role: String,       // For testimonials
        specialty: String,  // For chef
        stats: Object,      // For chef stats
        order: Number,      // For sorting
        identifier: String, // Unique ID for section retrieval (e.g. 'hero_section', 'mood_section')
        badge: String,      // For section badges (e.g. 'TRENDING')
        buttonText: String  // For CTA buttons
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Content', contentSchema)
