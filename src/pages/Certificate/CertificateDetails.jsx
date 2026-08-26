import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

// Replace this with your actual certificate image/API data
const certificateData = {
    id: "EDU-ML-2026-00042",
    student: "Alexei Romanov",
    course: "Advanced Machine Learning with Python",
    instructor: "Dr. Sarah Jenkins",
    duration: "42 hours",
    date: "Aug 24, 2026",
    status: "Verified",

    certificateImage:
        "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1400&q=90",

    skills: [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "Scikit-Learn",
        "Data Analysis",
    ],
};

export default function CertificateDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const certificate = certificateData;

    const handleDownload = () => {
        /*
         * Replace this with your real certificate download API.
         *
         * Example:
         *
         * window.open(
         *   `/api/certificates/${certificate.id}/download`,
         *   "_blank"
         * );
         */

        const link = document.createElement("a");

        link.href = certificate.certificateImage;
        link.download = `${certificate.course
            .replace(/\s+/g, "-")
            .toLowerCase()}-certificate.jpg`;

        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        const shareData = {
            title: `${certificate.course} Certificate`,
            text: `I completed ${certificate.course} on EduFlow.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert("Certificate link copied!");
            }
        } catch (error) {
            console.log("Share cancelled");
        }
    };

    const handleVerify = () => {
        navigate(`/certificates/verify/${certificate.id}`);
    };

    return (
        <div className="min-h-screen w-full bg-[#0b1428] text-white">
            <main
                className="
                    w-full
                    max-w-[1280px]
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                    py-6
                    sm:py-8
                    lg:py-10
                "
            >
                {/* =====================================================
                    BACK
                ====================================================== */}

                <button
                    type="button"
                    onClick={() => navigate("/certificates")}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        mb-5
                        sm:mb-6
                        text-sm
                        text-indigo-300
                        hover:text-white
                        transition-colors
                        cursor-pointer
                    "
                >
                    <ArrowBackIcon sx={{ fontSize: 17 }} />

                    <span>Back to Certificates</span>
                </button>

                {/* =====================================================
                    MAIN GRID
                ====================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[minmax(0,2fr)_minmax(300px,0.9fr)]
                        gap-6
                        lg:gap-7
                        items-start
                    "
                >
                    {/* =================================================
                        LEFT SIDE
                    ================================================== */}

                    <section className="min-w-0">
                        {/* Certificate Preview */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-gray-700/80
                                bg-[#1b263b]
                                p-3
                                sm:p-4
                                lg:p-5
                                shadow-xl
                            "
                        >
                            <div
                                className="
                                    w-full
                                    overflow-hidden
                                    rounded-md
                                    bg-white
                                    border
                                    border-gray-600
                                "
                            >
                                <img
                                    src={
                                        certificate.certificateImage
                                    }
                                    alt={`${certificate.course} certificate`}
                                    className="
                                        block
                                        w-full
                                        h-auto
                                        object-contain
                                    "
                                />
                            </div>
                        </div>

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-[minmax(0,1fr)_auto_auto]
                                gap-3
                                mt-5
                            "
                        >
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="
                                    min-h-[44px]
                                    px-5
                                    rounded-lg
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    active:scale-[0.98]
                                    text-white
                                    text-sm
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition-all
                                    cursor-pointer
                                "
                            >
                                <DownloadIcon
                                    sx={{ fontSize: 18 }}
                                />

                                Download Certificate
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="
                                    min-h-[44px]
                                    px-5
                                    rounded-lg
                                    border
                                    border-indigo-500
                                    text-indigo-300
                                    hover:bg-indigo-500/10
                                    active:scale-[0.98]
                                    text-sm
                                    font-medium
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition-all
                                    cursor-pointer
                                "
                            >
                                <ShareIcon
                                    sx={{ fontSize: 17 }}
                                />

                                Share
                            </button>

                            <button
                                type="button"
                                onClick={handleVerify}
                                className="
                                    min-h-[44px]
                                    px-5
                                    rounded-lg
                                    text-gray-300
                                    hover:text-white
                                    hover:bg-white/5
                                    text-sm
                                    font-medium
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition-all
                                    cursor-pointer
                                "
                            >
                                <VerifiedIcon
                                    sx={{ fontSize: 17 }}
                                />

                                Verify
                            </button>
                        </div>
                    </section>

                    {/* =================================================
                        RIGHT SIDE
                    ================================================== */}

                    <aside className="space-y-5">
                        {/* =================================================
                            CERTIFICATE DETAILS
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-gray-700/80
                                bg-[#1b263b]
                                overflow-hidden
                            "
                        >
                            <div className="px-5 py-5 border-b border-gray-700/80">
                                <h2 className="text-base sm:text-lg font-bold">
                                    Certificate Details
                                </h2>
                            </div>

                            <div className="p-5">
                                <div className="space-y-0">
                                    <DetailItem
                                        label="Student"
                                        value={
                                            certificate.student
                                        }
                                    />

                                    <DetailItem
                                        label="Course"
                                        value={
                                            certificate.course
                                        }
                                    />

                                    <DetailItem
                                        label="Instructor"
                                        value={
                                            certificate.instructor
                                        }
                                    />

                                    {/* Duration + Date */}

                                    <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-700/70">
                                        <div>
                                            <p className="text-[11px] font-semibold text-gray-400 mb-1">
                                                Duration
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <AccessTimeOutlinedIcon
                                                    sx={{
                                                        fontSize: 15,
                                                        color: "#a5b4fc",
                                                    }}
                                                />

                                                <p className="text-sm font-medium text-white">
                                                    {
                                                        certificate.duration
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-semibold text-gray-400 mb-1">
                                                Date
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <CalendarMonthOutlinedIcon
                                                    sx={{
                                                        fontSize: 15,
                                                        color: "#a5b4fc",
                                                    }}
                                                />

                                                <p className="text-sm font-medium text-white">
                                                    {
                                                        certificate.date
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status + ID */}

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div>
                                            <p className="text-[11px] font-semibold text-gray-400 mb-2">
                                                Status
                                            </p>

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    bg-emerald-500/15
                                                    border
                                                    border-emerald-500/20
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-semibold
                                                    text-emerald-400
                                                "
                                            >
                                                <VerifiedIcon
                                                    sx={{
                                                        fontSize: 13,
                                                    }}
                                                />

                                                {certificate.status}
                                            </span>
                                        </div>

                                        <div className="min-w-0 text-right">
                                            <p className="text-[11px] font-semibold text-gray-400 mb-1">
                                                Credential ID
                                            </p>

                                            <p className="text-[10px] sm:text-[11px] font-mono text-indigo-300 break-all">
                                                {certificate.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            SKILLS
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-gray-700/80
                                bg-[#1b263b]
                                overflow-hidden
                            "
                        >
                            <div className="px-5 py-5 border-b border-gray-700/80">
                                <h2 className="text-base sm:text-lg font-bold">
                                    Skills Acquired
                                </h2>
                            </div>

                            <div className="p-5">
                                <div className="flex flex-wrap gap-2">
                                    {certificate.skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="
                                                    rounded-md
                                                    border
                                                    border-gray-600
                                                    bg-[#111b30]
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    text-gray-300
                                                "
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            VERIFICATION
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-emerald-500/10
                                bg-[#0f1c2c]
                                p-5
                            "
                        >
                            <div className="flex items-start gap-3">
                                <ShieldOutlinedIcon
                                    sx={{
                                        fontSize: 25,
                                        color: "#10b981",
                                    }}
                                />

                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        Certificate Verification
                                    </h3>

                                    <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
                                        ✓ Certificate verified as
                                        authentic. Issued directly
                                        by EduFlow to the recipient.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({ label, value }) {
    return (
        <div className="py-4 border-b border-gray-700/70">
            <p className="text-[11px] font-semibold text-gray-400 mb-1">
                {label}
            </p>

            <p className="text-sm font-medium text-white leading-relaxed">
                {value}
            </p>
        </div>
    );
}