import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'

export default function Layout({ isAdmin = false }) {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
            <Navbar isAdmin={isAdmin} />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pt-20 pb-24 md:pb-12"
            >
                <Outlet />
            </motion.main>

            <Footer />

            {/* Mobile Bottom Navigation */}
            {!isAdmin && <BottomNav />}
        </div>
    )
}
