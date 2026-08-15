function DashboardAnalysis({ analysisResult }) {
    if (!analysisResult) {
        return null;
    }

    return (
        <section className="mt-10">

            {/* ANALYSIS RESULT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                            Analysis Complete
                        </span>

                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Resume Analysis
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Here's how your resume compares with the job
                            description.
                        </p>
                    </div>

                </div>


                {/* SCORES */}

                <div className="mt-8 grid gap-5 sm:grid-cols-3">

                    {/* Overall Score */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                        <p className="text-sm font-medium text-gray-500">
                            Overall Score
                        </p>

                        <p className="mt-3 text-4xl font-bold text-indigo-600">
                            {analysisResult.overall_score}%
                        </p>
                    </div>


                    {/* Similarity Score */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                        <p className="text-sm font-medium text-gray-500">
                            Similarity Score
                        </p>

                        <p className="mt-3 text-4xl font-bold text-violet-600">
                            {analysisResult.similarity_score}%
                        </p>
                    </div>


                    {/* Skill Match */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                        <p className="text-sm font-medium text-gray-500">
                            Skill Match
                        </p>

                        <p className="mt-3 text-4xl font-bold text-blue-600">
                            {analysisResult.skill_match_score}%
                        </p>
                    </div>

                </div>


                {/* SKILL ANALYSIS */}

                <div className="mt-8 grid gap-6 lg:grid-cols-2">

                    {/* Your Skills */}
                    <div className="rounded-2xl border border-gray-200 p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Your Skills
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">

                            {analysisResult.resume_skills?.length > 0 ? (
                                analysisResult.resume_skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No skills identified.
                                </p>
                            )}

                        </div>
                    </div>


                    {/* Job Description Skills */}
                    <div className="rounded-2xl border border-gray-200 p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Job Description Skills
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">

                            {analysisResult.job_description_skills?.length > 0 ? (
                                analysisResult.job_description_skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No job skills identified.
                                </p>
                            )}

                        </div>
                    </div>


                    {/* Matching Skills */}
                    <div className="rounded-2xl border border-green-200 bg-green-50/30 p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Matching Skills
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">

                            {analysisResult.matching_skills?.length > 0 ? (
                                analysisResult.matching_skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No matching skills found.
                                </p>
                            )}

                        </div>
                    </div>


                    {/* Missing Skills */}
                    <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Missing Skills
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">

                            {analysisResult.missing_skills?.length > 0 ? (
                                analysisResult.missing_skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No missing skills found.
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default DashboardAnalysis;