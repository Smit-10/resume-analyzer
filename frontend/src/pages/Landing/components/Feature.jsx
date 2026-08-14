const features = [
  {
    title: "Resume Analysis",
    description:
      "Upload your resume and get a detailed analysis based on your target job description.",
    icon: "📄",
  },
  {
    title: "Skill Matching",
    description:
      "Identify the skills you already have and discover the important skills missing from your resume.",
    icon: "🎯",
  },
  {
    title: "AI-Powered Review",
    description:
      "Get personalized feedback and practical recommendations to improve your resume.",
    icon: "✨",
  },
  {
    title: "Analysis History",
    description:
      "Keep track of your previous resume analyses and review them whenever you need.",
    icon: "📊",
  },
];

function Features() {
  return (
    <section id="features" className="px-6 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-indigo-600 mb-3">
            POWERFUL FEATURES
          </p>

          <h2 className="text-4xl font-bold text-gray-900">
            Everything you need to improve your resume
          </h2>

          <p className="mt-4 text-gray-500">
            Get meaningful insights, identify skill gaps, and make your resume
            stronger with AI-powered analysis.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-white to-indigo-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500
                text-2xl mb-5"
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;