import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { restaurantAPI, categoryAPI, productAPI, contentAPI } from '../../services/api'
import RestaurantCard from '../../components/cards/RestaurantCard'
import { RestaurantCardSkeleton, CategorySkeleton } from '../../components/common/Skeleton'
import { FiSearch, FiChevronLeft, FiChevronRight, FiStar, FiClock, FiArrowRight, FiZap, FiTrendingUp, FiAward, FiMapPin, FiPercent, FiHeart, FiShoppingBag, FiUsers, FiCheckCircle, FiTruck, FiSmile, FiPlay, FiGift, FiCoffee, FiSun, FiMoon, FiCloud, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

// Live Order Ticker Component (Dynamic)
const LiveOrderTicker = ({ orders }) => {
    const [currentOrder, setCurrentOrder] = useState(0)

    useEffect(() => {
        if (!orders || orders.length === 0) return
        const interval = setInterval(() => {
            setCurrentOrder(prev => (prev + 1) % orders.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [orders])

    if (!orders || orders.length === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 hidden md:block"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentOrder}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="flex items-center gap-3 px-5 py-3 bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl rounded-full shadow-xl border border-gray-200/50 dark:border-dark-border"
                >
                    <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span className="text-2xl">{orders[currentOrder].emoji || '🍕'}</span>
                    <span className="text-sm">
                        <span className="font-bold text-gray-900 dark:text-white">{orders[currentOrder].user}</span>
                        <span className="text-gray-500"> just ordered </span>
                        <span className="font-semibold text-rose-500">{orders[currentOrder].item}</span>
                    </span>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}

// Animated Counter
const AnimatedCounter = ({ value, suffix = '' }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (isInView && value) {
            const numStr = value.toString().replace(/\D/g, '')
            const num = parseInt(numStr) || 0

            if (num === 0) {
                setCount(0)
                return
            }

            let current = 0
            const timer = setInterval(() => {
                current += Math.ceil(num / 40)
                if (current >= num) { setCount(num); clearInterval(timer) }
                else setCount(current)
            }, 50)
            return () => clearInterval(timer)
        }
    }, [isInView, value])

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Magnetic Button
const MagneticButton = ({ children, className, onClick }) => {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { damping: 15, stiffness: 150 })
    const springY = useSpring(y, { damping: 15, stiffness: 150 })

    return (
        <motion.button
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return
                x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
                y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
            }}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            onClick={onClick}
            className={className}
        >{children}</motion.button>
    )
}

// Typewriter
const TypewriterText = ({ texts }) => {
    const [idx, setIdx] = useState(0)
    const [text, setText] = useState('')
    const [del, setDel] = useState(false)

    useEffect(() => {
        if (!texts || texts.length === 0) return
        const t = texts[idx]
        const timeout = setTimeout(() => {
            if (!del) {
                if (text.length < t.length) setText(t.slice(0, text.length + 1))
                else setTimeout(() => setDel(true), 2000)
            } else {
                if (text.length > 0) setText(t.slice(0, text.length - 1))
                else { setDel(false); setIdx((idx + 1) % texts.length) }
            }
        }, del ? 40 : 80)
        return () => clearTimeout(timeout)
    }, [text, del, idx, texts])

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500">
            {text}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-rose-500">|</motion.span>
        </span>
    )
}

// 3D Tilt Card
const TiltCard = ({ children, className }) => {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [8, -8])
    const rotateY = useTransform(x, [-100, 100], [-8, 8])

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect()
                if (!rect) return
                x.set(e.clientX - rect.left - rect.width / 2)
                y.set(e.clientY - rect.top - rect.height / 2)
            }}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            className={className}
        >{children}</motion.div>
    )
}

// Floating 3D Food Item
const FloatingFood = ({ emoji, delay, x, y }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0],
            rotateY: [0, 360]
        }}
        transition={{
            opacity: { delay },
            scale: { delay },
            y: { duration: 4, repeat: Infinity, delay },
            rotateY: { duration: 8, repeat: Infinity, ease: 'linear', delay }
        }}
        className="absolute text-5xl pointer-events-none select-none"
        style={{ left: x, top: y, transformStyle: 'preserve-3d' }}
    >
        {emoji}
    </motion.div>
)

export default function Home() {
    const { isLateNight } = useTheme()
    const { user } = useAuth()
    const { addToCart } = useCart()
    const navigate = useNavigate()

    // Data States
    const [loading, setLoading] = useState(true)
    const [restaurants, setRestaurants] = useState([])
    const [categories, setCategories] = useState([])
    const [popularDishes, setPopularDishes] = useState([])
    const [homeContent, setHomeContent] = useState(null)

    // UI States
    const [currentBanner, setCurrentBanner] = useState(0)
    const [filter, setFilter] = useState('all')
    const [activeCategory, setActiveCategory] = useState(null)
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [selectedMood, setSelectedMood] = useState(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const { scrollYProgress } = useScroll()
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resData, catData, dishData, contentData] = await Promise.all([
                    restaurantAPI.getAll(),
                    categoryAPI.getAll(),
                    productAPI.getAll(),
                    contentAPI.getHome()
                ])

                setRestaurants(resData.map(r => ({ ...r, id: r._id })))
                setCategories(catData.map(c => ({ ...c, id: c._id })))
                setPopularDishes(dishData.slice(0, 4).map(d => ({
                    ...d,
                    id: d._id,
                    priceDisplay: `₹${d.price}`,
                    restaurant: d.restaurant?.name || 'Unknown'
                })))
                setHomeContent(contentData)
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!homeContent?.banners) return
        const i = setInterval(() => setCurrentBanner(p => (p + 1) % homeContent.banners.length), 6000)
        return () => clearInterval(i)
    }, [homeContent?.banners])

    useEffect(() => {
        if (!homeContent?.testimonials) return
        const i = setInterval(() => setCurrentTestimonial(p => (p + 1) % homeContent.testimonials.length), 5000)
        return () => clearInterval(i)
    }, [homeContent?.testimonials])

    useEffect(() => {
        const h = (e) => setMousePosition({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', h)
        return () => window.removeEventListener('mousemove', h)
    }, [])

    const filteredRestaurants = restaurants.filter(r => {
        if (filter === 'all') return true
        if (filter === 'open') return r.isOpen
        if (filter === 'latenight') return r.lateNight
        if (filter === 'rating') return r.rating >= 4.5
        return true
    })

    const handleMoodClick = (mood) => {
        setSelectedMood(mood.title)
        toast.success(`Finding ${mood.title.toLowerCase()} food for you!`, { icon: mood.icon })
        if (mood.metadata?.link) {
            setTimeout(() => navigate(mood.metadata.link), 800)
        } else {
            // Search for the mood title (e.g., "Spicy", "Healthy")
            setTimeout(() => navigate(`/search?q=${encodeURIComponent(mood.title)}`), 800)
        }
    }

    const handleAddDish = (dish) => {
        const restId = dish.restaurant?._id || dish.restaurantId
        const restName = dish.restaurant?.name || dish.restaurant || 'Unknown Restaurant'

        addToCart({
            id: dish.id || dish._id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            restaurantId: restId,
            restaurantName: restName,
            isVeg: dish.isVeg,
            quantity: 1
        })
        toast.success(`${dish.name} added to cart!`, { icon: '🛒' })
    }

    const handleCategoryClick = (cat) => {
        setActiveCategory(activeCategory === cat.id ? null : cat.id)
        toast.success(`Browsing ${cat.name} restaurants!`, { icon: '🍽️' })
        setTimeout(() => navigate(`/search?cuisine=${encodeURIComponent(cat.name)}&tab=restaurants`), 500)
    }

    const getTimeGreeting = () => {
        const h = new Date().getHours()
        if (h < 12) return { text: 'Good Morning', icon: FiSun, color: 'text-amber-500' }
        if (h < 17) return { text: 'Good Afternoon', icon: FiSun, color: 'text-orange-500' }
        if (h < 21) return { text: 'Good Evening', icon: FiCloud, color: 'text-purple-500' }
        return { text: 'Good Night', icon: FiMoon, color: 'text-indigo-500' }
    }
    const greeting = getTimeGreeting()

    const getIcon = (iconName) => {
        const icons = { FiSearch, FiShoppingBag, FiTruck, FiSmile, FiGift, FiZap }
        const IconComp = icons[iconName] || FiSearch
        return IconComp
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl">🍕</motion.div>
            </div>
        )
    }

    // Default empty arrays and values
    const {
        banners = [],
        testimonials = [],
        offers = [],
        moods = [],
        chef = null,
        howItWorks = [],
        announcements = [],
        stats = [],
        recentOrders = [],
        typewriterTexts = [],
        trustBadges = [],
        appCta = null,
        sections = {} // Access section configs here
    } = homeContent || {}

    // Extract raw text for typewriter if available, else fallback
    const typewriterWords = typewriterTexts.length > 0
        ? typewriterTexts.map(t => t.title)
        : ['Pizza', 'Biryani', 'Burgers', 'Sushi', 'Tacos']

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg relative overflow-hidden">
            <LiveOrderTicker orders={recentOrders} />

            <motion.div
                className="fixed w-72 h-72 rounded-full pointer-events-none z-0 hidden lg:block"
                animate={{ x: mousePosition.x - 144, y: mousePosition.y - 144 }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)' }}
            />

            <motion.section style={{ scale: heroScale }} className="relative z-10 min-h-[95vh] flex items-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
                    <FloatingFood emoji="🍕" delay={0} x="5%" y="20%" />
                    <FloatingFood emoji="🍔" delay={0.5} x="90%" y="25%" />
                    <FloatingFood emoji="🍜" delay={1} x="85%" y="70%" />
                    <FloatingFood emoji="🌮" delay={1.5} x="10%" y="75%" />
                    <FloatingFood emoji="🍣" delay={2} x="15%" y="45%" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
                                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                    <greeting.icon className={greeting.color} size={28} />
                                </motion.div>
                                <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                    {greeting.text}{user ? `, ${user.name?.split(' ')[0]}` : ''}!
                                </span>
                            </motion.div>

                            <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/10 to-purple-500/10 border border-rose-500/20 rounded-full mb-6">
                                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-sm font-semibold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                                    {sections.hero_section?.badge || '#1 Food Delivery in India'}
                                </span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                {sections.hero_section?.title || 'Craving for'}<br /><TypewriterText texts={typewriterWords} /><span>?</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                                {sections.hero_section?.subtitle || 'From local favorites to premium restaurants — delivered fast to your door! 🚀'}
                            </p>

                            <Link to="/search" className="block mb-8">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative flex items-center gap-4 px-6 py-5 bg-white dark:bg-dark-card rounded-2xl shadow-xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <FiSearch className="text-white" size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 font-medium">Search restaurants or dishes...</p>
                                        </div>
                                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            <FiArrowRight className="text-gray-400" size={22} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>

                            <div className="flex items-center gap-6 flex-wrap">
                                {trustBadges.length > 0 && trustBadges.map((badge, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 ${idx === 1 ? "px-4 py-2 bg-amber-500/10 rounded-xl" : ""}`}>
                                        {idx === 0 ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-3">
                                                    {['👩', '👨', '👧', '🧔'].map((avatar, i) => (
                                                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-lg border-2 border-white dark:border-dark-card">{avatar}</motion.div>
                                                    ))}
                                                </div>
                                                <div className="text-sm"><p className="font-bold text-gray-900 dark:text-white">{badge.title}</p><p className="text-gray-500">{badge.description}</p></div>
                                            </div>
                                        ) : (
                                            <>
                                                <FiStar className="text-amber-500 fill-amber-500" size={20} />
                                                <span className="font-bold text-gray-900 dark:text-white">{badge.title}</span>
                                                <span className="text-gray-500 text-sm">{badge.description}</span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Banner */}
                        {banners.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                                <TiltCard className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3]">
                                    <AnimatePresence mode="wait">
                                        {banners.map((banner, idx) => idx === currentBanner && (
                                            <motion.div key={banner._id || idx} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-8 left-8 right-8 text-white">
                                                    <span className="inline-block px-3 py-1 bg-rose-500 rounded-full text-xs font-bold mb-3">🔥 TRENDING</span>
                                                    <h3 className="text-3xl font-black mb-1">{banner.title}</h3>
                                                    <p className="opacity-90">{banner.subtitle}</p>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        {banners.map((_, idx) => (
                                            <motion.button key={idx} onClick={() => setCurrentBanner(idx)} animate={{ width: idx === currentBanner ? 24 : 8, backgroundColor: idx === currentBanner ? '#fff' : 'rgba(255,255,255,0.5)' }} className="h-2 rounded-full" />
                                        ))}
                                    </div>
                                </TiltCard>

                                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute -left-6 top-1/4 bg-white dark:bg-dark-card p-3 rounded-2xl shadow-2xl hidden lg:flex items-center gap-3">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl">🍕</motion.div>
                                    <div><p className="font-bold text-gray-900 dark:text-white text-sm">Pizza Hut</p><div className="flex items-center gap-1 text-amber-500"><FiStar className="fill-current" size={12} /><span className="text-xs">4.8</span></div></div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="absolute -right-4 top-10 bg-white dark:bg-dark-card p-3 rounded-2xl shadow-2xl hidden lg:flex items-center gap-2">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"><FiCheckCircle className="text-white" size={20} /></motion.div>
                                    <div><p className="font-bold text-green-500 text-sm">Delivered!</p><p className="text-xs text-gray-500">Just now</p></div>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.section>

            {moods.length > 0 && (
                <section className="relative z-10 py-16 bg-white dark:bg-dark-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                            <span className="inline-block px-4 py-1.5 bg-purple-500/10 text-purple-500 font-semibold rounded-full text-sm mb-4">
                                {sections.mood_section?.badge || 'MOOD SELECTOR'}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                                {sections.mood_section?.title || 'How are you feeling today?'}
                            </h2>
                            <p className="text-gray-500">
                                {sections.mood_section?.subtitle || "Pick your mood and we'll suggest the perfect food!"}
                            </p>
                        </motion.div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {moods.map((mood, idx) => (
                                <motion.button
                                    key={mood._id || idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMoodClick(mood)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${selectedMood === mood.title
                                        ? `bg-gradient-to-r ${mood.metadata?.color || 'from-rose-500 to-orange-500'} text-white shadow-xl`
                                        : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:shadow-lg'
                                        }`}
                                >
                                    <span className="text-3xl">{mood.icon}</span>
                                    <span>{mood.title}</span>
                                </motion.button>
                            ))}
                        </div>

                        {selectedMood && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 text-center"
                            >
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Perfect! We're finding the best <span className="font-bold text-rose-500">{selectedMood.toLowerCase()}</span> food options for you! 🎯
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            {announcements.length > 0 && (
                <section className="relative z-10 py-4 bg-gray-900 dark:bg-black overflow-hidden">
                    <motion.div animate={{ x: [0, -1500] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex gap-12 whitespace-nowrap">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-12 text-white/80 font-medium">
                                {announcements.map((ann, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span>{ann.title}</span>
                                        <span className={`w-1.5 h-1.5 ${ann.metadata?.color || 'bg-rose-500'} rounded-full`} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </section>
            )}

            {chef && (
                <section className="relative z-10 py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-white">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-bold mb-6">
                                    <FiAward size={18} /> CHEF OF THE WEEK
                                </span>
                                <h2 className="text-5xl font-black mb-4">{chef.title}</h2>
                                <p className="text-2xl opacity-90 mb-2">{chef.metadata?.restaurant}</p>
                                <p className="text-lg opacity-80 mb-6">{chef.metadata?.specialty}</p>
                                <div className="flex flex-wrap gap-6 mb-8">
                                    <div className="text-center">
                                        <p className="text-4xl font-black">{chef.metadata?.stats?.rating}</p>
                                        <p className="text-sm opacity-80">Rating</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-black">{chef.metadata?.stats?.dishes}</p>
                                        <p className="text-sm opacity-80">Dishes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-black">{chef.metadata?.stats?.orders}</p>
                                        <p className="text-sm opacity-80">Orders</p>
                                    </div>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <MagneticButton
                                        onClick={() => navigate(chef.metadata?.link || '/search')}
                                        className="px-8 py-4 bg-white text-orange-500 font-bold rounded-2xl shadow-xl flex items-center gap-2"
                                    >
                                        View Menu <FiArrowRight />
                                    </MagneticButton>
                                </motion.div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative">
                                    <div className="w-80 h-80 mx-auto rounded-full overflow-hidden border-8 border-white/30 shadow-2xl">
                                        <img src={chef.image} alt={chef.title} className="w-full h-full object-cover" />
                                    </div>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl">👨‍🍳</motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {howItWorks.length > 0 && (
                <section className="relative z-10 py-20 bg-white dark:bg-dark-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-cyan-500/10 text-cyan-500 font-semibold rounded-full text-sm mb-4">
                                {sections.how_it_works?.badge || 'HOW IT WORKS'}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                                {sections.how_it_works?.title || 'Order in 4 Easy Steps'}
                            </h2>
                        </motion.div>
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            <div className="absolute top-20 left-10 right-10 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 hidden md:block rounded-full" />
                            {howItWorks.map((step, idx) => {
                                const Icon = getIcon(step.metadata?.icon)
                                return (
                                    <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="relative text-center">
                                        <motion.div whileHover={{ scale: 1.1, y: -10 }} className="relative z-10 mx-auto mb-6">
                                            <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${step.metadata?.color || 'from-rose-500 to-pink-500'} rounded-3xl flex items-center justify-center shadow-xl`}>
                                                <Icon className="text-white" size={32} />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-black text-sm">{idx + 1}</div>
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                        <p className="text-gray-500">{step.description}</p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                            {sections.categories?.title || "What's on your mind?"}
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                        {loading ? [...Array(8)].map((_, i) => <CategorySkeleton key={i} />) : categories.map((cat, idx) => (
                            <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -10, scale: 1.05 }} onClick={() => handleCategoryClick(cat)} className="cursor-pointer group text-center">
                                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 transition-all mb-3 ${activeCategory === cat.id ? 'border-rose-500 shadow-rose-500/30' : 'border-white dark:border-dark-card'}`}>
                                    <img 
                                        src={cat.image} 
                                        alt={cat.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/1147/1147831.png'
                                            e.target.onerror = null
                                        }}
                                    />
                                </div>
                                <span className={`text-sm font-semibold ${activeCategory === cat.id ? 'text-rose-500' : 'text-gray-700 dark:text-gray-300'}`}>{cat.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-20 bg-gray-100 dark:bg-dark-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-12">
                        <div>
                            <span className="inline-block text-amber-500 font-semibold text-sm mb-2">
                                {sections.popular_dishes?.badge || '🔥 POPULAR'}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                                {sections.popular_dishes?.title || 'Most Loved Dishes'}
                            </h2>
                        </div>
                        <Link to="/search?tab=dishes" className="text-rose-500 font-semibold flex items-center gap-1">
                            {sections.popular_dishes?.buttonText || 'View All'} <FiArrowRight />
                        </Link>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularDishes.map((dish, idx) => (
                            <motion.div key={dish.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -10 }} className="group cursor-pointer">
                                <TiltCard className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-xl">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={dish.image} 
                                            alt={dish.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://cdn-icons-png.flaticon.com/512/1147/1147831.png'
                                                e.target.onerror = null
                                            }}
                                        />
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-lg flex items-center gap-1"><FiStar className="text-amber-500 fill-amber-500" size={14} /><span className="font-bold text-sm">{dish.rating}</span></div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{dish.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{dish.restaurant}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-rose-500">{dish.priceDisplay}</span>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddDish(dish)} className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl text-sm flex items-center gap-1"><FiPlus size={14} /> Add</motion.button>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-20 bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center text-white">
                                <p className="text-5xl md:text-6xl font-black mb-2"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                                <p className="text-white/80 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {testimonials.length > 0 && (
                <section className="relative z-10 py-20 bg-white dark:bg-dark-surface">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 bg-rose-500/10 text-rose-500 font-semibold rounded-full text-sm mb-4">
                                {sections.testimonials?.badge || 'TESTIMONIALS'}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                                {sections.testimonials?.title || 'What Our Users Say'}
                            </h2>
                        </motion.div>
                        <AnimatePresence mode="wait">
                            <motion.div key={currentTestimonial} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-card p-10 rounded-3xl text-center">
                                <div className="flex justify-center gap-1 mb-6">{[...Array(testimonials[currentTestimonial].metadata?.rating || 5)].map((_, i) => <FiStar key={i} className="text-amber-500 fill-amber-500" size={24} />)}</div>
                                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">"{testimonials[currentTestimonial].description}"</p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">{testimonials[currentTestimonial].image}</div>
                                    <div className="text-left"><p className="font-bold text-gray-900 dark:text-white">{testimonials[currentTestimonial].title}</p><p className="text-gray-500 text-sm">{testimonials[currentTestimonial].metadata?.role}</p></div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-center gap-2 mt-6">{testimonials.map((_, idx) => <motion.button key={idx} onClick={() => setCurrentTestimonial(idx)} animate={{ width: idx === currentTestimonial ? 32 : 10, backgroundColor: idx === currentTestimonial ? '#f43f5e' : '#d1d5db' }} className="h-2.5 rounded-full" />)}</div>
                    </div>
                </section>
            )}

            {offers.length > 0 && (
                <section className="relative z-10 py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}><FiZap size={36} className="text-amber-400" /></motion.div>
                                <div className="text-white">
                                    <h2 className="text-3xl font-black">{sections.flash_deals?.title || 'Flash Deals'}</h2>
                                    <p className="text-gray-400">{sections.flash_deals?.subtitle || 'Limited time!'}</p>
                                </div>
                            </div>
                            <Link to="/offers"><MagneticButton className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl flex items-center gap-2">View All <FiArrowRight /></MagneticButton></Link>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {offers.slice(0, 3).map((offer, idx) => (
                                <motion.div key={offer.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -10 }} className={`relative p-8 rounded-3xl bg-gradient-to-br ${offer.metadata?.color || 'from-rose-500 to-orange-500'} text-white overflow-hidden cursor-pointer`}>
                                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-4">{idx === 0 ? '🎉' : idx === 1 ? '🔥' : '💎'}</motion.div>
                                    <h3 className="text-2xl font-black mb-2">{offer.title}</h3>
                                    <p className="opacity-90 mb-6">{offer.description}</p>
                                    <span className="font-mono font-black text-xl bg-white/20 px-5 py-2 rounded-xl">{offer.metadata?.code}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                        <div>
                            <span className="inline-block text-rose-500 font-semibold text-sm mb-2">
                                {sections.restaurants?.badge || '🔥 TRENDING'}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                                {isLateNight ? 'Open Now' : (sections.restaurants?.title || 'Popular Restaurants')}
                            </h2>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {[{ id: 'all', label: 'All', emoji: '✨' }, { id: 'open', label: 'Open', emoji: '🟢' }, { id: 'latenight', label: 'Night', emoji: '🌙' }, { id: 'rating', label: 'Top', emoji: '⭐' }].map(f => (
                                <motion.button key={f.id} whileHover={{ scale: 1.05 }} onClick={() => setFilter(f.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${filter === f.id ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg' : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 shadow-md'}`}><span>{f.emoji}</span>{f.label}</motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">{loading ? [...Array(8)].map((_, i) => <RestaurantCardSkeleton key={i} />) : filteredRestaurants.map((r, idx) => <RestaurantCard key={r.id} restaurant={r} index={idx} />)}</AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {appCta && (
                <section className="relative z-10 py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 p-12 md:p-20 text-center text-white">
                            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-8xl mb-8">📱</motion.div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4">{appCta.title}</h2>
                            <p className="text-xl opacity-90 mb-10 max-w-lg mx-auto">{appCta.description}</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <MagneticButton className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-xl flex items-center gap-3"><span className="text-2xl">🍎</span><div className="text-left"><p className="text-xs opacity-60">Download on</p><p className="font-bold">App Store</p></div></MagneticButton>
                                <MagneticButton className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-xl flex items-center gap-3"><span className="text-2xl">🤖</span><div className="text-left"><p className="text-xs opacity-60">Get it on</p><p className="font-bold">Google Play</p></div></MagneticButton>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    )
}
