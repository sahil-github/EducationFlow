import React from "react";
import { useNavigate } from "react-router-dom";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreIcon from "@mui/icons-material/Explore";

export default function IntroMylearning() {
    const navigate = useNavigate();

    const handleContinueLearning = () => {
        navigate("/my-learning");
    };

    const handleExploreCourses = () => {
        navigate("/catalog");
    };

    return (
        <div className="min-h-screen w-full bg-[#0b1428] text-white flex flex-col">

            {/* =========================
                MAIN CONTENT
            ========================= */}
            <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8">

                <div className="w-full max-w-7xl">

                    {/* Empty Certificate Container */}
                    <section className="min-h-[calc(100vh-180px)] flex items-center justify-center py-10 sm:py-14 md:py-16">

                        <div
                            className="
                                w-full
                                max-w-[488px]
                                bg-[#202c40]
                                border border-[#344158]
                                rounded-xl
                                px-5
                                py-10
                                sm:px-8
                                sm:py-11
                                md:px-10
                                md:py-12
                                text-center
                                shadow-[0_10px_35px_rgba(0,0,0,0.15)]
                            "
                        >

                            {/* =========================
                                CERTIFICATE ICON
                            ========================= */}
                            <div className="flex justify-center mb-6">

                                <div
                                    className="
                                        w-[76px]
                                        h-[76px]
                                        sm:w-[78px]
                                        sm:h-[78px]
                                        rounded-full
                                        bg-[#7378ad]
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <WorkspacePremiumIcon
                                        sx={{
                                            fontSize: {
                                                xs: 42,
                                                sm: 44,
                                            },
                                            color: "#c9c9ff",
                                        }}
                                    />
                                </div>

                            </div>

                            {/* =========================
                                TITLE
                            ========================= */}
                            <h1
                                className="
                                    text-xl
                                    sm:text-[21px]
                                    md:text-[22px]
                                    font-bold
                                    text-white
                                    leading-tight
                                "
                            >
                                No certificates yet
                            </h1>

                            {/* =========================
                                DESCRIPTION
                            ========================= */}
                            <p
                                className="
                                    mt-3
                                    text-sm
                                    sm:text-[14px]
                                    leading-5
                                    sm:leading-6
                                    text-[#c5cbe0]
                                    max-w-[370px]
                                    mx-auto
                                "
                            >
                                Complete your first course to earn a
                                certificate and showcase your achievement.
                            </p>

                            {/* =========================
                                ACTION BUTTONS
                            ========================= */}
                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-col
                                    sm:flex-row
                                    items-stretch
                                    sm:items-center
                                    justify-center
                                    gap-3
                                "
                            >

                                {/* Continue Learning */}
                                <button
                                    type="button"
                                    onClick={handleContinueLearning}
                                    className="
                                        w-full
                                        sm:w-auto
                                        min-w-[143px]
                                        h-[38px]
                                        px-5
                                        rounded-md
                                        bg-[#6366f1]
                                        hover:bg-[#5558e8]
                                        active:bg-[#4f51d8]
                                        text-white
                                        text-xs
                                        sm:text-[13px]
                                        font-semibold
                                        transition-all
                                        duration-200
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        cursor-pointer
                                        shadow-sm
                                        hover:shadow-[0_4px_15px_rgba(99,102,241,0.25)]
                                    "
                                >
                                    Continue Learning

                                    <ArrowForwardIcon
                                        sx={{
                                            fontSize: 15,
                                        }}
                                    />
                                </button>

                                {/* Explore Courses */}
                                <button
                                    type="button"
                                    onClick={handleExploreCourses}
                                    className="
                                        w-full
                                        sm:w-auto
                                        min-w-[133px]
                                        h-[38px]
                                        px-5
                                        rounded-md
                                        border
                                        border-[#5965ff]
                                        bg-transparent
                                        hover:bg-[#5965ff]/10
                                        active:bg-[#5965ff]/20
                                        text-[#7f83ff]
                                        hover:text-[#9b9eff]
                                        text-xs
                                        sm:text-[13px]
                                        font-semibold
                                        transition-all
                                        duration-200
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        cursor-pointer
                                    "
                                >
                                    <ExploreIcon
                                        sx={{
                                            fontSize: 16,
                                        }}
                                    />

                                    Explore Courses
                                </button>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}