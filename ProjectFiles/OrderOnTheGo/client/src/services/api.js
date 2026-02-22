const API_URL = 'http://localhost:5001/api'

// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken()

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    }

    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'API request failed')
    }

    return data
}

// ==================== AUTH ====================
export const authAPI = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),

    getMe: () => apiRequest('/auth/me')
}

// ==================== USERS ====================
export const userAPI = {
    getProfile: () => apiRequest('/users/profile'),

    updateProfile: (data) => apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    addAddress: (address) => apiRequest('/users/address', {
        method: 'POST',
        body: JSON.stringify(address)
    }),

    deleteAddress: (id) => apiRequest(`/users/address/${id}`, {
        method: 'DELETE'
    }),

    toggleFavorite: (restaurantId) => apiRequest(`/users/favorites/${restaurantId}`, {
        method: 'POST'
    }),

    toggleFavoriteDish: (productId) => apiRequest(`/users/favorite-dishes/${productId}`, {
        method: 'POST'
    }),

    getPaymentMethods: () => apiRequest('/users/payment-methods'),

    addPaymentMethod: (data) => apiRequest('/users/payment-methods', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    deletePaymentMethod: (id) => apiRequest(`/users/payment-methods/${id}`, {
        method: 'DELETE'
    })
}

// ==================== RESTAURANTS ====================
export const restaurantAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiRequest(`/restaurants${query ? `?${query}` : ''}`)
    },

    getById: (id) => apiRequest(`/restaurants/${id}`),

    create: (data) => apiRequest('/restaurants', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    update: (id, data) => apiRequest(`/restaurants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    delete: (id) => apiRequest(`/restaurants/${id}`, {
        method: 'DELETE'
    }),

    getMyRestaurant: () => apiRequest('/restaurants/my-restaurant'),

    verifyOtp: (orderId, otp) => apiRequest(`/restaurants/orders/${orderId}/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ otp })
    })
}

// ==================== PRODUCTS ====================
export const productAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiRequest(`/products${query ? `?${query}` : ''}`)
    },

    getByRestaurant: (restaurantId) => apiRequest(`/products/restaurant/${restaurantId}`),

    getById: (id) => apiRequest(`/products/${id}`),
    create: (data) => apiRequest('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE',
        headers: {
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
    })
}

// ==================== ORDERS ====================
export const orderAPI = {
    getOne: async (id) => await apiRequest(`/orders/${id}`),
    getAll: async () => await apiRequest('/orders'),

    getById: (id) => apiRequest(`/orders/${id}`),

    create: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),

    updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    cancel: (id) => apiRequest(`/orders/${id}/cancel`, {
        method: 'PUT'
    }),

    getAllAdmin: () => apiRequest('/orders/admin/all'),

    getStats: () => apiRequest('/orders/admin/stats')
}

// ==================== CATEGORIES ====================
export const categoryAPI = {
    getAll: () => apiRequest('/categories'),

    create: (data) => apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    update: (id, data) => apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    delete: (id) => apiRequest(`/categories/${id}`, {
        method: 'DELETE'
    })
}

// ==================== CONTENT ====================
export const contentAPI = {
    getHome: () => apiRequest('/content/home'),
    getContent: (type) => apiRequest(`/content?type=${type}`)
}

export default {
    auth: authAPI,
    user: userAPI,
    restaurant: restaurantAPI,
    product: productAPI,
    order: orderAPI,
    category: categoryAPI,
    content: contentAPI
}
