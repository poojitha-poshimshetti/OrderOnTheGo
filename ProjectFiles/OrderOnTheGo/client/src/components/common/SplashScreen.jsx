import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../../assets/logo.png'

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState('logo') // logo, loading, exit
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Phase 1: Show logo animation
        const logoTimer = setTimeout(() => setPhase('loading'), 1500)
        return () => clearTimeout(logoTimer)
    }, [])

    useEffect(() => {
        if (phase !== 'loading') return

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setPhase('exit')
                    setTimeout(() => onComplete?.(), 800)
                    return 100
                }
                return prev + Math.random() * 20
            })
        }, 100)

        return () => clearInterval(interval)
    }, [phase, onComplete])

    const foodEmojis = ['🍕', '🍔', '🍜', '🍱', '🥗', '🌮', '🍦', '🍩']

    return (
        <AnimatePresence>
            {phase !== 'exit' && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-rose-950">
                        {/* Floating Orbs */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.3, 1],
                                    x: [0, 100 * (i % 2 === 0 ? 1 : -1), 0],
                                    y: [0, -50, 0]
                                }}
                                transition={{
                                    duration: 6 + i,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                                className="absolute rounded-full blur-3xl"
                                style={{
                                    width: `${200 + i * 80}px`,
                                    height: `${200 + i * 80}px`,
                                    background: i % 3 === 0
                                        ? 'rgba(244, 63, 94, 0.3)'
                                        : i % 3 === 1
                                            ? 'rgba(168, 85, 247, 0.3)'
                                            : 'rgba(6, 182, 212, 0.2)',
                                    left: `${15 + i * 15}%`,
                                    top: `${20 + i * 10}%`,
                                }}
                            />
                        ))}

                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                backgroundSize: '50px 50px'
                            }}
                        />
                    </div>

                    {/* Floating Food Emojis */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {foodEmojis.map((emoji, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: '100vh', rotate: 0 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: ['100vh', '50vh', '0vh', '-20vh'],
                                    rotate: [0, 180, 360],
                                    x: [0, (i % 2 === 0 ? 50 : -50), 0]
                                }}
                                transition={{
                                    duration: 5,
                                    delay: i * 0.6,
                                    repeat: Infinity,
                                    ease: 'easeOut'
                                }}
                                className="absolute text-5xl"
                                style={{
                                    left: `${5 + i * 12}%`,
                                }}
                            >
                                {emoji}
                            </motion.span>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo Container */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 1.5, bounce: 0.4 }}
                            className="relative mb-8"
                        >
                            {/* Glow Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                className="absolute -inset-6 rounded-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, #f43f5e, #a855f7, #06b6d4, #fbbf24, #f43f5e)',
                                    filter: 'blur(20px)',
                                    opacity: 0.6
                                }}
                            />

                            {/* Logo Image */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative"
                            >
                                <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl p-4 shadow-2xl border border-white/20">
                                    <img
                                        src={Logo}
                                        alt="OrderOnTheGo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Brand Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mb-8"
                        >
                            <motion.h1
                                className="text-4xl sm:text-5xl font-black mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #f43f5e, #a855f7, #06b6d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                OrderOnTheGo
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-white/60 text-lg font-medium"
                            >
                                by SB Foods
                            </motion.p>
                        </motion.div>

                        {/* Progress Bar */}
                        {phase === 'loading' && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: '280px' }}
                                className="relative"
                            >
                                <div className="w-70 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(progress, 100)}%` }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: 'linear-gradient(90deg, #f43f5e, #a855f7, #06b6d4)'
                                        }}
                                    />
                                </div>

                                {/* Loading Text */}
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-center text-white/50 text-sm mt-4"
                                >
                                    Preparing deliciousness...
                                </motion.p>
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 text-white/40 text-sm"
                    >
                        Your cravings, delivered 🚀
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
