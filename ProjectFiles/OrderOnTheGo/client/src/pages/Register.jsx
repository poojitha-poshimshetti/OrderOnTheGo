import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import BackButton from '../components/common/BackButton'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            toast.error('Please fill all fields')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        if (!agreed) {
            toast.error('Please agree to terms & conditions')
            return
        }

        setIsLoading(true)

        try {
            const result = await register(formData.name, formData.email, formData.phone, formData.password)

            if (result.success) {
                toast.success('Account created successfully!', { icon: '🎉' })
                navigate('/')
            } else {
                toast.error(result.error || 'Registration failed')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const inputFields = [
        { name: 'name', type: 'text', placeholder: 'Your full name', icon: FiUser, label: 'Full Name' },
        { name: 'email', type: 'email', placeholder: 'your@email.com', icon: FiMail, label: 'Email' },
        { name: 'phone', type: 'tel', placeholder: '10 digit phone number', icon: FiPhone, label: 'Phone' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-purple-600 to-rose-600 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-6 left-6 z-50">
                <BackButton />
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-center mb-8">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">🍔</motion.div>
                    <h1 className="text-3xl font-black text-white">Create Account</h1>
                    <p className="text-white/70 mt-2">Join us for delicious food!</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {inputFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                                <div className="relative">
                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-gray-900 outline-none transition-all placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 6 characters"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-800 text-white rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-gray-900 outline-none transition-all placeholder:text-gray-500"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-gray-900 outline-none transition-all placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setAgreed(!agreed)}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-rose-500 border-rose-500' : 'border-gray-300'}`}
                            >
                                {agreed && <FiCheck className="text-white" size={14} />}
                            </motion.div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">I agree to the <span className="text-rose-500">Terms & Conditions</span></span>
                        </label>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>Create Account <FiArrowRight /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center mt-6 text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-rose-500 font-semibold hover:underline">Sign In</Link>
                    </p>
                </motion.div>

                <Link to="/" className="block text-center mt-6 text-white/70 hover:text-white transition-colors">← Back to Home</Link>
            </motion.div>
        </div>
    )
}
