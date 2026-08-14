function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Analyze your resume in three simple steps
          </h2>

          <p className="mt-4 text-gray-500">
            Get personalized insights without spending hours reviewing your
            resume manually.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">

          {/* Step 1 */}
          <div className="rounded-2xl bg-white p-8 border-2 border-indigo-500 bg-gradient-to-br from-white to-indigo-100 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-600">
              01
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Upload your resume
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Upload your PDF resume and let the system extract and analyze
              your information.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-white p-8 border-2 border-indigo-500 bg-gradient-to-br from-white to-indigo-100 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-lg font-bold text-violet-600">
              02
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Add a job description
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Provide the job description you are interested in applying for.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-white p-8 border-2 border-indigo-500 bg-gradient-to-br from-white to-indigo-100 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
              03
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Get personalized feedback
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Receive AI-powered insights about your strengths, weaknesses,
              missing skills, and areas for improvement.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;