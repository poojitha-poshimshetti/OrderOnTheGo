const { Content, Order, User, Restaurant } = require('../Schema')

// Get all content (filtered by query)
exports.getContent = async (req, res) => {
    try {
        const { type } = req.query
        const query = { isActive: true }
        if (type) query.type = type

        const content = await Content.find(query).sort({ 'metadata.order': 1, createdAt: -1 })
        res.json(content)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get home page specific data (aggregated)
exports.getHomeContent = async (req, res) => {
    try {
        // Fetch all UI sections in parallel
        const [
            banners,
            testimonials,
            offers,
            moods,
            chef,
            howItWorks,
            announcements,
            trustBadges,
            typewriterTexts,
            appCta,
            sectionConfigs
        ] = await Promise.all([
            Content.find({ type: 'banner', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'testimonial', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'offer', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'mood', isActive: true }).sort('metadata.order'),
            Content.findOne({ type: 'chef', isActive: true }),
            Content.find({ type: 'how_it_works', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'announcement', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'trust_badge', isActive: true }).sort('metadata.order'),
            Content.find({ type: 'typewriter_text', isActive: true }).sort('metadata.order'),
            Content.findOne({ type: 'app_cta', isActive: true }),
            Content.find({ type: 'section_config', isActive: true }) // Fetch dynamic section titles
        ])

        // Calculate dynamic stats
        const [userCount, orderCount, restaurantCount, avgDelivery] = await Promise.all([
            User.estimatedDocumentCount(),
            Order.estimatedDocumentCount(),
            Restaurant.estimatedDocumentCount(),
            Promise.resolve(27)
        ])

        const stats = [
            { value: `${restaurantCount}+`, suffix: '', label: 'Restaurants' },
            { value: `${userCount}`, suffix: '+', label: 'Happy Users' },
            { value: `${orderCount}`, suffix: '+', label: 'Orders' },
            { value: `${avgDelivery}`, suffix: 'min', label: 'Avg Delivery' }
        ]

        // Live Ticker: Get last 5 orders
        const recentOrdersRaw = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate('items.product', 'name')

        const recentOrders = recentOrdersRaw.map(o => {
            const item = o.items[0]?.name || 'Delicious Meal'
            return {
                user: o.user?.name?.split(' ')[0] || 'Guest',
                item: item,
                time: o.createdAt,
                emoji: '🍕'
            }
        })

        // Transform section configuration into a key-value map for easier frontend access
        const sections = {}
        sectionConfigs.forEach(conf => {
            if (conf.metadata?.identifier) {
                sections[conf.metadata.identifier] = {
                    title: conf.title,
                    subtitle: conf.description,
                    badge: conf.metadata.badge,
                    buttonText: conf.metadata.buttonText,
                    metadata: conf.metadata // Pass full metadata just in case
                }
            }
        })

        res.json({
            banners,
            testimonials,
            offers,
            moods,
            chef,
            howItWorks,
            announcements,
            trustBadges,
            typewriterTexts,
            appCta,
            stats,
            recentOrders,
            sections // Send the map of section configs
        })
    } catch (error) {
        console.error('Home content error:', error)
        res.status(500).json({ message: 'Failed to fetch home content' })
    }
}

// Create new content (Admin only)
exports.createContent = async (req, res) => {
    try {
        const content = await Content.create(req.body)
        res.status(201).json(content)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
