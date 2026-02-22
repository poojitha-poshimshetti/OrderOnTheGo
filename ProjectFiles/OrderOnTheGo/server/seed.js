const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const dns = require('dns')

// Force Google DNS — same fix as db.js
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
dns.setDefaultResultOrder('ipv4first')

// Models
const { User, Restaurant, Product, Category, Content } = require('./Schema')

dotenv.config()

// Image Library - Verified Safe List (High Availability)
const foodImages = {
    pizza: {
        margherita: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
        pepperoni: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
        veggie: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        bbq: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        garlic_bread: 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80'
    },
    burger: {
        classic: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        cheese: 'https://images.unsplash.com/photo-1586190848861-99c8a3bd79ea?w=800&q=80',
        veggie: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
        chicken: 'https://images.unsplash.com/photo-1615297348958-d6705db7dac7?w=800&q=80',
        fries: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?w=800&q=80'
    },
    biryani: {
        chicken: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
        mutton: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
        veg: 'https://images.unsplash.com/photo-1642821373181-6962d778112e?w=800&q=80',
        hyderabadi: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
        raita: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'
    },
    indian: {
        butter_chicken: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
        paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
        dal: 'https://images.unsplash.com/photo-1546833999-b9f5816029bd?w=800&q=80',
        tikka: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
        naan: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80'
    },
    chinese: {
        fried_rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
        chicken_rice: 'https://images.unsplash.com/photo-1603133872878-684f10842619?w=800&q=80',
        manchurian: 'https://images.unsplash.com/photo-1563245372-f2172732006e?w=800&q=80',
        chilli_chicken: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
        spring_rolls: 'https://images.unsplash.com/photo-1544025162-d7669d265f29?w=800&q=80'
    },
    restaurant_covers: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=80', // Pizza
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&q=80', // Burger
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80', // Biryani
        'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=1000&q=80', // Indian
        'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=1000&q=80'  // Chinese
    ]
}

const categories = [
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80', icon: '🍕' },
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', icon: '🍔' },
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', icon: '🍚' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80', icon: '🥡' },
    { name: 'North Indian', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', icon: '🍛' },
    { name: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e0?w=400&q=80', icon: '🥘' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', icon: '🍰' },
    { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', icon: '🥤' }
]

const restaurants = [
    {
        name: 'Pizza Palace',
        image: foodImages.restaurant_covers[0],
        cuisine: ['Pizza', 'Italian'],
        rating: 4.5,
        ratingCount: 1250,
        deliveryTime: '25-35 min',
        priceRange: '₹₹',
        isOpen: true,
        isFeatured: true,
        offers: [{ code: 'PIZZA50', discount: '50% OFF', description: 'Up to ₹100', minOrder: 299 }],
        tags: ['Italian', 'Cheese', 'Late Night']
    },
    {
        name: 'Burger Junction',
        image: foodImages.restaurant_covers[1],
        cuisine: ['Burgers', 'American'],
        rating: 4.3,
        ratingCount: 890,
        deliveryTime: '20-30 min',
        priceRange: '₹₹',
        isOpen: true,
        isFeatured: true,
        tags: ['Fast Food', 'American', 'Fries']
    },
    {
        name: 'Biryani House',
        image: foodImages.restaurant_covers[2],
        cuisine: ['Biryani', 'North Indian'],
        rating: 4.7,
        ratingCount: 2100,
        deliveryTime: '30-40 min',
        priceRange: '₹₹₹',
        isOpen: true,
        isFeatured: true,
        tags: ['Spicy', 'Hyderabadi', 'Rice']
    },
    {
        name: 'Curry House',
        image: foodImages.restaurant_covers[3],
        cuisine: ['North Indian', 'Mughlai'],
        rating: 4.4,
        ratingCount: 1560,
        deliveryTime: '25-35 min',
        priceRange: '₹₹',
        isOpen: true,
        tags: ['Curry', 'Naan', 'Spicy']
    },
    {
        name: 'Dragon Wok',
        image: foodImages.restaurant_covers[4],
        cuisine: ['Chinese', 'Thai'],
        rating: 4.2,
        ratingCount: 720,
        deliveryTime: '25-35 min',
        priceRange: '₹₹',
        isOpen: true,
        tags: ['Asian', 'Spicy', 'Noodles']
    }
]

// Dynamic Content Data (Expanded with Section Configs)
const contentData = [
    // Banners
    { type: 'banner', title: '50% OFF on First Order', subtitle: 'Use code: WELCOME50', image: 'https://images.unsplash.com/photo-1544025162-d7669d265f29?w=1000&q=80', metadata: { order: 1 } },
    { type: 'banner', title: 'Late Night Cravings?', subtitle: 'We are open 24/7', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1000&q=80', metadata: { order: 2 } },
    { type: 'banner', title: 'Free Delivery Weekend', subtitle: 'On all orders above ₹499', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80', metadata: { order: 3 } },

    // Moods
    { type: 'mood', title: 'Hungry', icon: '🤤', metadata: { color: 'from-rose-500 to-orange-500', link: '/search?tab=dishes' } },
    { type: 'mood', title: 'Celebrating', icon: '🎉', metadata: { color: 'from-purple-500 to-pink-500', link: '/offers' } },
    { type: 'mood', title: 'Lazy', icon: '😴', metadata: { color: 'from-blue-500 to-cyan-500', link: '/search?tab=restaurants' } },
    { type: 'mood', title: 'Healthy', icon: '💪', metadata: { color: 'from-green-500 to-emerald-500', link: '/search?q=healthy' } },
    { type: 'mood', title: 'Spicy', icon: '🌶️', metadata: { color: 'from-red-500 to-orange-500', link: '/search?q=spicy' } },
    { type: 'mood', title: 'Sweet Tooth', icon: '🍰', metadata: { color: 'from-pink-500 to-rose-500', link: '/search?category=Desserts' } },

    // Testimonials
    { type: 'testimonial', title: 'Sarah M.', description: 'OrderOnTheGo changed my life! The delivery is super fast and food always arrives hot.', image: '👩', metadata: { role: 'Food Lover', rating: 5 } },
    { type: 'testimonial', title: 'Rahul K.', description: 'As someone who works late, the 24/7 service is a lifesaver. Best food app ever!', image: '👨', metadata: { role: 'Busy Professional', rating: 5 } },
    { type: 'testimonial', title: 'Priya S.', description: 'Love the student discounts and variety. Perfect for college life!', image: '👧', metadata: { role: 'Student', rating: 5 } },

    // How It Works
    { type: 'how_it_works', title: 'Browse', description: 'Explore 500+ restaurants', metadata: { icon: 'FiSearch', color: 'from-rose-500 to-pink-500', order: 1 } },
    { type: 'how_it_works', title: 'Order', description: 'Add items to cart', metadata: { icon: 'FiShoppingBag', color: 'from-purple-500 to-indigo-500', order: 2 } },
    { type: 'how_it_works', title: 'Track', description: 'Real-time tracking', metadata: { icon: 'FiTruck', color: 'from-cyan-500 to-blue-500', order: 3 } },
    { type: 'how_it_works', title: 'Enjoy', description: 'Delivered to your door', metadata: { icon: 'FiSmile', color: 'from-green-500 to-emerald-500', order: 4 } },

    // Offers
    { type: 'offer', title: 'Super Sunday Deal', description: 'Flat 50% OFF on Pizzas', metadata: { code: 'SUNDAY50', color: 'from-rose-500 to-orange-500' } },
    { type: 'offer', title: 'Burger Bonanza', description: 'Buy 1 Get 1 Free', metadata: { code: 'BOGO', color: 'from-purple-500 to-blue-500' } },
    { type: 'offer', title: 'Desert Storm', description: 'Free Truffle Cake on orders above ₹500', metadata: { code: 'SWEET', color: 'from-emerald-500 to-cyan-500' } },

    // Chef of Week
    { type: 'chef', title: 'Chef Vikram Singh', description: 'Master of North Indian Cuisine with 15 years of experience.', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80', metadata: { restaurant: 'Curry House', specialty: 'North Indian Cuisine', rating: 4.9, stats: { dishes: 156, orders: '12K+', rating: 4.9 }, link: '/search?q=Curry House' } },

    // Announcements
    { type: 'announcement', title: 'FREE DELIVERY', metadata: { color: 'bg-rose-500' } },
    { type: 'announcement', title: '50% OFF', metadata: { color: 'bg-purple-500' } },
    { type: 'announcement', title: 'LIVE TRACKING', metadata: { color: 'bg-cyan-500' } },
    { type: 'announcement', title: '24/7 SERVICE', metadata: { color: 'bg-amber-500' } },

    // Typewriter Text
    { type: 'typewriter_text', title: 'Pizza', metadata: { order: 1 } },
    { type: 'typewriter_text', title: 'Biryani', metadata: { order: 2 } },
    { type: 'typewriter_text', title: 'Burgers', metadata: { order: 3 } },
    { type: 'typewriter_text', title: 'Sushi', metadata: { order: 4 } },
    { type: 'typewriter_text', title: 'Tacos', metadata: { order: 5 } },
    { type: 'typewriter_text', title: 'Pasta', metadata: { order: 6 } },

    // Trust Badge
    { type: 'trust_badge', title: '50K+ Users', description: 'Trust us', metadata: { order: 1 } },
    { type: 'trust_badge', title: '4.9', description: 'Rating', metadata: { order: 2 } },

    // App CTA
    { type: 'app_cta', title: 'Get the App Now!', description: 'Order faster, track in real-time, and unlock exclusive deals.', metadata: { appleLink: '#', androidLink: '#' } },

    // --- NEW SECTION CONFIGS ---
    { type: 'section_config', title: 'Craving for', description: 'From local favorites to premium restaurants — delivered fast to your door! 🚀', metadata: { identifier: 'hero_section', badge: '#1 Food Delivery in India' } },
    { type: 'section_config', title: 'How are you feeling today?', description: "Pick your mood and we'll suggest the perfect food!", metadata: { identifier: 'mood_section', badge: 'MOOD SELECTOR' } },
    { type: 'section_config', title: 'Order in 4 Easy Steps', description: '', metadata: { identifier: 'how_it_works', badge: 'HOW IT WORKS' } },
    { type: 'section_config', title: "What's on your mind?", description: '', metadata: { identifier: 'categories', badge: '' } },
    { type: 'section_config', title: 'Most Loved Dishes', description: '', metadata: { identifier: 'popular_dishes', badge: '🔥 POPULAR', buttonText: 'View All' } },
    { type: 'section_config', title: 'What Our Users Say', description: '', metadata: { identifier: 'testimonials', badge: 'TESTIMONIALS' } },
    { type: 'section_config', title: 'Flash Deals', description: 'Limited time, massive discounts!', metadata: { identifier: 'flash_deals', badge: 'LIMITED OFFER' } },
    { type: 'section_config', title: 'Popular Restaurants', description: '', metadata: { identifier: 'restaurants', badge: '🔥 TRENDING' } }
]

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ MongoDB Connected')

        // Clear existing data
        await User.deleteMany()
        await Restaurant.deleteMany()
        await Product.deleteMany()
        await Category.deleteMany()
        await Content.deleteMany()
        console.log('🗑️ Cleared existing data')

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@sbfoods.com',
            password: 'admin123',
            phone: '9999999999',
            role: 'admin'
        })
        console.log('👤 Admin user created: admin@sbfoods.com / admin123')

        // Create normal user
        const normalUser = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'user123',
            phone: '8888888888',
            role: 'user',
            addresses: [{ type: 'Home', address: 'HSR Layout, Sector 2', city: 'Bangalore', pincode: '560102', isDefault: true }]
        })
        console.log('👤 Normal user created: user@example.com / user123')

        // Create categories
        const createdCategories = await Category.insertMany(categories)
        console.log('📂 Categories created:', createdCategories.length)

        // Create restaurants
        const createdRestaurants = await Restaurant.insertMany(restaurants)
        console.log('🍽️ Restaurants created:', createdRestaurants.length)

        // Create products for each restaurant
        const products = []

        // Pizza Palace products
        const pizzaMenu = [
            { name: 'Margherita Pizza', price: 299, isVeg: true, isBestseller: true, image: foodImages.pizza.margherita, tags: ['Cheese', 'Classic', 'Italian', 'Veg'] },
            { name: 'Pepperoni Pizza', price: 399, isVeg: false, image: foodImages.pizza.pepperoni, tags: ['Spicy', 'Meat', 'Italian'] },
            { name: 'Veggie Supreme', price: 349, isVeg: true, image: foodImages.pizza.veggie, tags: ['Healthy', 'Veg', 'Italian'] },
            { name: 'BBQ Chicken Pizza', price: 449, isVeg: false, isBestseller: true, image: foodImages.pizza.bbq, tags: ['BBQ', 'Chicken', 'Meat'] },
            { name: 'Garlic Bread', price: 129, isVeg: true, image: foodImages.pizza.garlic_bread, tags: ['Side', 'Veg', 'Snack'] }
        ]
        pizzaMenu.forEach(item => products.push({ ...item, restaurant: createdRestaurants[0]._id, categoryName: 'Pizza', description: `Delicious ${item.name} made with fresh ingredients` }))

        // Burger Junction products
        const burgerMenu = [
            { name: 'Classic Burger', price: 199, isVeg: false, isBestseller: true, image: foodImages.burger.classic, tags: ['Classic', 'Meat', 'American'] },
            { name: 'Cheese Burger', price: 249, isVeg: false, image: foodImages.burger.cheese, tags: ['Cheese', 'Meat', 'American'] },
            { name: 'Veggie Burger', price: 179, isVeg: true, image: foodImages.burger.veggie, tags: ['Veg', 'Healthy', 'American'] },
            { name: 'Chicken Zinger', price: 279, isVeg: false, isBestseller: true, image: foodImages.burger.chicken, tags: ['Spicy', 'Chicken', 'American'] },
            { name: 'French Fries', price: 99, isVeg: true, image: foodImages.burger.fries, tags: ['Side', 'Veg', 'Snack'] }
        ]
        burgerMenu.forEach(item => products.push({ ...item, restaurant: createdRestaurants[1]._id, categoryName: 'Burgers', description: `Tasty ${item.name} with our special sauce` }))

        // Biryani House products
        const biryaniMenu = [
            { name: 'Chicken Biryani', price: 299, isVeg: false, isBestseller: true, image: foodImages.biryani.chicken, tags: ['Spicy', 'Chicken', 'Rice'] },
            { name: 'Mutton Biryani', price: 399, isVeg: false, image: foodImages.biryani.mutton, tags: ['Spicy', 'Mutton', 'Rice'] },
            { name: 'Veg Biryani', price: 249, isVeg: true, image: foodImages.biryani.veg, tags: ['Veg', 'Rice', 'Mild'] },
            { name: 'Hyderabadi Dum Biryani', price: 349, isVeg: false, isBestseller: true, image: foodImages.biryani.hyderabadi, tags: ['Spicy', 'Special', 'Rice'] },
            { name: 'Raita', price: 49, isVeg: true, image: foodImages.biryani.raita, tags: ['Side', 'Veg', 'Cool'] }
        ]
        biryaniMenu.forEach(item => products.push({ ...item, restaurant: createdRestaurants[2]._id, categoryName: 'Biryani', description: `Authentic ${item.name} with aromatic spices` }))

        // Curry House products
        const curryMenu = [
            { name: 'Butter Chicken', price: 349, isVeg: false, isBestseller: true, image: foodImages.indian.butter_chicken, tags: ['Creamy', 'Chicken', 'Curry'] },
            { name: 'Paneer Butter Masala', price: 299, isVeg: true, isBestseller: true, image: foodImages.indian.paneer, tags: ['Veg', 'Paneer', 'Curry'] },
            { name: 'Dal Makhani', price: 249, isVeg: true, image: foodImages.indian.dal, tags: ['Veg', 'Lentils', 'Comfort'] },
            { name: 'Chicken Tikka', price: 329, isVeg: false, image: foodImages.indian.tikka, tags: ['Spicy', 'Chicken', 'Starter'] },
            { name: 'Butter Naan', price: 49, isVeg: true, image: foodImages.indian.naan, tags: ['Bread', 'Veg', 'Side'] }
        ]
        curryMenu.forEach(item => products.push({ ...item, restaurant: createdRestaurants[3]._id, categoryName: 'North Indian', description: `Traditional ${item.name} cooked to perfection` }))

        // Dragon Wok products
        const chineseMenu = [
            { name: 'Veg Fried Rice', price: 199, isVeg: true, isBestseller: true, image: foodImages.chinese.fried_rice, tags: ['Veg', 'Rice', 'Chinese'] },
            { name: 'Chicken Fried Rice', price: 249, isVeg: false, image: foodImages.chinese.chicken_rice, tags: ['Chicken', 'Rice', 'Chinese'] },
            { name: 'Veg Manchurian', price: 179, isVeg: true, image: foodImages.chinese.manchurian, tags: ['Veg', 'Starter', 'Chinese'] },
            { name: 'Chilli Chicken', price: 269, isVeg: false, isBestseller: true, image: foodImages.chinese.chilli_chicken, tags: ['Spicy', 'Chicken', 'Chinese'] },
            { name: 'Spring Rolls', price: 129, isVeg: true, image: foodImages.chinese.spring_rolls, tags: ['Veg', 'Starter', 'Snack'] }
        ]
        chineseMenu.forEach(item => products.push({ ...item, restaurant: createdRestaurants[4]._id, categoryName: 'Chinese', description: `Indo-Chinese ${item.name} with bold flavors` }))

        // Link Categories to Products
        for (const product of products) {
            const category = createdCategories.find(c => c.name === product.categoryName)
            if (category) {
                product.category = category._id
            }
        }

        const createdProducts = await Product.insertMany(products)
        console.log('🍕 Products created:', createdProducts.length)

        // Seed Content
        await Content.insertMany(contentData)
        console.log('🎨 Content (Banners, Moods, Testimonials, UI Config) seeded')

        console.log('\n✅ Database seeded successfully!')
        console.log('\n📋 Test Credentials:')
        console.log('   Admin: admin@sbfoods.com / admin123')
        console.log('   User: user@example.com / user123')

        process.exit(0)
    } catch (error) {
        console.error('❌ Seeding error:', error.message)
        process.exit(1)
    }
}

seedDatabase()
