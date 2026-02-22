import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart')
            if (saved) {
                const parsed = JSON.parse(saved)
                let items = []

                // Handle old format migration (object with items array)
                if (parsed && Array.isArray(parsed.items)) {
                    items = parsed.items
                }
                // Handle new format (flat array)
                else if (Array.isArray(parsed)) {
                    items = parsed
                }

                // Filter out invalid items (mock data with numeric IDs or invalid structure)
                return items.filter(item => {
                    const isValidId = typeof item.id === 'string' && item.id.length === 24
                    const isValidRestId = typeof item.restaurantId === 'string' && item.restaurantId.length === 24
                    return isValidId && isValidRestId
                })
            }
        } catch (e) {
            console.error('Error parsing cart:', e)
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(i => i.id === item.id && i.restaurantId === item.restaurantId)
            if (existingIndex >= 0) {
                const updatedCart = [...prev]
                updatedCart[existingIndex].quantity = (updatedCart[existingIndex].quantity || 1) + 1
                return updatedCart
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }]
        })
    }

    const removeFromCart = (itemId, restaurantId) => {
        setCart(prev => prev.filter(i => !(i.id === itemId && i.restaurantId === restaurantId)))
    }

    const updateQuantity = (itemId, restaurantId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId, restaurantId)
            return
        }
        setCart(prev => prev.map(i =>
            (i.id === itemId && i.restaurantId === restaurantId) ? { ...i, quantity } : i
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        if (!Array.isArray(cart)) return 0
        return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    }

    const getItemCount = () => {
        if (!Array.isArray(cart)) return 0
        return cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    }

    return (
        <CartContext.Provider value={{
            cart: Array.isArray(cart) ? cart : [],
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getItemCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
