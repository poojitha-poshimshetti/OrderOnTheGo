import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheck, FiArrowRight, FiDollarSign, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/common/BackButton'

export default function Partner() {
    const { user, isAdmin } = useAuth()

    const benefits = [
        {
            icon: FiTrendingUp,
            title: 'Grow Your Business',
            description: 'Reach thousands of new customers in your area and boost your sales.'
        },
        {
            icon: FiDollarSign,
            title: 'Seamless Payments',
            description: 'Get paid weekly with our automated and transparent payment system.'
        },
        {
            icon: FiUsers,
            title: 'Dedicated Support',
            description: 'Our team is here 24/7 to help you succeed with marketing and operations.'
        }
    ]

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-500/30 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')] bg-cover bg-center opacity-10" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-start mb-6">
                        <BackButton />
                    </div>
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-6xl font-black mb-6"
                        >
                            Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">OrderOnTheGo</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                        >
                            Join thousands of restaurants that trust us to deliver their food and grow their business.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {isAdmin ? (
                                <Link to="/admin/restaurants">
                                    <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                        Manage Restaurants <FiArrowRight />
                                    </button>
                                </Link>
                            ) : user?.role === 'restaurant' ? (
                                <Link to="/restaurant-dashboard">
                                    <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                        Go to Dashboard <FiArrowRight />
                                    </button>
                                </Link>
                            ) : (
                                <a href="mailto:partners@sbfoods.com">
                                    <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                        Contact to Join
                                    </button>
                                </a>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-50 dark:bg-dark-card p-8 rounded-3xl border border-gray-100 dark:border-dark-border hover:shadow-xl transition-shadow"
                        >
                            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400">
                                <benefit.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to grow your business?</h2>
                    <p className="text-gray-400 mb-8">We're currently accepting new partners in Bangalore. Contact our onboarding team today.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg font-medium">
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-green-500" /> 0% Commission for 1st Month
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-green-500" /> Free Tablet
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-green-500" /> 24/7 Support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
