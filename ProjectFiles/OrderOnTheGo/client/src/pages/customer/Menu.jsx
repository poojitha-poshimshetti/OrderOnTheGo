import { Navigate, useParams } from 'react-router-dom'

export default function Menu() {
    const { id } = useParams()
    return <Navigate to={`/restaurant/${id}`} replace />
}
