import { Menu } from "lucide-react";

function Navbar({ onMenuClick, isSidebarOpen, user }) {
    return (
        <nav className="fixed left-0 top-0 z-50 h-16 w-full border-b border-gray-200 bg-white">
            
            <div className="flex h-full items-center justify-between px-6">

                {/* Left Side */}
                <div className="flex items-center gap-4">

                    {/* Hamburger */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? (
                            <Menu
                                size={25}
                                strokeWidth={1.8}
                            />
                        ) : (
                            <Menu
                                size={25}
                                strokeWidth={1.8}
                            />
                        )}
                    </button>


                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        {/* Logo Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white">
                            R
                        </div>

                        {/* Application Name */}
                        <span className="text-xl font-bold text-gray-900">
                            ResumeAI
                        </span>

                    </div>

                </div>


                {/* Right Side - User */}
                <div className="flex items-center gap-3">

                    {/* Name + Email */}
                    <div className="hidden text-right sm:block">

                        <p className="text-sm font-semibold text-gray-900">
                            {user?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user?.email}
                        </p>

                    </div>


                    {/* User Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-sm font-bold text-white">
                        {user?.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;