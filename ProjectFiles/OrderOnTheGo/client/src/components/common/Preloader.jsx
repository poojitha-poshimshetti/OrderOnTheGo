import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ onComplete }) {
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsLoading(false)
                        onComplete?.()
                    }, 500)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 100)

        return () => clearInterval(interval)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
                >
                    {/* Animated Background Circles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0.1, 0.3, 0.1],
                                    scale: [1, 1.5, 1],
                                    x: [0, 50, 0],
                                    y: [0, -30, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    delay: i * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute rounded-full"
                                style={{
                                    width: `${150 + i * 100}px`,
                                    height: `${150 + i * 100}px`,
                                    background: `radial-gradient(circle, ${i % 2 === 0
                                            ? 'rgba(251, 113, 133, 0.2)'
                                            : 'rgba(168, 85, 247, 0.2)'
                                        } 0%, transparent 70%)`,
                                    left: `${20 + i * 10}%`,
                                    top: `${30 + i * 5}%`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1.5 }}
                        className="relative z-10 mb-8"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-50"
                            />
                            <div className="relative w-28 h-28 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-white font-black text-5xl"
                                >
                                    O
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Brand Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 text-center mb-8"
                    >
                        <h1 className="text-4xl font-black bg-gradient-to-r from-rose-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            OrderOnTheGo
                        </h1>
                        <p className="text-white/60 mt-2 font-medium">by SB Foods</p>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: '240px' }}
                        transition={{ delay: 0.5 }}
                        className="relative z-10"
                    >
                        <div className="w-60 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-full"
                            />
                        </div>
                        <p className="text-center text-white/50 text-sm mt-3">
                            {Math.min(Math.round(progress), 100)}%
                        </p>
                    </motion.div>

                    {/* Loading Text Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="relative z-10 mt-8 flex items-center gap-2"
                    >
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-white/60 text-sm"
                        >
                            Preparing your delicious experience
                        </motion.span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-white/60"
                        >
                            ...
                        </motion.span>
                    </motion.div>

                    {/* Floating Food Icons */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {['🍕', '🍔', '🌮', '🍜', '🍱', '🥗', '🍦', '☕'].map((emoji, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: [-20, -200],
                                    x: [0, (i % 2 === 0 ? 30 : -30)]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                className="absolute text-4xl"
                                style={{
                                    left: `${10 + i * 12}%`,
                                    bottom: '10%'
                                }}
                            >
                                {emoji}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
