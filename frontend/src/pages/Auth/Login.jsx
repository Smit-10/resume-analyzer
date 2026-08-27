import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";

function Login() {
    const navigate = useNavigate()
    const { checkAuth } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setError("")

        if(!email || !password){
            setError("Please enter you email and password.")
            return
        }

        try{
            setLoading(true)

            const formData = new URLSearchParams()

            formData.append("username", email)
            formData.append("password", password)

            const response = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include", //allows the browser to receive and send the authentication cookie
                body: formData,
            })

            const data = await response.json()

            if (!response.ok){
                throw new Error(data.detail || "Invalid email or password.")
            }

            // refreshing the user information in AuthContext
            await checkAuth()

            navigate("/dashboard")
        }
        catch (error){
            setError(error.message)
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex min-h-screen">

        {/* Left Side */}
        <div className="hidden w-2/3 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 p-12 lg:flex lg:flex-col lg:justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-indigo-600">
              R
            </div>

            <span className="text-xl font-bold text-white">
              ResumeAI
            </span>

          </Link>

          {/* Text */}
          <div className="max-w-lg">

            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-200">
              AI-powered resume analysis
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Understand your resume.
              <br />
              Improve your chances.
            </h1>

            <p className="mt-6 text-lg leading-8 text-indigo-100">
              Get personalized insights, identify skill gaps, and improve your
              resume before applying for your next opportunity.
            </p>

          </div>

          {/* Bottom */}
          <p className="text-sm text-indigo-200">
            © 2026 ResumeAI
          </p>

        </div>

        {/* Right Side */}
        <div className="relative flex w-full items-center justify-center overflow-hidden px-6 py-12 lg:w-1/2">

          {/* Background Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-200 via-violet-200 to-blue-200 opacity-50 blur-3xl"></div>


          {/* Login Container */}
          <div className="relative w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white shadow-md shadow-indigo-200">
                R
              </div>

              <span className="text-2xl font-bold text-gray-900">
                ResumeAI
              </span>
            </Link>


            {/* Login Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 sm:p-10">

              {/* Heading */}
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-2 mb-4 text-sm text-gray-500">
                  Sign in to continue analyzing your resumes.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* Error */}
                {error && (
                <p className="mt-4 text-center text-sm font-medium text-red-500">
                    {error}
                </p>
                )}

              {/* Sign In */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading} // when the function is called loading=true, hence signup button is disabled until the data has not come.
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-xs font-medium text-gray-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = "http://127.0.0.1:8000/auth/google"
                }}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <span className="text-lg font-bold">
                  G
                </span>
                Continue with Google
              </button>
            </div>

            {/* Signup */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>

            {/* Back */}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-400 transition hover:text-gray-600"
              >
                ← Back to home
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;