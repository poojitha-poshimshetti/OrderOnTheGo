import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../../assets/logo.png'
import {
    FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube,
    FiMail, FiPhone, FiMapPin, FiArrowUp, FiHeart
} from 'react-icons/fi'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Blog', path: '/blog' },
            { name: 'Partner with us', path: '/partner' }
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'FAQs', path: '/faqs' },
            { name: 'Report Issue', path: '/report' }
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Refund Policy', path: '/refund' },
            { name: 'Cookie Policy', path: '/cookies' }
        ]
    }

    const socialLinks = [
        { icon: FiFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: FiTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: FiInstagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
        { icon: FiLinkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
        { icon: FiYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' }
    ]

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface border-t border-gray-200 dark:border-dark-border">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl blur-lg opacity-50" />
                                <div className="relative w-14 h-14 bg-white dark:bg-dark-card rounded-2xl p-2 shadow-xl">
                                    <img src={Logo} alt="OrderOnTheGo" className="w-full h-full object-contain" />
                                </div>
                            </motion.div>
                            <div>
                                <h2 className="font-bold text-xl">
                                    <span className="text-rose-500">Order</span>
                                    <span className="text-orange-500">On</span>
                                    <span className="text-green-500">TheGo</span>
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">by SB Foods</p>
                            </div>
                        </Link>

                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
                            Your favorite food, delivered fast. From late night cravings to quick lunches,
                            we've got you covered 24/7. Experience the joy of hassle-free food delivery! 🍕
                        </p>

                        {/* App Download Badges */}
                        <div className="flex gap-3 mb-6">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -3 }}
                                className="px-4 py-2 bg-black rounded-xl flex items-center gap-2 cursor-pointer"
                            >
                                <span className="text-2xl">🍎</span>
                                <div className="text-white">
                                    <p className="text-[10px] opacity-80">Download on</p>
                                    <p className="text-sm font-semibold">App Store</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -3 }}
                                className="px-4 py-2 bg-black rounded-xl flex items-center gap-2 cursor-pointer"
                            >
                                <span className="text-2xl">🤖</span>
                                <div className="text-white">
                                    <p className="text-[10px] opacity-80">Get it on</p>
                                    <p className="text-sm font-semibold">Google Play</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <motion.a
                                whileHover={{ x: 5 }}
                                href="mailto:hello@sbfoods.com"
                                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
                            >
                                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                                    <FiMail className="text-rose-500" size={18} />
                                </div>
                                <span>hello@sbfoods.com</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ x: 5 }}
                                href="tel:+919876543210"
                                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
                            >
                                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <FiPhone className="text-green-500" size={18} />
                                </div>
                                <span>+91 98765 43210</span>
                            </motion.a>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <FiMapPin className="text-blue-500" size={18} />
                                </div>
                                <span>Bangalore, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5 text-lg capitalize">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <motion.div whileHover={{ x: 5 }}>
                                            <Link
                                                to={link.path}
                                                className="text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors inline-flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-8 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl border border-rose-500/20"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Subscribe to our newsletter 📬
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Get exclusive deals and updates delivered to your inbox!
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-72 px-5 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:border-rose-500 focus:outline-none dark:text-white"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-dark-border mt-12 pt-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            © {currentYear} SB Foods. Made with
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <FiHeart className="text-rose-500 fill-rose-500" />
                            </motion.span>
                            in India
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.2, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-11 h-11 rounded-xl bg-white dark:bg-dark-card shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3 bg-white dark:bg-dark-card px-4 py-2 rounded-xl shadow-lg">
                            <span className="text-xs text-gray-500 font-medium">We accept:</span>
                            <div className="flex gap-2">
                                {['💳', '🏦', '📱', '🪙'].map((icon, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.2, y: -3 }}
                                        className="text-xl cursor-pointer"
                                    >
                                        {icon}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="fixed bottom-24 right-6 md:bottom-8 w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full shadow-xl shadow-rose-500/30 flex items-center justify-center z-40"
            >
                <FiArrowUp size={22} />
            </motion.button>
        </footer>
    )
}
