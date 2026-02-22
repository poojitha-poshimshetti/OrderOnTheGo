import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <App />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontFamily: 'Poppins, sans-serif',
                                },
                                success: {
                                    style: {
                                        background: '#10b981',
                                        color: '#fff',
                                    },
                                    iconTheme: {
                                        primary: '#fff',
                                        secondary: '#10b981',
                                    },
                                },
                                error: {
                                    style: {
                                        background: '#ef4444',
                                        color: '#fff',
                                    },
                                },
                            }}
                        />
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
