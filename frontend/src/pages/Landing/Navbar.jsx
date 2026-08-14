import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white">
            R
          </div>

          <span className="text-xl font-bold text-gray-900">
            ResumeAI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-md font-medium text-gray-600 transition hover:text-indigo-700"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-md font-medium text-gray-600 transition hover:text-indigo-700"
          >
            How it works
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden text-sm font-semibold text-gray-700 transition hover:text-indigo-600 sm:block"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:scale-105 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;