function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 via-violet-600 to-blue-600 text-sm font-bold text-white">
              R
            </div>

            <span className="font-bold text-gray-900">
              ResumeAI
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Make your resume stronger with AI.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a
            href="#features"
            className="transition hover:text-indigo-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-indigo-600"
          >
            How it works
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © 2026 ResumeAI
        </p>

      </div>
    </footer>
  );
}

export default Footer;