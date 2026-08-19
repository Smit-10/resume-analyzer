import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, History, LogOut } from "lucide-react";

function Sidebar({ isOpen, onLogout }) {

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Resume Management",
            path: "/management",
            icon: FileText,
        },
        {
            name: "History",
            path: "/history",
            icon: History,
        },
    ];

    return (
        // h-screen means 100vh. 100vh-4rem is for displaying logout button below. h-16 = 4rem
        <aside
            className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Menu
                </p>

                <div className="space-y-2">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`
                                }
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={1.8}
                                />
                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Logout */}
            <div className="shrink-0 border-t border-gray-200 p-4">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut
                        size={20}
                        strokeWidth={1.8}
                    />
                    <span>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;