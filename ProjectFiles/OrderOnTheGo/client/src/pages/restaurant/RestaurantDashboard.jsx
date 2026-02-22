import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiPackage, FiCheck, FiClock, FiTruck, FiMenu, FiLogOut,
    FiPlus, FiEdit, FiTrash2, FiSettings, FiUser, FiLock, FiDollarSign, FiShoppingBag, FiActivity
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { restaurantAPI, orderAPI, productAPI, userAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/common/BackButton'

export default function RestaurantDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [restaurant, setRestaurant] = useState(null)
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('orders') // orders, menu, settings
    const [verifyOtp, setVerifyOtp] = useState({ orderId: null, otp: '' })

    // Menu Form State
    const [showProductModal, setShowProductModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', image: '',
        category: '', isVeg: true, isAvailable: true
    })

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    })

    useEffect(() => {
        if (user?.role !== 'restaurant') {
            navigate('/login')
            return
        }
        fetchData()
        const interval = setInterval(fetchData, 15000) // Poll for new orders
        return () => clearInterval(interval)
    }, [user])

    const fetchData = async () => {
        try {
            const [restData, ordersData] = await Promise.all([
                restaurantAPI.getMyRestaurant(),
                orderAPI.getAllAdmin()
            ])
            setRestaurant(restData)

            // Filter orders for this restaurant
            const myOrders = ordersData.filter(o => o.restaurant._id === restData._id || o.restaurant === restData._id)
            setOrders(myOrders)

            // Fetch Products
            if (restData._id) {
                const prodData = await productAPI.getByRestaurant(restData._id)
                setProducts(prodData)
            }
        } catch (error) {
            console.error(error)
            // toast.error('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            if (newStatus === 'delivered') {
                setVerifyOtp({ orderId, otp: '' })
                return
            }
            await orderAPI.updateStatus(orderId, newStatus)
            toast.success(`Order updated to ${newStatus}`)
            fetchData()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleVerifyOtp = async () => {
        try {
            await restaurantAPI.verifyOtp(verifyOtp.orderId, verifyOtp.otp)
            toast.success('Order delivered successfully!')
            setVerifyOtp({ orderId: null, otp: '' })
            fetchData()
        } catch (error) {
            toast.error(error.message || 'Invalid OTP')
        }
    }

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price)
            }

            if (!payload.category) delete payload.category

            if (editingProduct) {
                await productAPI.update(editingProduct._id, payload)
                toast.success('Product updated')
            } else {
                await productAPI.create(payload)
                toast.success('Product created')
            }
            setShowProductModal(false)
            fetchData()
        } catch (error) {
            toast.error(error.message || 'Failed to save product')
        }
    }

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await productAPI.delete(id)
            toast.success('Product deleted')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const openProductModal = (product = null) => {
        setEditingProduct(product)
        if (product) {
            setProductForm({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category?._id || product.category || '',
                isVeg: product.isVeg,
                isAvailable: product.isAvailable
            })
        } else {
            setProductForm({
                name: '', description: '', price: '', image: '',
                category: '', isVeg: true, isAvailable: true
            })
        }
        setShowProductModal(true)
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error('Passwords do not match')
        }
        try {
            await userAPI.updateProfile({ password: passwordForm.newPassword })
            toast.success('Password updated successfully')
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            toast.error(error.message || 'Failed to update password')
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
    )

    // Stats Calculations
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0)
    const activeOrdersCount = orders.filter(o => ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length
    const completedOrdersCount = orders.filter(o => o.status === 'delivered').length

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg font-sans">
            {/* Sidebar / Navigation */}
            <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border z-40 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent hidden md:block">
                        {restaurant?.name || 'Dashboard'}
                    </h1>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block mt-1">Partner Panel</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
                        { id: 'menu', label: 'Menu', icon: <FiMenu /> },
                        { id: 'settings', label: 'Settings', icon: <FiSettings /> }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-semibold hidden md:block">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                        <FiLogOut className="text-xl" />
                        <span className="font-semibold hidden md:block">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-4 md:p-8">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-6 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <BackButton />
                        <h1 className="font-bold text-lg">{restaurant?.name}</h1>
                    </div>
                    <button onClick={logout}><FiLogOut /></button>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-2">
                    {['orders', 'menu', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'bg-rose-500 text-white' : 'bg-white text-gray-600'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                {activeTab === 'orders' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-green-100 text-green-600' },
                            { label: 'Active Orders', value: activeOrdersCount, icon: <FiActivity />, color: 'bg-blue-100 text-blue-600' },
                            { label: 'Completed', value: completedOrdersCount, icon: <FiCheck />, color: 'bg-purple-100 text-purple-600' },
                            { label: 'Total Items', value: products.length, icon: <FiPackage />, color: 'bg-orange-100 text-orange-600' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Orders</h2>
                            <button onClick={fetchData} className="w-10 h-10 bg-white dark:bg-dark-card rounded-full flex items-center justify-center shadow-sm hover:rotate-180 transition-transform">
                                🔄
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {orders.map((order, idx) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden group hover:shadow-lg transition-all"
                                    >
                                        <div className={`h-2 w-full ${order.status === 'placed' ? 'bg-blue-500' :
                                            order.status === 'confirmed' ? 'bg-rose-500' :
                                                order.status === 'preparing' ? 'bg-amber-500' :
                                                    order.status === 'out_for_delivery' ? 'bg-orange-500' :
                                                        'bg-green-500'
                                            }`} />

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">#{order._id.slice(-6).toUpperCase()}</h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'placed' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                                                        order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                            <span className="text-gray-900 dark:text-white font-bold">{item.quantity}x</span> {item.name || item.product?.name}
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white">₹{(item.price || 0) * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-dark-border mb-4">
                                                <span className="text-gray-500 text-sm">Total Amount</span>
                                                <span className="text-xl font-black text-gray-900 dark:text-white">₹{order.total}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid gap-2">
                                                {order.status === 'pending' || order.status === 'placed' ? (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'confirmed')} className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-200">Accept Order</button>
                                                ) : order.status === 'confirmed' ? (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'preparing')} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200">Start Preparing</button>
                                                ) : order.status === 'preparing' ? (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-200">Mark Ready & Send</button>
                                                ) : order.status === 'out_for_delivery' ? (
                                                    <button onClick={() => setVerifyOtp({ orderId: order._id, otp: '' })} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200">Verify OTP</button>
                                                ) : (
                                                    <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                                                        <FiCheck /> Completed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {orders.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border-2 border-dashed border-gray-200">
                                <span className="text-6xl">😴</span>
                                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">No active orders</h3>
                                <p className="text-gray-500">Wait for new orders to arrive!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'menu' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h2>
                                <p className="text-gray-500">Manage your restaurant's items</p>
                            </div>
                            <button onClick={() => openProductModal()} className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200">
                                <FiPlus /> Add Item
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <motion.div layout key={product._id} className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border group">
                                    <div className="relative">
                                        <img src={product.image} alt={product.name} className="w-full h-48 rounded-xl object-cover mb-4" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openProductModal(product)} className="p-2 bg-white/90 backdrop-blur-sm hover:bg-blue-50 text-blue-600 rounded-lg shadow-sm"><FiEdit /></button>
                                            <button onClick={() => deleteProduct(product._id)} className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 rounded-lg shadow-sm"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.isVeg ? 'VEG' : 'NON-VEG'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'settings' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="p-3 bg-gray-100 rounded-xl"><FiLock /></div>
                                Security Settings
                            </h2>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:text-white"
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:text-white"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* OTP Modal */}
            <AnimatePresence>
                {verifyOtp.orderId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500" />
                            <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white text-center">Verify Delivery</h3>
                            <p className="text-center text-gray-500 mb-8">Ask customer for the OTP</p>

                            <input
                                type="text"
                                maxLength={4}
                                placeholder="0 0 0 0"
                                value={verifyOtp.otp}
                                onChange={(e) => setVerifyOtp({ ...verifyOtp, otp: e.target.value })}
                                className="w-full text-center text-4xl font-mono font-bold tracking-[0.5em] py-4 mb-8 border-b-2 border-gray-100 focus:border-rose-500 outline-none bg-transparent transition-colors"
                            />

                            <div className="flex gap-4">
                                <button onClick={() => setVerifyOtp({ orderId: null, otp: '' })} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Cancel</button>
                                <button onClick={handleVerifyOtp} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all">Verify</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Product Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white dark:bg-dark-card rounded-3xl p-8 w-full max-w-lg shadow-2xl h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingProduct ? 'Edit Item' : 'Add New Item'}</h3>
                                    <p className="text-gray-500 text-sm">Fill in the details below</p>
                                </div>
                                <button onClick={() => setShowProductModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><FiMenu className="rotate-45" /></button>
                            </div>

                            <form onSubmit={handleProductSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Item Name</label>
                                    <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:bg-dark-surface dark:text-white" placeholder="e.g. Butter Chicken" required />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Price (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                            <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full pl-8 pr-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:bg-dark-surface dark:text-white" placeholder="0" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-dark-surface w-full rounded-xl border-2 border-transparent hover:border-green-200 transition-colors">
                                            <input type="checkbox" checked={productForm.isVeg} onChange={e => setProductForm({ ...productForm, isVeg: e.target.checked })} className="w-6 h-6 accent-green-500 rounded-lg" />
                                            <span className="font-bold">Vegetarian</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Description</label>
                                    <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:bg-dark-surface dark:text-white" rows="3" placeholder="Describe the dish..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Image URL</label>
                                    <input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-500 outline-none transition-all dark:bg-dark-surface dark:text-white" placeholder="https://..." />
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Save Item</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

