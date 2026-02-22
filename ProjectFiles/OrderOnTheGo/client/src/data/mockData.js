export const restaurants = [
    {
        id: 1,
        name: "Biryani Blues",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
        cuisine: ["Biryani", "North Indian", "Mughlai"],
        rating: 4.5,
        reviews: 2340,
        deliveryTime: "25-30 min",
        priceRange: "₹300 for two",
        isOpen: true,
        lateNight: true,
        address: "MG Road, Bangalore",
        promoted: true
    },
    {
        id: 2,
        name: "Pizza Paradise",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        cuisine: ["Pizza", "Italian", "Fast Food"],
        rating: 4.3,
        reviews: 1890,
        deliveryTime: "20-25 min",
        priceRange: "₹400 for two",
        isOpen: true,
        lateNight: true,
        address: "Koramangala, Bangalore"
    },
    {
        id: 3,
        name: "Dragon Wok",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80",
        cuisine: ["Chinese", "Asian", "Thai"],
        rating: 4.4,
        reviews: 1567,
        deliveryTime: "30-35 min",
        priceRange: "₹350 for two",
        isOpen: true,
        lateNight: false,
        address: "Indiranagar, Bangalore"
    },
    {
        id: 4,
        name: "Burger Barn",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        cuisine: ["Burgers", "American", "Fast Food"],
        rating: 4.2,
        reviews: 2100,
        deliveryTime: "15-20 min",
        priceRange: "₹250 for two",
        isOpen: true,
        lateNight: true,
        address: "HSR Layout, Bangalore",
        promoted: true
    },
    {
        id: 5,
        name: "Sushi Station",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        cuisine: ["Japanese", "Sushi", "Asian"],
        rating: 4.7,
        reviews: 980,
        deliveryTime: "35-40 min",
        priceRange: "₹800 for two",
        isOpen: true,
        lateNight: false,
        address: "Whitefield, Bangalore"
    },
    {
        id: 6,
        name: "Dosa Delight",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
        cuisine: ["South Indian", "Dosa", "Breakfast"],
        rating: 4.4,
        reviews: 3200,
        deliveryTime: "20-25 min",
        priceRange: "₹200 for two",
        isOpen: true,
        lateNight: true,
        address: "Jayanagar, Bangalore"
    },
    {
        id: 7,
        name: "Taco Temple",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        cuisine: ["Mexican", "Tacos", "Fast Food"],
        rating: 4.1,
        reviews: 890,
        deliveryTime: "25-30 min",
        priceRange: "₹350 for two",
        isOpen: true,
        lateNight: true,
        address: "BTM Layout, Bangalore"
    },
    {
        id: 8,
        name: "Kebab Kingdom",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
        cuisine: ["Kebabs", "North Indian", "Mughlai"],
        rating: 4.6,
        reviews: 1450,
        deliveryTime: "30-35 min",
        priceRange: "₹450 for two",
        isOpen: false,
        lateNight: false,
        address: "JP Nagar, Bangalore"
    }
]

export const products = {
    1: [
        { id: 101, name: "Hyderabadi Dum Biryani", description: "Aromatic basmati rice cooked with tender chicken pieces", price: 299, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80", category: "Biryani", isVeg: false, rating: 4.6, reviews: 890, bestseller: true },
        { id: 102, name: "Veg Biryani", description: "Fragrant rice with mixed vegetables and spices", price: 229, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80", category: "Biryani", isVeg: true, rating: 4.3, reviews: 567 },
        { id: 103, name: "Mutton Biryani", description: "Slow-cooked mutton with premium basmati rice", price: 399, image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&q=80", category: "Biryani", isVeg: false, rating: 4.7, reviews: 456, bestseller: true },
        { id: 104, name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 279, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80", category: "Main Course", isVeg: false, rating: 4.5, reviews: 678 },
        { id: 105, name: "Naan Basket", description: "Assorted naans - butter, garlic, and plain", price: 129, image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80", category: "Breads", isVeg: true, rating: 4.2, reviews: 345 },
        { id: 106, name: "Raita", description: "Cooling yogurt with cucumber and spices", price: 59, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&q=80", category: "Sides", isVeg: true, rating: 4.1, reviews: 234 }
    ],
    2: [
        { id: 201, name: "Margherita Pizza", description: "Classic pizza with mozzarella and fresh basil", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", category: "Pizza", isVeg: true, rating: 4.4, reviews: 567, bestseller: true },
        { id: 202, name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and cheese", price: 399, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80", category: "Pizza", isVeg: false, rating: 4.6, reviews: 789 },
        { id: 203, name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce with grilled chicken", price: 449, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", category: "Pizza", isVeg: false, rating: 4.5, reviews: 456, bestseller: true },
        { id: 204, name: "Garlic Breadsticks", description: "Crispy breadsticks with garlic butter", price: 149, image: "https://images.unsplash.com/photo-1619535860434-cf9b902a0a14?w=400&q=80", category: "Sides", isVeg: true, rating: 4.3, reviews: 234 },
        { id: 205, name: "Pasta Alfredo", description: "Creamy white sauce pasta with herbs", price: 279, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=400&q=80", category: "Pasta", isVeg: true, rating: 4.2, reviews: 345 }
    ],
    3: [
        { id: 301, name: "Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 199, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", category: "Noodles", isVeg: true, rating: 4.3, reviews: 456, bestseller: true },
        { id: 302, name: "Manchurian", description: "Crispy vegetable balls in spicy sauce", price: 229, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80", category: "Starters", isVeg: true, rating: 4.4, reviews: 567 },
        { id: 303, name: "Kung Pao Chicken", description: "Spicy chicken with peanuts and vegetables", price: 299, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80", category: "Main Course", isVeg: false, rating: 4.5, reviews: 345, bestseller: true },
        { id: 304, name: "Spring Rolls", description: "Crispy rolls with vegetable filling", price: 179, image: "https://images.unsplash.com/photo-1548507200-54afc71c0f5e?w=400&q=80", category: "Starters", isVeg: true, rating: 4.2, reviews: 234 },
        { id: 305, name: "Fried Rice", description: "Wok-tossed rice with vegetables", price: 189, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", category: "Rice", isVeg: true, rating: 4.3, reviews: 567 }
    ],
    4: [
        { id: 401, name: "Classic Cheeseburger", description: "Juicy beef patty with melted cheese", price: 199, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", category: "Burgers", isVeg: false, rating: 4.5, reviews: 890, bestseller: true },
        { id: 402, name: "Veggie Supreme Burger", description: "Crispy vegetable patty with fresh veggies", price: 179, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80", category: "Burgers", isVeg: true, rating: 4.3, reviews: 567 },
        { id: 403, name: "Chicken Zinger", description: "Spicy fried chicken burger", price: 229, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", category: "Burgers", isVeg: false, rating: 4.6, reviews: 678, bestseller: true },
        { id: 404, name: "French Fries", description: "Golden crispy fries with seasoning", price: 99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", category: "Sides", isVeg: true, rating: 4.4, reviews: 1234 },
        { id: 405, name: "Chicken Wings", description: "Spicy fried chicken wings", price: 249, image: "https://images.unsplash.com/photo-1608039829572-022c9d95d04d?w=400&q=80", category: "Sides", isVeg: false, rating: 4.5, reviews: 456 }
    ],
    5: [
        { id: 501, name: "Salmon Sushi Roll", description: "Fresh salmon with rice and nori", price: 449, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80", category: "Sushi", isVeg: false, rating: 4.7, reviews: 345, bestseller: true },
        { id: 502, name: "California Roll", description: "Crab, avocado, and cucumber roll", price: 399, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80", category: "Sushi", isVeg: false, rating: 4.6, reviews: 234 },
        { id: 503, name: "Tempura Udon", description: "Udon noodles with crispy tempura", price: 349, image: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=400&q=80", category: "Noodles", isVeg: false, rating: 4.5, reviews: 189 },
        { id: 504, name: "Miso Soup", description: "Traditional Japanese soup", price: 129, image: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=400&q=80", category: "Soup", isVeg: true, rating: 4.4, reviews: 234 }
    ],
    6: [
        { id: 601, name: "Masala Dosa", description: "Crispy dosa with potato filling", price: 99, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80", category: "Dosa", isVeg: true, rating: 4.5, reviews: 1234, bestseller: true },
        { id: 602, name: "Mysore Masala Dosa", description: "Spicy chutney dosa with potato", price: 119, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80", category: "Dosa", isVeg: true, rating: 4.6, reviews: 890 },
        { id: 603, name: "Idli Sambar", description: "Soft idlis with sambar and chutney", price: 79, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80", category: "Breakfast", isVeg: true, rating: 4.4, reviews: 567 },
        { id: 604, name: "Vada", description: "Crispy lentil fritters", price: 69, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80", category: "Breakfast", isVeg: true, rating: 4.3, reviews: 456 },
        { id: 605, name: "Filter Coffee", description: "Traditional South Indian coffee", price: 49, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80", category: "Beverages", isVeg: true, rating: 4.7, reviews: 1567, bestseller: true }
    ],
    7: [
        { id: 701, name: "Chicken Tacos", description: "Soft tacos with spiced chicken", price: 249, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", category: "Tacos", isVeg: false, rating: 4.4, reviews: 345, bestseller: true },
        { id: 702, name: "Veggie Burrito", description: "Loaded burrito with beans and rice", price: 279, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80", category: "Burrito", isVeg: true, rating: 4.3, reviews: 234 },
        { id: 703, name: "Nachos Grande", description: "Crispy nachos with cheese and salsa", price: 199, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80", category: "Starters", isVeg: true, rating: 4.5, reviews: 567, bestseller: true },
        { id: 704, name: "Quesadilla", description: "Cheesy tortilla with grilled filling", price: 219, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&q=80", category: "Main", isVeg: true, rating: 4.2, reviews: 189 }
    ],
    8: [
        { id: 801, name: "Seekh Kebab", description: "Minced lamb kebabs with spices", price: 349, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80", category: "Kebabs", isVeg: false, rating: 4.6, reviews: 456, bestseller: true },
        { id: 802, name: "Chicken Tikka", description: "Tandoor grilled chicken pieces", price: 299, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80", category: "Kebabs", isVeg: false, rating: 4.5, reviews: 567 },
        { id: 803, name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 279, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", category: "Kebabs", isVeg: true, rating: 4.4, reviews: 345, bestseller: true },
        { id: 804, name: "Roomali Roti", description: "Thin handkerchief bread", price: 49, image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80", category: "Breads", isVeg: true, rating: 4.3, reviews: 234 }
    ]
}

export const categories = [
    { id: 1, name: "Biryani", icon: "🍚", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80" },
    { id: 2, name: "Pizza", icon: "🍕", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80" },
    { id: 3, name: "Burgers", icon: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
    { id: 4, name: "Chinese", icon: "🥡", image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&q=80" },
    { id: 5, name: "South Indian", icon: "🥞", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=200&q=80" },
    { id: 6, name: "Desserts", icon: "🍰", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80" },
    { id: 7, name: "Healthy", icon: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80" },
    { id: 8, name: "Late Night", icon: "🌙", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80" }
]

export const offers = [
    { id: 1, title: "50% OFF up to ₹100", code: "WELCOME50", description: "On your first order", color: "from-orange-500 to-red-500" },
    { id: 2, title: "FREE Delivery", code: "FREEDEL", description: "On orders above ₹299", color: "from-green-500 to-teal-500" },
    { id: 3, title: "20% OFF", code: "SAVE20", description: "On partner restaurants", color: "from-purple-500 to-pink-500" }
]

export const banners = [
    { id: 1, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", title: "Midnight Cravings?", subtitle: "We deliver till 3 AM" },
    { id: 2, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80", title: "Pizza Festival", subtitle: "Buy 1 Get 1 Free" },
    { id: 3, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80", title: "Burger Bonanza", subtitle: "Flat 40% OFF" }
]
