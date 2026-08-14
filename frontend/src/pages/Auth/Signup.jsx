import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        setError("")

        if (password != confirmPassword){
            setError("Password does not match.")
            return
        }

        try{
            setLoading(true)

            const response = await fetch("http://127.0.0.1:8000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Registration Failed.")
            }

            alert("Account created successfully!")
            window.location.href = "/login"
        }

        catch (error){
            setError(error.message)
        }

        finally {
            setLoading(false)
        }
    }

  return (
    <div className="flex min-h-screen">

      {/* Left side */}
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
            Build a better resume.
            <br />
            Get better opportunities.
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Create your account and start getting personalized insights
            from your resume.
          </p>

        </div>

        {/* Bottom */}
        <p className="text-sm text-indigo-200">
          © 2026 ResumeAI
        </p>

      </div>

      {/* Right side */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-6 py-12 lg:w-1/3">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-10 flex items-center justify-center gap-2 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white">
              R
            </div>

            <span className="text-xl font-bold text-gray-900">
              ResumeAI
            </span>
          </Link>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-500">
              Start analyzing your resume with AI.
            </p>

          </div>

          {/* Signup Card */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Google */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <span className="text-lg font-bold">
                G
              </span>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-sm text-gray-400">
                or
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>

            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* Email */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* Password */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* Confirm Password */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* error */}
            {error && (
                <p className="mt-4 text-center text-sm font-medium text-red-500">{error}</p>
            )}

            {/* Create Account */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>

          </p>
          {/* Back */}
          <p className="mt-4 text-center">

            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-indigo-600"
            >
              ← Back to home
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;