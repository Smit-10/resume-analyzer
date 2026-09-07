import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL

function ResumeManagement() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch all resumes
    const fetchResumes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/resume/`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch resumes.");
            }

            const data = await response.json();

            setResumes(data.resumes);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    // Activate a resume
    const handleActivate = async (resumeId) => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/resume/${resumeId}/activate`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to activate resume.");
            }

            // Refreshing the list so the active/inactive
            // status of all resumes is updated
            await fetchResumes();

        }
        catch (error) {
            setError(error.message);
        }
    };


    // Delete a resume
    const handleDelete = async (resumeId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setDeletingId(resumeId);

            const response = await fetch(
                `${API_URL}/resume/${resumeId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete resume.");
            }

            // Fetching the list again.
            // If the deleted resume was active, the backend may activate another resume.
            await fetchResumes();

        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setDeletingId(null);
        }
    };


    // Fetch resumes when page loads
    useEffect(() => {
        fetchResumes();
    }, []);


    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading resumes...
                </p>
            </div>
        );
    }


    // Error state
    if (error && resumes.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-10">
                <p className="text-sm text-red-500">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            <main className="mx-auto max-w-5xl px-6 py-10">

                {/* Header */}
                <section>
                    <p className="text-sm font-medium text-indigo-600">
                        Resume Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        Your Resumes
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your uploaded resumes and choose which resume
                        you want to use for analysis.
                    </p>
                </section>

                {/* Error Message */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {/* Resume List */}
                <section className="mt-8 space-y-4">

                    {resumes.length === 0 ? (

                        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                            <h2 className="font-semibold text-gray-900">
                                No resumes uploaded
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Upload a resume to start analyzing your
                                applications.
                            </p>
                        </div>
                    ) : (
                        resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                {/* Resume Information */}
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        {resume.original_file_name}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Uploaded on{" "}
                                        {new Date(resume.uploaded_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">

                                    {/* Active / Inactive */}
                                    {resume.is_active ? (
                                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                                            Active
                                        </span>
                                    ) : (
                                        <>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                                Inactive
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleActivate(resume.id)
                                                }
                                                className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                                            >
                                                Activate
                                            </button>
                                        </>
                                    )}

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(resume.id)
                                        }
                                        disabled={deletingId === resume.id}
                                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deletingId === resume.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}

export default ResumeManagement;