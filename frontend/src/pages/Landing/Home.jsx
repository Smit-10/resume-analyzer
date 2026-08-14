import { Link } from "react-router-dom";
import Features from "./components/Feature";
import HowItWorks from "./components/HowItWorks";
import Footer from "./Footer";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">

      {/* Hero Section */}
      <section className="relative">

        {/* Background gradient glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200 via-violet-200 to-blue-200 opacity-50 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pt-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* Small badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm text-indigo-700 shadow-sm">
              AI-powered resume analysis
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Understand your resume.
              <br />

              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Improve your chances.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Upload your resume, add a job description, and get personalized
              AI-powered feedback on how well your resume matches the role.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <Link
                to="/signup"
                className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-md font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-105 hover:shadow-xl"
              >
                Analyze Your Resume
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-md font-semibold text-gray-700 transition hover:scale-105 hover:shadow-2xl"
              >
                Sign In
              </Link>

            </div>

          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">

            <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-indigo-300 via-violet-300 to-blue-300 opacity-50 blur-2xl"></div>

            <div className="relative rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">

              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">

                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>

                <div className="ml-4 h-7 flex-1 rounded-lg bg-gray-50"></div>

              </div>

              {/* Dashboard preview */}
              <div className="grid gap-6 p-6 md:grid-cols-3">

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Resume Match</p>

                  <p className="mt-3 text-4xl font-bold text-indigo-600">
                    82%
                  </p>

                  <div className="mt-4 h-2 rounded-full bg-gray-200">
                    <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Matched Skills</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">
                      React
                    </span>

                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                      Python
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                      FastAPI
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">AI Feedback</p>

                  <p className="mt-4 text-sm leading-6 text-gray-700">
                    Your technical foundation is strong. Consider highlighting
                    your backend and API development experience.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How it works */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="px-6 py-20">

        {/* Glow wrapper */}
        <div className="relative mx-auto max-w-6xl">

          {/* Visible blurred glow */}
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 opacity-50 blur-3xl"></div>

          {/* CTA Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 shadow-2xl">

            {/* Decorative glow 1 */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>

            {/* Decorative glow 2 */}
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl"></div>

            {/* Content */}
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">

              {/* Badge */}
              <div className="mx-auto inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                ✨ Make your next application stronger
              </div>

              {/* Heading */}
              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Turn your resume into a stronger application.
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                Get personalized AI feedback, understand your skill gaps, and improve
                your resume before applying for your next opportunity.
              </p>

              {/* Button */}
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-lg font-semibold text-indigo-600 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Analyze Your Resume
                <span className="text-lg">→</span>
              </Link>

              {/* Small text */}
              <p className="mt-5 text-sm text-indigo-200">
                Simple. Personalized. AI-powered.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;