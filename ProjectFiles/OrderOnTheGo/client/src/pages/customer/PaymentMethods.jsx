import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCreditCard, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi'
import { userAPI } from '../../services/api'
import BackButton from '../../components/common/BackButton'
import toast from 'react-hot-toast'

export default function PaymentMethods() {
    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        type: 'Card', // Card, UPI
        cardNumber: '',
        upiId: '',
        cardHolder: '',
        expiry: '',
        isDefault: false
    })

    useEffect(() => {
        fetchMethods()
    }, [])

    const fetchMethods = async () => {
        try {
            const data = await userAPI.getPaymentMethods()
            setMethods(data)
        } catch (error) {
            toast.error('Failed to load payment methods')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this payment method?')) return
        try {
            const updated = await userAPI.deletePaymentMethod(id)
            setMethods(updated)
            toast.success('Payment method removed')
        } catch (error) {
            toast.error('Failed to remove')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const updated = await userAPI.addPaymentMethod(formData)
            setMethods(updated)
            toast.success('Payment method added')
            setShowForm(false)
            setFormData({
                type: 'Card',
                cardNumber: '',
                upiId: '',
                cardHolder: '',
                expiry: '',
                isDefault: false
            })
        } catch (error) {
            toast.error(error.message || 'Failed to add payment method')
        }
    }

    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <BackButton />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Methods</h1>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200"
                        >
                            <FiPlus /> Add New
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {methods.length > 0 ? (
                        methods.map(method => (
                            <div key={method._id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${method.type === 'Card' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <FiCreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {method.type === 'Card' ? `•••• •••• •••• ${method.cardNumber.slice(-4)}` : method.upiId}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {method.type === 'Card' ? `Expires ${method.expiry}` : 'UPI ID'}
                                        </p>
                                    </div>
                                    {method.isDefault && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Default</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(method._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-200">
                            No payment methods saved
                        </div>
                    )}
                </div>

                {/* Add Payment Method Modal */}
                <AnimatePresence>
                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-dark-card w-full max-w-md p-6 rounded-2xl shadow-xl"
                            >
                                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Add Payment Method</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'Card' })}
                                            className={`p-3 rounded-xl border text-center font-medium transition-colors ${formData.type === 'Card'
                                                ? 'border-rose-500 bg-rose-50 text-rose-600'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            Card
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'UPI' })}
                                            className={`p-3 rounded-xl border text-center font-medium transition-colors ${formData.type === 'UPI'
                                                ? 'border-rose-500 bg-rose-50 text-rose-600'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            UPI
                                        </button>
                                    </div>

                                    {formData.type === 'Card' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Card Number</label>
                                                <input
                                                    type="text"
                                                    maxLength="16"
                                                    value={formData.cardNumber}
                                                    onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-dark-surface dark:border-dark-border"
                                                    placeholder="0000 0000 0000 0000"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Expiry</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={formData.expiry}
                                                        onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-dark-surface dark:border-dark-border"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">CVC</label>
                                                    <input
                                                        type="text"
                                                        maxLength="3"
                                                        placeholder="123"
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-dark-surface dark:border-dark-border"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Card Holder Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.cardHolder}
                                                    onChange={e => setFormData({ ...formData, cardHolder: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-dark-surface dark:border-dark-border"
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="username@bank"
                                                value={formData.upiId}
                                                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:bg-dark-surface dark:border-dark-border"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mt-4">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            checked={formData.isDefault}
                                            onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                            className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-medium">Set as default payment method</label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200"
                                        >
                                            Save Method
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
