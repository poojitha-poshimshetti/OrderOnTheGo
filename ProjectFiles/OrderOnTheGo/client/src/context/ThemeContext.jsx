import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) return saved === 'dark'
        // Auto-enable dark mode during late night (10 PM - 6 AM)
        const hour = new Date().getHours()
        return hour >= 22 || hour < 6
    })

    const [isLateNight, setIsLateNight] = useState(() => {
        const hour = new Date().getHours()
        return hour >= 22 || hour < 6
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark])

    useEffect(() => {
        // Check late night mode every minute
        const interval = setInterval(() => {
            const hour = new Date().getHours()
            setIsLateNight(hour >= 22 || hour < 6)
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <ThemeContext.Provider value={{ isDark, isLateNight, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
    return context
}
