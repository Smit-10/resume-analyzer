import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
    };

    const handleLogout = async () => {
        await logout()
        window.location.href = "/login"
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Fixed Navbar */}
            <Navbar
                onMenuClick={toggleSidebar}
                isSidebarOpen={sidebarOpen}
                user={user}
            />

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onLogout={handleLogout}
            />


            {/* Main Content */}
            <main
                className={`min-h-screen pt-20 transition-all duration-300 ${
                    sidebarOpen ? "md:ml-72" : "ml-0"}`} >
                {children}
            </main>

        </div>
    );
}

export default AppLayout;