import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { FileText, Upload, Check } from "lucide-react";
import DashboardAnalysis from "../../components/DashboardAnalysis"
import DashboardResumeReview from "../../components/DashboardResumeReview";

function Dashboard() {
    const { user, loading } = useAuth();

    const fileInputRef = useRef(null);

    // Resumes
    const [resumes, setResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [resumeError, setResumeError] = useState("");

    const [selectedResume, setSelectedResume] = useState(null);

    // Upload
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // Analysis
    const [jobDescription, setJobDescription] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);

    // Review
    const [review, setReview] = useState(null);
    const [reviewing, setReviewing] = useState(false);
    const [reviewError, setReviewError] = useState("");

    /* Fetch Resumes */

    const fetchResumes = async () => {
        try {
            setLoadingResumes(true);
            setResumeError("");

            const response = await fetch(
                "http://127.0.0.1:8000/resume/",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Unable to load resumes. Please make sure the backend is running."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to fetch resumes."
                );
            }

            setResumes(data.resumes || []);

            // If backend already has an active resume,
            // automatically select it.
            const activeResume = (data.resumes || []).find(
                (resume) => resume.is_active
            );

            if (activeResume) {
                setSelectedResume(activeResume);
            }

        } catch (error) {
            setResumeError(error.message);
        } finally {
            setLoadingResumes(false);
        }
    };

    /* Fetch resumes when Dashboard loads */

    useEffect(() => {
        fetchResumes();
    }, []);

    /* Select Existing Resume */

    const handleSelectResume = async (resume) => {
        try {
            setResumeError("");

            const response = await fetch(
                `http://127.0.0.1:8000/resume/${resume.id}/activate`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Unable to select resume. Please try again."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to select resume."
                );
            }

            //Refresh resume list because activating one resume
            //makes the other resumes inactive.
            await fetchResumes();

            // Set the selected resume immediately.
            setSelectedResume({
                ...resume,
                is_active: true,
            });

            /*Clear previous analysis/review because a different resume has been selected. */
            setAnalysisResult(null);
            setReview(null);
            setAnalysisError("");
            setReviewError("");

        } catch (error) {
            setResumeError(error.message);
        }
    };

    /* Open File Picker */

    const handleChooseResume = () => {
        fileInputRef.current?.click();
    };

    /* File Selection */

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadError("");

        //Frontend validation
        if (file.type !== "application/pdf") {
            setUploadError("Only PDF files are allowed.");

            event.target.value = "";

            return;
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024

        if (file.size > MAX_FILE_SIZE){
            setUploadError("Resume file must be 2 MB or smaller.");
            
            event.target.value = "";

            return;
        }

        await uploadResume(file);

        // Reset input so the same file can be selected again.
        event.target.value = "";
    };

    // Upload Resume
    const uploadResume = async (file) => {
        try {
            setUploading(true);
            setUploadError("");

            const formData = new FormData();

            formData.append("file", file);

            const response = await fetch(
                "http://127.0.0.1:8000/resume/upload",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Unable to upload resume. Please make sure the backend is running."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to upload resume."
                );
            }

            // The uploaded resume becomes the selected resume.
            setSelectedResume(data);

            // Refresh resume list.
            await fetchResumes();

            // Make sure the uploaded resume is selected.
            setSelectedResume(data);

            // Clear old analysis/review.
            setAnalysisResult(null);
            setReview(null);
            setAnalysisError("");
            setReviewError("");

        } catch (error) {
            setUploadError(error.message);
        } finally {
            setUploading(false);
        }
    };

    // Analyze Resume

    const handleAnalyze = async () => {
        setAnalysisError("");
        setAnalysisResult(null);

        if (!selectedResume) {
            setAnalysisError(
                "Please select or upload a resume first."
            );
            return;
        }

        if (!jobDescription.trim()) {
            setAnalysisError(
                "Please enter a job description."
            );
            return;
        }

        try {
            setAnalyzing(true);

            const formData = new FormData();

            formData.append(
                "job_description",
                jobDescription
            );

            const response = await fetch(
                "http://127.0.0.1:8000/resume/analyze",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Unable to analyze resume. Please make sure the backend is running."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to analyze resume."
                );
            }

            setAnalysisResult(data);

        } catch (error) {
            setAnalysisError(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    // AI Resume Review

    const handleResumeReview = async () => {
        setReviewError("");
        setReview(null);

        if (!selectedResume) {
            setReviewError("Please select or upload a resume first.");
            return;
        }

        if (!jobDescription.trim()) {
            setReviewError("Please enter a job description first.");
            return;
        }

        try {
            setReviewing(true);

            const formData = new FormData();

            formData.append(
                "job_description",
                jobDescription
            );

            const response = await fetch(
                "http://127.0.0.1:8000/resume/review",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Unable to generate review. Please make sure the backend is running."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to generate resume review."
                );
            }

            setReview(data);

        } catch (error) {
            setReviewError(error.message);
        } finally {
            setReviewing(false);
        }
    };

    // Loading

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

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
                        Analyze your resume, compare it with job
                        descriptions, and discover how you can
                        improve your chances.
                    </p>

                </section>

                {/* Stats */}
                <section className="mt-10 grid gap-5 sm:grid-cols-2">

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Resumes Available
                        </p>

                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {resumes.length}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Upload and manage your resumes
                        </p>

                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Selected Resume
                        </p>

                        <p className="mt-3 truncate text-lg font-bold text-violet-600">
                            {selectedResume
                                ? selectedResume.original_file_name
                                : "None selected"}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Used for analysis
                        </p>

                    </div>

                </section>

                {/* Resume Selection */}
                <section className="mt-10">

                    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                        <div className="max-w-2xl">

                            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                Resume Selection
                            </span>

                            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                                Choose your resume
                            </h2>

                            <p className="mt-2 leading-7 text-gray-500">
                                Select an existing resume or upload a new
                                one. The selected resume will be used for
                                analysis.
                            </p>

                        </div>

                        {/* Error */}
                        {resumeError && (
                            <p className="mt-5 text-sm font-medium text-red-600">
                                {resumeError}
                            </p>
                        )}

                        {/* Loading Resumes */}
                        {loadingResumes ? (
                            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">

                                <p className="text-sm text-gray-500">
                                    Loading your resumes...
                                </p>

                            </div>
                        ) : resumes.length === 0 ? (

                            /* No Resumes */
                            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                    <FileText
                                        size={24}
                                        className="text-gray-500"
                                    />
                                </div>

                                <p className="mt-4 text-sm text-gray-500">
                                    You haven't uploaded any resumes yet.
                                </p>

                            </div>

                        ) : (

                            /* Resume List */
                            <div className="mt-8 space-y-3">

                                {resumes.map((resume) => {

                                    const isSelected =
                                        selectedResume?.id === resume.id;

                                    return (
                                        <div
                                            key={resume.id}
                                            className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition ${
                                                isSelected
                                                    ? "border-indigo-200 bg-indigo-50/50"
                                                    : "border-gray-200 bg-white"
                                            }`}
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                        isSelected
                                                            ? "bg-indigo-100 text-indigo-600"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    <FileText
                                                        size={22}
                                                    />
                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {resume.original_file_name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Uploaded on{" "}
                                                        {new Date(
                                                            resume.uploaded_at
                                                        ).toLocaleDateString()}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex shrink-0 items-center gap-3">

                                                {isSelected && (
                                                    <span className="hidden rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:inline-flex">
                                                        Selected
                                                    </span>
                                                )}


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectResume(
                                                            resume
                                                        )
                                                    }
                                                    disabled={isSelected}
                                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                        isSelected
                                                            ? "cursor-default bg-gray-100 text-gray-400"
                                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    }`}
                                                >
                                                    {isSelected
                                                        ? "Selected"
                                                        : "Select"}
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                        {/* Upload New Resume */}
                        <div className="mt-6 border-t border-gray-200 pt-6">

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={handleChooseResume}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <Upload size={18} />

                                {uploading
                                    ? "Uploading..."
                                    : "Upload New Resume"}

                            </button>

                            {uploadError && (
                                <p className="mt-3 text-sm font-medium text-red-600">
                                    {uploadError}
                                </p>
                            )}

                        </div>

                        {/* Selected Resume Confirmation */}
                        {selectedResume && (
                            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                        <Check size={20} />
                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedResume.original_file_name}
                                        </p>

                                        <p className="mt-1 text-xs text-green-600">
                                            This resume will be used for analysis.
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

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
                                Provide a job description to compare it
                                with your selected resume.
                            </p>

                        </div>

                        {/* Job Description */}
                        <div className="mt-8">

                            <label className="text-sm font-semibold text-gray-900">
                                Job Description
                            </label>

                            <p className="mt-1 text-sm text-gray-500">
                                Paste the job description for the role
                                you are applying for.
                            </p>

                            <textarea
                                value={jobDescription}
                                onChange={(event) =>
                                    setJobDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Paste the job description here..."
                                rows={8}
                                className="mt-4 w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                            {analysisError && (
                                <p className="mt-3 text-sm font-medium text-red-600">
                                    {analysisError}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={analyzing}
                                className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {analyzing
                                    ? "Analyzing..."
                                    : "Analyze Resume"}
                            </button>

                        </div>

                    </div>

                </section>

                <DashboardAnalysis analysisResult={analysisResult} />

                {/* AI resume review */}
                <DashboardResumeReview
                    review={review}
                    reviewing={reviewing}
                    reviewError={reviewError}
                    handleResumeReview={handleResumeReview}
                />

            </main>

        </div>
    );
}

export default Dashboard;