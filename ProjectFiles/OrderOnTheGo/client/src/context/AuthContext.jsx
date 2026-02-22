import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, userAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(false)

    const [isAdmin, setIsAdmin] = useState(() => {
        const saved = localStorage.getItem('user')
        if (saved) {
            const user = JSON.parse(saved)
            return user.role === 'admin'
        }
        return false
    })

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            setIsAdmin(user.role === 'admin')
        } else {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            setIsAdmin(false)
        }
    }, [user])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const data = await authAPI.login(email, password)
            localStorage.setItem('token', data.token)
            setUser(data)
            return { success: true, user: data }
        } catch (error) {
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const register = async (name, email, phone, password) => {
        setLoading(true)
        try {
            const data = await authAPI.register({ name, email, phone, password })
            localStorage.setItem('token', data.token)
            setUser(data)
            return { success: true, user: data }
        } catch (error) {
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('cart')
    }

    const updateProfile = async (updates) => {
        try {
            const data = await userAPI.updateProfile(updates)
            setUser(prev => ({ ...prev, ...data }))
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const addAddress = async (address) => {
        try {
            const addresses = await userAPI.addAddress(address)
            setUser(prev => ({ ...prev, addresses }))
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteAddress = async (id) => {
        try {
            const addresses = await userAPI.deleteAddress(id)
            setUser(prev => ({ ...prev, addresses }))
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const toggleFavoriteRestaurant = async (restaurantId) => {
        try {
            const favorites = await userAPI.toggleFavorite(restaurantId)
            setUser(prev => ({ ...prev, favorites }))
            return { success: true, favorites }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const toggleFavoriteDish = async (productId) => {
        try {
            const favoriteDishes = await userAPI.toggleFavoriteDish(productId)
            setUser(prev => ({ ...prev, favoriteDishes }))
            return { success: true, favoriteDishes }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            isAuthenticated: !!user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            addAddress,
            deleteAddress,
            toggleFavoriteRestaurant,
            toggleFavoriteDish
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
