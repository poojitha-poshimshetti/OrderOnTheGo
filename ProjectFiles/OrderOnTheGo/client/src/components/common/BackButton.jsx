import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft } from 'react-icons/fi'

export default function BackButton() {
    const navigate = useNavigate()
    const location = useLocation()

    // Show on every page except the absolute home page
    if (location.pathname === '/' && !location.search) {
        return null
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-dark-surface/50 dark:hover:bg-dark-accent/50 backdrop-blur-md border border-white/20 dark:border-dark-border text-gray-800 dark:text-white transition-all shadow-sm mr-4"
        >
            <FiChevronLeft size={20} />
            <span className="hidden sm:inline font-medium text-sm">Back</span>
        </motion.button>
    )
}
