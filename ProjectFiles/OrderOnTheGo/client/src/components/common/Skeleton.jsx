import { motion } from 'framer-motion'

export function Skeleton({ className = '', variant = 'rect' }) {
    const baseClass = 'skeleton rounded-lg'

    const variants = {
        rect: 'w-full h-4',
        circle: 'w-12 h-12 rounded-full',
        card: 'w-full h-48 rounded-2xl',
        text: 'w-3/4 h-4',
        avatar: 'w-10 h-10 rounded-full',
        button: 'w-24 h-10 rounded-xl'
    }

    return (
        <div className={`${baseClass} ${variants[variant]} ${className}`} />
    )
}

export function RestaurantCardSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card p-4">
            <Skeleton variant="card" className="mb-4" />
            <Skeleton className="w-3/4 h-5 mb-2" />
            <Skeleton className="w-1/2 h-4 mb-3" />
            <div className="flex gap-2">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-20 h-6 rounded-full" />
            </div>
        </div>
    )
}

export function FoodCardSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card p-4 flex gap-4">
            <div className="flex-1">
                <Skeleton className="w-6 h-6 rounded mb-2" />
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-2/3 h-4 mb-3" />
                <Skeleton className="w-20 h-6" />
            </div>
            <Skeleton className="w-28 h-28 rounded-xl" />
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center gap-2">
            <Skeleton variant="circle" className="w-16 h-16" />
            <Skeleton className="w-14 h-4" />
        </div>
    )
}
