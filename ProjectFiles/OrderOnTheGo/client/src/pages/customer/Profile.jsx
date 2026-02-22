import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiLogOut, FiChevronRight, FiHeart, FiShoppingBag, FiSettings, FiHelpCircle, FiGift, FiCreditCard, FiBell, FiShield, FiPlus, FiTrash2, FiHome, FiBriefcase } from 'react-icons/fi'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, logout, updateProfile, addAddress, deleteAddress, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile') // 'profile', 'addresses'
    const [isEditing, setIsEditing] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)

    // Profile Form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    })

    // Address Form
    const [addressData, setAddressData] = useState({
        type: 'Home',
        address: '',
        city: '',
        pincode: '',
        isDefault: false
    })

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">👤</motion.div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Sign in to continue</h1>
                    <p className="text-gray-500 mb-8">Access your profile, orders, and favorites</p>
                    <Link to="/login">
                        <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl">
                            Sign In
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    const handleProfileSave = async () => {
        const result = await updateProfile(profileData)
        if (result.success) {
            setIsEditing(false)
            toast.success('Profile updated!', { icon: '✅' })
        } else {
            toast.error(result.error)
        }
    }

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully', { icon: '👋' })
        navigate('/')
    }

    const handleAddAddress = async (e) => {
        e.preventDefault()
        const result = await addAddress(addressData)
        if (result.success) {
            setShowAddressModal(false)
            setAddressData({ type: 'Home', address: '', city: '', pincode: '', isDefault: false })
            toast.success('Address added successfully!')
        } else {
            toast.error(result.error)
        }
    }

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const result = await deleteAddress(id)
            if (result.success) {
                toast.success('Address deleted')
            } else {
                toast.error(result.error)
            }
        }
    }

    const menuItems = [
        { icon: FiShoppingBag, label: 'My Orders', link: '/orders', color: 'from-blue-500 to-cyan-500' },
        { icon: FiHeart, label: 'Favorites', link: '/favorites', color: 'from-rose-500 to-pink-500' },
        { icon: FiMapPin, label: 'Saved Addresses', action: () => setActiveTab('addresses'), color: 'from-green-500 to-emerald-500', active: activeTab === 'addresses' },
        { icon: FiCreditCard, label: 'Payment Methods', link: '#', color: 'from-purple-500 to-indigo-500' },
        { icon: FiGift, label: 'Offers & Rewards', link: '/offers', color: 'from-amber-500 to-orange-500' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-600 via-purple-600 to-cyan-600 pt-12 pb-24 relative overflow-hidden">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="mb-4">
                        <BackButton />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6">
                        <motion.div whileHover={{ scale: 1.1 }} className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
                            {user?.name?.charAt(0) || '👤'}
                        </motion.div>
                        <div className="text-white">
                            <h1 className="text-3xl font-black">{user?.name}</h1>
                            <p className="text-white/80">{user?.email}</p>
                            <p className="text-white/60 text-sm">{user?.phone}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-dark-card rounded-3xl shadow-xl overflow-hidden">
                        <div
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-border transition-colors ${activeTab === 'profile' ? 'bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500' : ''}`}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                                <FiUser className="text-white" size={18} />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">My Profile</span>
                        </div>
                        {menuItems.map((item) => (
                            item.link ? (
                                <Link key={item.label} to={item.link}>
                                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors border-t border-gray-100 dark:border-dark-border">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                                            <item.icon className="text-white" size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div
                                    key={item.label}
                                    onClick={item.action}
                                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-border transition-colors border-t border-gray-100 dark:border-dark-border ${item.active ? 'bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500' : ''}`}
                                >
                                    <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                                        <item.icon className="text-white" size={18} />
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
                                </div>
                            )
                        ))}
                        <div onClick={handleLogout} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors border-t border-gray-100 dark:border-dark-border">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <FiLogOut size={18} />
                            </div>
                            <span className="font-bold">Logout</span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white dark:bg-dark-card rounded-3xl shadow-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                                    <button
                                        onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                                        className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${isEditing ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300'}`}
                                    >
                                        {isEditing ? '✓ Save Changes' : <><FiEdit2 size={16} /> Edit Profile</>}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: FiUser, label: 'Full Name', key: 'name' },
                                        { icon: FiMail, label: 'Email Address', key: 'email' },
                                        { icon: FiPhone, label: 'Phone Number', key: 'phone' }
                                    ].map((field) => (
                                        <div key={field.key} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-border rounded-2xl">
                                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                                                <field.icon size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={profileData[field.key]}
                                                        onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                        className="w-full bg-white dark:bg-dark-card px-3 py-1 rounded-lg border-2 border-rose-500 outline-none font-semibold text-gray-900 dark:text-white"
                                                    />
                                                ) : (
                                                    <p className="font-semibold text-gray-900 dark:text-white">{profileData[field.key] || '-'}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'addresses' && (
                            <motion.div
                                key="addresses"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white dark:bg-dark-card rounded-3xl shadow-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                                    <button
                                        onClick={() => setShowAddressModal(true)}
                                        className="px-4 py-2 bg-rose-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-rose-600 transition-colors"
                                    >
                                        <FiPlus size={18} /> Add New
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {user?.addresses?.length > 0 ? (
                                        user.addresses.map((addr) => (
                                            <div key={addr._id} className="p-4 border-2 border-gray-100 dark:border-dark-border rounded-2xl flex items-start gap-4 hover:border-rose-500/30 transition-colors group relative">
                                                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-500 shrink-0">
                                                    {addr.type === 'Home' ? <FiHome size={18} /> : addr.type === 'Office' ? <FiBriefcase size={18} /> : <FiMapPin size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{addr.type}</h3>
                                                        {addr.isDefault && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Default</span>}
                                                    </div>
                                                    <p className="text-gray-500 text-sm leading-relaxed">{addr.address}, {addr.city} - {addr.pincode}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            <FiMapPin size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No addresses saved yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Address Modal */}
            <AnimatePresence>
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl shadow-2xl p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Address</h2>
                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                                    <div className="flex gap-4">
                                        {['Home', 'Office', 'Other'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAddressData({ ...addressData, type })}
                                                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 ${addressData.type === type ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="House/Flat No, Street, Area"
                                        required
                                        value={addressData.address}
                                        onChange={e => setAddressData({ ...addressData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-border outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            required
                                            value={addressData.city}
                                            onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-border outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Pincode"
                                            required
                                            value={addressData.pincode}
                                            onChange={e => setAddressData({ ...addressData, pincode: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-border outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={addressData.isDefault}
                                        onChange={e => setAddressData({ ...addressData, isDefault: e.target.checked })}
                                        className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Set as default address</span>
                                </label>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressModal(false)}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 font-bold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
