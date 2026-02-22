import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { contentAPI } from '../../services/api'
import { FiPercent, FiClock, FiCopy, FiCheck, FiArrowRight, FiGift, FiZap } from 'react-icons/fi'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

// Countdown Timer
const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        if (!endTime) return { hours: 0, minutes: 0, seconds: 0 }
        const diff = new Date(endTime) - new Date()
        if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
        return {
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
        return () => clearInterval(timer)
    }, [endTime])

    return (
        <div className="flex gap-2">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                        {String(value).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-white/70">{unit}</span>
                </div>
            ))}
        </div>
    )
}

// Confetti Effect
const Confetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][Math.floor(Math.random() * 5)]
    }))

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiPieces.map(piece => (
                <motion.div
                    key={piece.id}
                    initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
                    animate={{ y: 500, x: Math.random() * 100 - 50, rotate: 360, opacity: 0 }}
                    transition={{ duration: 3, delay: piece.delay, repeat: Infinity }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
                />
            ))}
        </div>
    )
}

export default function Offers() {
    const [copiedCode, setCopiedCode] = useState(null)
    const [activeTab, setActiveTab] = useState('all')
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await contentAPI.getContent('offer')
                setOffers(data)
            } catch (error) {
                console.error('Failed to fetch offers:', error)
                toast.error('Failed to load offers')
            } finally {
                setLoading(false)
            }
        }
        fetchOffers()
    }, [])

    const flashOffers = offers.filter(o => o.metadata?.flash || o.metadata?.type === 'flash')

    // Filter logic might need adjustment based on how metadata is structured in DB
    // For now assuming all offers are valid
    const filteredOffers = activeTab === 'all'
        ? offers
        : offers.filter(o => o.metadata?.category === activeTab)

    const copyCode = (code) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        toast.success(`Copied: ${code}`, { icon: '📋' })
        setTimeout(() => setCopiedCode(null), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-4xl">⚡</motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero with Confetti */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 py-12 relative overflow-hidden">
                <Confetti />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="mb-4">
                        <BackButton />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <FiGift className="text-white" size={40} />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-black text-white">Offers & Deals</h1>
                            <p className="text-white/80">Save big on your favorite food!</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Flash Sale Banner */}
            {/* Currently mocking flash sale logic as DB might not have expiry yet */}
            <div className="bg-gradient-to-r from-rose-600 to-purple-600 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-3xl">⚡</motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Flash Sale!</h2>
                                <p className="text-white/80">Limited time offer - Don't miss out!</p>
                            </div>
                        </div>
                        <CountdownTimer endTime={new Date(Date.now() + 86400000).toISOString()} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-16 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'all', label: 'All Offers', icon: '🎁' },
                            { id: 'new', label: 'New User', icon: '👋' },
                            { id: 'delivery', label: 'Free Delivery', icon: '🚚' },
                            { id: 'discount', label: 'Discounts', icon: '💰' },
                            { id: 'special', label: 'Special', icon: '⭐' },
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredOffers.map((offer, idx) => (
                            <motion.div
                                key={offer._id || idx}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -5 }}
                                className={`bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-lg relative ${offer.metadata?.flash ? 'ring-2 ring-rose-500' : ''}`}
                            >
                                {offer.metadata?.flash && (
                                    <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs font-bold rounded-bl-xl flex items-center gap-1">
                                        <FiZap size={12} /> FLASH
                                    </div>
                                )}
                                <div className={`p-6 bg-gradient-to-br ${offer.metadata?.color || 'from-amber-400 to-orange-500'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <FiPercent className="text-white" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{offer.title}</h3>
                                            <p className="text-white/80">{offer.metadata?.subtitle || 'Limited Offer'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{offer.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span>Min: ₹{offer.metadata?.minOrder || 199}</span>
                                        <span>•</span>
                                        <span>Max: ₹{offer.metadata?.maxDiscount || 100}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-border rounded-xl font-mono font-bold text-gray-900 dark:text-white border-2 border-dashed border-gray-300 dark:border-dark-border">
                                            {offer.metadata?.code}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => copyCode(offer.metadata?.code)}
                                            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${copiedCode === offer.metadata?.code ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}`}
                                        >
                                            {copiedCode === offer.metadata?.code ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                                        </motion.button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                                        <FiClock size={14} />
                                        <span>Valid till: {new Date(Date.now() + 86400000 * 7).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
                    <p className="text-gray-500 mb-4">Ready to save on your next order?</p>
                    <Link to="/search">
                        <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 mx-auto">
                            Order Now <FiArrowRight />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
