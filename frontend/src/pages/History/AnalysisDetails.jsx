import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AnalysisDetails() {
    const { analysisId } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [review, setReview] = useState(null)
    const [reviewLoading, setReviewLoading] = useState(false)
    const [reviewError, setReviewError] = useState("")

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://127.0.0.1:8000/resume/analyses/${analysisId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to load analysis."
                    );
                }

                setAnalysis(data);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisId]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleReview = async () => {
        setReviewLoading(true)
        setReviewError("")

        try{
            const response = await fetch(
                `http://127.0.0.1:8000/resume/review/${analysisId}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            )

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.detail || "Failed to generate resume review.")
            }

            setReview(data)
        }
        catch (error){
            setReviewError(error.message)
        }
        finally {
            setReviewLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-sm text-gray-500">
                        Loading analysis...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">

                <main className="mx-auto max-w-5xl px-6 py-12">

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/history")}
                        className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        ← Back to History
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Logo */}
                    {/* <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => navigate("/dashboard")}
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white">
                            R
                        </div>

                        <span className="text-xl font-bold text-gray-900">
                            ResumeAI
                        </span>
                    </div> */}

                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => navigate("/history")}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                        ← History
                    </button>
                </div>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-6 py-10">

                {/* Header */}
                <section>
                    <p className="text-sm font-medium text-indigo-600">
                        Resume Analysis
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Analysis Details
                    </h1>
                    <p className="mt-3 text-sm text-gray-500">
                        Analyzed on{" "}
                        <span className="font-medium text-gray-700">
                            {formatDate(analysis.created_at)}
                        </span>
                    </p>
                </section>

                {/* Job Description */}
                <section className="mt-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">
                            Job Description
                        </h2>
                        <div className="mt-4 rounded-xl bg-gray-50 p-5">
                            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                {analysis.job_description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Matching / Missing Skills */}
                <section className="mt-6">

                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* Matching Skills */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Matching Skills
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {analysis.matched_skills?.length > 0 ? (
                                    analysis.matched_skills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No matching skills found.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Missing Skills
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {analysis.missing_skills?.length > 0 ? (
                                    analysis.missing_skills.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No missing skills found.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Score */}
                <section className="mt-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-bold text-gray-900">
                            Analysis Score
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Overall score from the analysis performed at that time.
                        </p>

                        <div className="mt-5">
                            <span className="text-4xl font-bold text-indigo-600">
                                {analysis.score}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Resume Review */}
                <section className="mt-8">
                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                            AI Resume Review
                        </span>

                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Get a detailed AI review
                        </h2>

                        <button
                            onClick={handleReview}
                            disabled={reviewLoading}
                            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {reviewLoading
                                ? "Reviewing Resume..."
                                : "Review This Resume"}
                        </button>

                        {reviewError && (
                            <p className="mt-4 text-sm font-medium text-red-600">
                                {reviewError}
                            </p>
                        )}
                    </div>
                </section>

                {review && (
                    <section className="mt-8">
                        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

                            <div>
                                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
                                    AI Review
                                </span>

                                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                    Resume Review
                                </h2>
                            </div>


                            {/* Summary */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Summary
                                </h3>

                                <p className="mt-3 leading-7 text-gray-600">
                                    {review.summary}
                                </p>
                            </div>


                            {/* Strengths */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Strengths
                                </h3>

                                <ul className="mt-3 space-y-3">
                                    {review.strengths?.map((strength, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-gray-600"
                                        >
                                            <span className="mt-1 text-green-600">
                                                ✓
                                            </span>

                                            <span>
                                                {strength}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            {/* Weaknesses */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Areas to Improve
                                </h3>

                                <ul className="mt-3 space-y-3">
                                    {review.weaknesses?.map((weakness, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-gray-600"
                                        >
                                            <span className="text-red-500">
                                                !
                                            </span>

                                            <span>
                                                {weakness}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            {/* Recommendations */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Recommendations
                                </h3>

                                <ul className="mt-3 space-y-3">
                                    {review.recommendations?.map(
                                        (recommendation, index) => (
                                            <li
                                                key={index}
                                                className="flex gap-3 text-gray-600"
                                            >
                                                <span className="text-indigo-600">
                                                    →
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
                            <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                                <h3 className="font-semibold text-gray-900">
                                    Final Recommendation
                                </h3>

                                <p className="mt-3 leading-7 text-gray-600">
                                    {review.final_recommendation}
                                </p>
                            </div>

                        </div>
                    </section>
                )}

                {/* Bottom */}
                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate("/history")}
                        className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                        ← Back to Analysis History
                    </button>
                </div>
            </main>
        </div>
    );
}
export default AnalysisDetails;