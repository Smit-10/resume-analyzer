import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function ProtectedRoute() {
    const {user, loading} = useAuth()

    if (loading){
        return(
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading...
                </p>
            </div>
        )
    }

    if (!user){
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute