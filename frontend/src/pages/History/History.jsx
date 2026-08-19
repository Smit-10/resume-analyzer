import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://127.0.0.1:8000/resume/analyses",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load analysis history.");
                }

                const data = await response.json();

                setAnalyses(data.analyses || []);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleViewAnalysis = (analysisId) => {
        navigate(`/history/${analysisId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex min-h-[50vh] items-center justify-center">
                        <p className="text-sm text-gray-500">
                            Loading analysis history...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="mx-auto max-w-5xl px-6 py-10">

                {/* Heading */}
                <section>
                    <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        Your activity
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Analysis History
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-500">
                        View your previous resume analyses and open their
                        detailed results.
                    </p>
                </section>


                {/* Error */}
                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    </div>
                )}


                {/* Empty State */}
                {!error && analyses.length === 0 && (
                    <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                            📊
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            No analyses yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Once you analyze your resume against a job
                            description, your analysis history will appear
                            here.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            Analyze Resume
                        </button>

                    </section>
                )}


                {/* Analysis History */}
                {!error && analyses.length > 0 && (
                    <section className="mt-10 space-y-5">

                        {analyses.map((analysis) => (
                            <div
                                key={analysis.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                    {/* Analysis Information */}
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600">
                                            Analysis
                                        </p>
                                        <h2 className="mt-2 text-lg font-semibold text-gray-900">
                                            {analysis.original_file_name}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Analyzed on{" "}
                                            <span className="font-medium text-gray-700">
                                                {formatDate(analysis.created_at)}
                                            </span>
                                        </p>
                                    </div>

                                    {/* View Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewAnalysis(analysis.id)
                                        }
                                        className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        View Analysis →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
export default History;