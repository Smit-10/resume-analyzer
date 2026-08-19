function DashboardResumeReview({ review, reviewing, reviewError, handleResumeReview }) {
    return (
        <section className="mt-10">

            {/* AI RESUME REVIEW */}

            <div className="border-t border-gray-200 pt-8">

                <div className="max-w-2xl">

                    <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
                        AI Resume Review
                    </span>

                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                        Get a detailed AI review
                    </h3>

                </div>

                {/* ERROR */}

                {reviewError && (
                    <p className="mt-4 text-sm font-medium text-red-600">
                        {reviewError}
                    </p>
                )}

                {/* REVIEW BUTTON */}

                <button
                    type="button"
                    onClick={handleResumeReview}
                    disabled={reviewing}
                    className="mt-6 rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {reviewing
                        ? "Generating Review..."
                        : "Review My Resume"}
                </button>


                {/* REVIEW RESULT */}

                {review && (
                    <div className="mt-8 space-y-6">

                        {/* Summary */}

                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                AI Resume Review
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                {review.summary}
                            </p>

                        </div>

                        {/* Strengths */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                Strengths
                            </h3>

                            <ul className="mt-4 space-y-3">

                                {review.strengths?.map(
                                    (strength, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-sm leading-6 text-gray-600"
                                        >
                                            <span className="text-green-600">
                                                ✓
                                            </span>

                                            <span>
                                                {strength}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        {/* Weaknesses */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                Areas to Improve
                            </h3>

                            <ul className="mt-4 space-y-3">

                                {review.weaknesses?.map(
                                    (weakness, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-sm leading-6 text-gray-600"
                                        >
                                            <span className="text-amber-500">
                                                !
                                            </span>

                                            <span>
                                                {weakness}
                                            </span>
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                        {/* Recommendations */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                Recommendations
                            </h3>

                            <ul className="mt-4 space-y-3">

                                {review.recommendations?.map(
                                    (recommendation, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-sm leading-6 text-gray-600"
                                        >
                                            <span className="text-indigo-600">
                                                {index + 1}.
                                            </span>

                                            <span>
                                                {recommendation}
                                            </span>
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                        {/* Final Recommendation */}

                        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                Final Advice
                            </h3>

                            <p className="mt-3 leading-7 text-gray-600">
                                {review.final_recommendation}
                            </p>

                        </div>

                    </div>
                )}

            </div>

        </section>
    );
}

export default DashboardResumeReview;