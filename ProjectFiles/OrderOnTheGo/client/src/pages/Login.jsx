import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import BackButton from '../components/common/BackButton'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please fill all fields')
            return
        }

        setIsLoading(true)

        try {
            const result = await login(email, password)

            if (result.success) {
                toast.success(`Welcome back, ${result.user.name}!`, { icon: '👋' })
                navigate(result.user.role === 'admin' ? '/admin' : '/')
            } else {
                toast.error(result.error || 'Invalid email or password')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <BackButton />
            </div>

            {/* Background decorations */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-center mb-8">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">
                        🍽️
                    </motion.div>
                    <h1 className="text-3xl font-black text-white">Welcome Back!</h1>
                    <p className="text-white/70 mt-2">Sign in to continue ordering</p>
                </motion.div>

                {/* Form Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-gray-900 outline-none transition-all placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-800 text-white rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-gray-900 outline-none transition-all placeholder:text-gray-500"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-sm text-rose-500 font-semibold hover:underline">Forgot Password?</button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>Sign In <FiArrowRight /></>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
                        <span className="text-gray-400 text-sm">or</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
                    </div>



                    {/* Register Link */}
                    <p className="text-center mt-6 text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-rose-500 font-semibold hover:underline">Sign Up</Link>
                    </p>
                </motion.div>

                {/* Back to Home */}
                <Link to="/" className="block text-center mt-6 text-white/70 hover:text-white transition-colors">
                    ← Back to Home
                </Link>
            </motion.div>
        </div>
    )
}
