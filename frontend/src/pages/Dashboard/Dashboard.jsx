import { useAuth } from "../../context/useAuth";
import { useRef, useState } from "react";

function Dashboard() {
    const { user, loading } = useAuth();

    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadedResume, setUploadedResume] = useState(null);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // Open the file picker
    const handleChooseResume = () => {
        fileInputRef.current?.click();
    };

    // When user selects a file
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadError("");
        setSelectedFile(file);

        // Basic frontend validation
        if (file.type !== "application/pdf") {
            setUploadError("Only PDF files are allowed.");
            setSelectedFile(null);

            // Reset input so the same file can be selected again
            event.target.value = "";

            return;
        }

        await uploadResume(file);
    };

    // Upload resume to backend
    const uploadResume = async (file) => {
        setUploading(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/resume/upload",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to upload resume."
                );
            }

            setUploadedResume(data);
            setSelectedFile(null);

        } catch (error) {
            setUploadError(error.message);
            setUploadedResume(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-lg font-bold text-white">
                            R
                        </div>

                        <span className="text-xl font-bold text-gray-900">
                            ResumeAI
                        </span>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-gray-900">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-sm font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                    </div>

                </div>
            </nav>


            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Welcome */}
                <section>
                    <p className="text-sm font-medium text-indigo-600">
                        AI-powered resume analysis
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Welcome back, {user?.name}
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-500">
                        Analyze your resume, compare it with job descriptions,
                        and discover how you can improve your chances.
                    </p>
                </section>


                {/* Stats */}
                <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Stat 1 */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Resumes Analyzed
                        </p>

                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            0
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Start your first analysis
                        </p>
                    </div>

                    {/* Stat 2 */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Skills Identified
                        </p>

                        <p className="mt-3 text-3xl font-bold text-violet-600">
                            0
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Based on your analyses
                        </p>
                    </div>

                    {/* Stat 3 */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Analyses This Month
                        </p>

                        <p className="mt-3 text-3xl font-bold text-blue-600">
                            0
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Keep improving
                        </p>
                    </div>

                </section>


                {/* Analyze Resume */}
                <section className="mt-10">

                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                        <div className="max-w-2xl">

                            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                Resume Analysis
                            </span>

                            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                Analyze your resume
                            </h2>

                            <p className="mt-2 leading-7 text-gray-500">
                                Upload your resume and provide a job description
                                to get an AI-powered analysis of how well your
                                resume matches the role.
                            </p>

                        </div>


                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />


                        {/* Upload Area */}
                        <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                                📄
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {uploading
                                    ? "Uploading resume..."
                                    : "Upload your resume"}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                PDF files are supported
                            </p>


                            {/* Choose Resume Button */}
                            <button
                                type="button"
                                onClick={handleChooseResume}
                                disabled={uploading}
                                className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Choose Resume"}
                            </button>


                            {/* Selected File */}
                            {selectedFile && !uploadError && (
                                <p className="mt-4 text-sm text-gray-600">
                                    Selected:{" "}
                                    <span className="font-medium text-gray-900">
                                        {selectedFile.name}
                                    </span>
                                </p>
                            )}


                            {/* Upload Error */}
                            {uploadError && (
                                <p className="mt-4 text-sm font-medium text-red-600">
                                    {uploadError}
                                </p>
                            )}

                        </div>


                        {/* Uploaded Resume */}
                        {uploadedResume && (
                            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                            📄
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {uploadedResume.original_file_name}
                                            </p>

                                            <p className="mt-1 text-xs text-green-600">
                                                Resume uploaded successfully
                                            </p>
                                        </div>

                                    </div>

                                    {uploadedResume.is_active && (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            Active
                                        </span>
                                    )}

                                </div>

                            </div>
                        )}

                    </div>
                </section>


                {/* Recent Analyses */}
                <section className="mt-10">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Analyses
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your latest resume analyses will appear here.
                            </p>
                        </div>
                    </div>


                    {/* Empty State */}
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                            📊
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-900">
                            No analyses yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Upload your first resume to see your analysis
                            history here.
                        </p>

                    </div>
                </section>

            </main>

        </div>
    );
}

export default Dashboard;