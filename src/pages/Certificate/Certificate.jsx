import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const certificatesData = [
    {
        id: "ML-48291-PY",
        title: "Advanced Machine Learning with Python",
        instructor: "Dr. Sarah Jenkins",
        date: "Aug 15, 2024",
        duration: "45 hours",
        image:
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
        skills: ["Python", "Machine Learning", "Deep Learning"],
        status: "Verified",
    },
    {
        id: "AI-LLM-9921",
        title: "Generative AI & LLM Engineering",
        instructor: "Prof. Alan Turing Inst.",
        date: "Jun 22, 2024",
        duration: "60 hours",
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        skills: ["Generative AI", "LLM", "Prompt Engineering"],
        status: "Verified",
    },
    {
        id: "FS-WEB-8842",
        title: "Full-Stack Web Development Bootcamp",
        instructor: "CodeCrafters Acad.",
        date: "Feb 10, 2024",
        duration: "120 hours",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        skills: ["React", "Node.js", "MongoDB"],
        status: "Verified",
    },
    {
        id: "UX-FIG-1029",
        title: "UI/UX Design Systems & Figma Mastery",
        instructor: "DesignLab Pro",
        date: "Nov 05, 2023",
        duration: "30 hours",
        image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
        skills: ["Figma", "UI/UX", "Design Systems"],
        status: "Verified",
    },
];

export default function Certificates() {
    const navigate = useNavigate();

    const [filter, setFilter] = useState("All");
    const [showFilter, setShowFilter] = useState(false);

    const filteredCertificates = useMemo(() => {
        if (filter === "All") return certificatesData;

        if (filter === "Recent") {
            return certificatesData.slice(0, 2);
        }

        return certificatesData.filter((certificate) =>
            certificate.title.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter]);

    const handleDownload = (certificate) => {
        /*
         * Replace this with your real certificate API/download endpoint.
         *
         * Example:
         * window.open(`/api/certificates/${certificate.id}/download`, "_blank");
         */

        const link = document.createElement("a");

        link.href = certificate.image;
        link.download = `${certificate.title
            .replace(/\s+/g, "-")
            .toLowerCase()}-certificate.jpg`;

        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async (certificate) => {
        const shareData = {
            title: certificate.title,
            text: `I completed ${certificate.title} on EduFlow.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Certificate link copied!");
            }
        } catch (error) {
            console.log("Share cancelled");
        }
    };

    const handleViewCertificate = (certificate) => {
        /*
         * Change this route according to your application.
         */
        // navigate(`/certificates/${certificate.id}`);
        navigate("/certificate/123");
    };

    return (
        <div className="min-h-screen w-full bg-[#0b1428] text-white">
            {/* =====================================================
                PAGE CONTAINER
            ====================================================== */}

            <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-7 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                        Certificates
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-gray-400">
                        Celebrate your achievements and showcase the skills
                        you've mastered.
                    </p>
                </div>

                {/* =====================================================
                    STATISTICS
                ====================================================== */}

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {/* Certificates */}
                    <StatCard
                        title="Certificates Earned"
                        value="4"
                        icon={
                            <WorkspacePremiumOutlinedIcon
                                sx={{ fontSize: 21 }}
                            />
                        }
                    />

                    {/* Courses */}
                    <StatCard
                        title="Courses Completed"
                        value="4"
                        icon={
                            <CheckCircleOutlineIcon
                                sx={{ fontSize: 21 }}
                            />
                        }
                    />

                    {/* Hours */}
                    <StatCard
                        title="Learning Hours"
                        value="142h"
                        icon={
                            <AccessTimeOutlinedIcon
                                sx={{ fontSize: 21 }}
                            />
                        }
                    />

                    {/* Latest */}
                    <StatCard
                        title="Latest Achievement"
                        value="Aug 2024"
                        icon={
                            <CalendarMonthOutlinedIcon
                                sx={{ fontSize: 21 }}
                            />
                        }
                    />
                </section>

                {/* =====================================================
                    CERTIFICATE SECTION HEADER
                ====================================================== */}

                <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-5">
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">My Certificates</h1>

                    {/* Filter */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowFilter((prev) => !prev)}
                            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <FilterListIcon sx={{ fontSize: 16 }} />
                            Filter
                        </button>

                        {showFilter && (
                            <div className="absolute right-0 top-8 z-30 w-40 rounded-xl border border-gray-700 bg-[#182238] shadow-2xl overflow-hidden">
                                {["All", "Recent"].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setFilter(option);
                                            setShowFilter(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${filter === option
                                            ? "bg-indigo-500/15 text-indigo-300"
                                            : "text-gray-300 hover:bg-white/5"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* =====================================================
                    CERTIFICATE GRID
                ====================================================== */}

                {filteredCertificates.length > 0 ? (
                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
                        {filteredCertificates.map((certificate) => (
                            <CertificateCard
                                key={certificate.id}
                                certificate={certificate}
                                onDownload={handleDownload}
                                onShare={handleShare}
                                onView={handleViewCertificate}
                            />
                        ))}
                    </section>
                ) : (
                    <EmptyState />
                )}
            </main>
        </div>
    );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ title, value, icon }) {
    return (
        <div
            className="min-h-[105px] sm:min-h-[120px] rounded-xl border border-gray-700/80 bg-[#1b263b] px-4 sm:px-5 py-4 sm:py-5
                transition-all hover:border-indigo-500/40"
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
                    {title}
                </p>

                <span className="text-indigo-300 shrink-0">
                    {icon}
                </span>
            </div>

            <p className="mt-3 text-xl sm:text-2xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}

/* ============================================================
   CERTIFICATE CARD
============================================================ */

function CertificateCard({
    certificate,
    onDownload,
    onShare,
    onView,
}) {
    return (
        <article
            className="
                group
                overflow-hidden
                rounded-xl
                border border-gray-700/80
                bg-[#1b263b]
                shadow-lg
                transition-all
                duration-300
                hover:border-indigo-500/40
                hover:-translate-y-0.5
            "
        >
            {/* =================================================
                CERTIFICATE IMAGE
            ================================================== */}

            <button
                type="button"
                onClick={() => onView(certificate)}
                className="
                    relative
                    block
                    w-full
                    aspect-[16/8]
                    sm:aspect-[16/8]
                    overflow-hidden 
                    bg-gray-900
                    cursor-pointer
                "
            >
                <img
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.02]
                    "
                    loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* View */}
                <div
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                    "
                >
                    <span className="flex items-center gap-2 rounded-lg bg-black/70 backdrop-blur px-4 py-2 text-sm font-medium">
                        <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                        View Certificate
                    </span>
                </div>
            </button>

            {/* =================================================
                CARD BODY
            ================================================== */}

            <div className="p-4 sm:p-5">
                {/* Title + Status */}

                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {certificate.title}
                    </h3>

                    <span
                        className="
                            shrink-0
                            rounded-full
                            border border-emerald-500/20
                            bg-emerald-500/15
                            px-2
                            py-1
                            text-[9px]
                            sm:text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-emerald-400
                        "
                    >
                        {certificate.status}
                    </span>
                </div>

                {/* Instructor */}

                <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-gray-300">
                    <PersonOutlineOutlinedIcon
                        sx={{ fontSize: 16 }}
                        className="text-gray-400"
                    />

                    <span className="truncate">
                        Instructor: {certificate.instructor}
                    </span>
                </div>

                {/* Date + Duration */}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-xs sm:text-sm text-gray-300">
                    <div className="flex items-center gap-1.5">
                        <CalendarMonthOutlinedIcon
                            sx={{ fontSize: 15 }}
                            className="text-gray-400"
                        />
                        {certificate.date}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <AccessTimeOutlinedIcon
                            sx={{ fontSize: 15 }}
                            className="text-gray-400"
                        />
                        {certificate.duration}
                    </div>
                </div>

                {/* Certificate ID */}

                <p className="mt-3 text-[10px] sm:text-[11px] text-gray-500 font-mono">
                    ID: {certificate.id}
                </p>

                {/* Divider */}

                <div className="my-4 border-t border-gray-700/70" />

                {/* Buttons */}

                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <button
                        type="button"
                        onClick={() => onDownload(certificate)}
                        className="
                            min-h-[42px]
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-indigo-500
                            text-indigo-300
                            hover:bg-indigo-500/10
                            active:scale-[0.98]
                            transition-all
                            text-xs
                            sm:text-sm
                            font-medium
                            cursor-pointer
                        "
                    >
                        <DownloadOutlinedIcon sx={{ fontSize: 17 }} />
                        <span>Download</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onShare(certificate)}
                        className="
                            min-h-[42px]
                            min-w-[78px]
                            sm:min-w-[90px]
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#111b30]
                            border
                            border-transparent
                            hover:border-gray-600
                            text-gray-300
                            hover:text-white
                            active:scale-[0.98]
                            transition-all
                            text-xs
                            sm:text-sm
                            font-medium
                            cursor-pointer
                        "
                    >
                        <ShareOutlinedIcon sx={{ fontSize: 17 }} />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </article>
    );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <WorkspacePremiumOutlinedIcon
                    sx={{
                        fontSize: 32,
                        color: "#818cf8",
                    }}
                />
            </div>

            <h3 className="text-xl font-bold text-white">
                No certificates found
            </h3>

            <p className="text-sm text-gray-400 mt-2 max-w-md">
                Complete courses to earn certificates and showcase your
                achievements.
            </p>
        </div>
    );
}