import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

/* ============================================================
   DUMMY QUIZ DATA
============================================================ */

const questions = [
    {
        id: 1,
        type: "MULTIPLE CHOICE",
        question:
            "Which HTTP method is commonly used to update an existing resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "PUT",
        userAnswer: "PUT",
        explanation:
            "PUT is commonly used to replace or update an existing resource entity. While POST can also be used for updates in some API designs, PUT is the standard method for idempotent updates where the client provides the complete updated representation of the resource.",
    },

    {
        id: 2,
        type: "MULTIPLE CHOICE",
        question:
            "Which JavaScript keyword is used to declare a variable that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correctAnswer: "const",
        userAnswer: "const",
        explanation:
            "The const keyword creates a variable binding that cannot be reassigned after initialization.",
    },

    {
        id: 3,
        type: "MULTIPLE CHOICE",
        question:
            "Which React hook is commonly used to manage component state?",
        options: ["useEffect", "useState", "useMemo", "useRef"],
        correctAnswer: "useState",
        userAnswer: "useEffect",
        explanation:
            "useState is the React hook used to add and manage state inside functional components.",
    },

    {
        id: 4,
        type: "MULTIPLE CHOICE",
        question:
            "Which HTTP status code represents a successful request?",
        options: ["200", "404", "500", "401"],
        correctAnswer: "200",
        userAnswer: "200",
        explanation:
            "HTTP 200 OK indicates that the request was successfully processed.",
    },

    {
        id: 5,
        type: "MULTIPLE CHOICE",
        question:
            "Which technology is primarily used to style web pages?",
        options: ["HTML", "CSS", "Node.js", "MongoDB"],
        correctAnswer: "CSS",
        userAnswer: "CSS",
        explanation:
            "CSS is used to control the presentation, layout, colors, typography and visual appearance of web pages.",
    },

    {
        id: 6,
        type: "MULTIPLE CHOICE",
        question:
            "Which database is commonly associated with the MERN stack?",
        options: ["MySQL", "MongoDB", "PostgreSQL", "Oracle"],
        correctAnswer: "MongoDB",
        userAnswer: "MongoDB",
        explanation:
            "MongoDB is the database component of the MERN stack.",
    },

    {
        id: 7,
        type: "MULTIPLE CHOICE",
        question:
            "Which hook is commonly used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: "useEffect",
        userAnswer: "useEffect",
        explanation:
            "useEffect allows React components to perform side effects such as API calls, subscriptions and DOM-related operations.",
    },

    {
        id: 8,
        type: "MULTIPLE CHOICE",
        question:
            "Which HTTP method is normally used to retrieve data?",
        options: ["GET", "POST", "PUT", "PATCH"],
        correctAnswer: "GET",
        userAnswer: "GET",
        explanation:
            "GET requests are commonly used by clients to retrieve resources from a server.",
    },

    {
        id: 9,
        type: "MULTIPLE CHOICE",
        question:
            "Which status code indicates that a requested resource was not found?",
        options: ["200", "201", "404", "500"],
        correctAnswer: "404",
        userAnswer: "404",
        explanation:
            "The HTTP 404 status code indicates that the requested resource could not be found.",
    },

    {
        id: 10,
        type: "MULTIPLE CHOICE",
        question:
            "Which tool is commonly used to manage packages in a JavaScript project?",
        options: ["npm", "Git", "Vite", "Docker"],
        correctAnswer: "npm",
        userAnswer: "npm",
        explanation:
            "npm is the default package manager commonly used with Node.js projects.",
    },

    {
        id: 11,
        type: "MULTIPLE CHOICE",
        question:
            "Which command is commonly used to create a new Git repository?",
        options: ["git start", "git init", "git create", "git new"],
        correctAnswer: "git init",
        userAnswer: "git init",
        explanation:
            "git init initializes a new Git repository in the current directory.",
    },

    {
        id: 12,
        type: "MULTIPLE CHOICE",
        question:
            "Which React feature is used to render different pages based on URLs?",
        options: ["React Router", "Redux", "Axios", "Vite"],
        correctAnswer: "React Router",
        userAnswer: "React Router",
        explanation:
            "React Router is commonly used to implement client-side routing in React applications.",
    },

    {
        id: 13,
        type: "MULTIPLE CHOICE",
        question:
            "Which language is primarily used to query MongoDB?",
        options: ["JavaScript", "SQL", "MongoDB Query Language", "CSS"],
        correctAnswer: "MongoDB Query Language",
        userAnswer: "MongoDB Query Language",
        explanation:
            "MongoDB provides its own query language for interacting with collections and documents.",
    },

    {
        id: 14,
        type: "MULTIPLE CHOICE",
        question:
            "Which HTTP method is commonly used to create a new resource?",
        options: ["GET", "POST", "DELETE", "HEAD"],
        correctAnswer: "POST",
        userAnswer: "POST",
        explanation:
            "POST is commonly used to submit data to a server and create a new resource.",
    },

    {
        id: 15,
        type: "MULTIPLE CHOICE",
        question:
            "Which library is commonly used for global state management in React?",
        options: ["Redux", "Express", "Mongoose", "Nodemon"],
        correctAnswer: "Redux",
        userAnswer: "Redux",
        explanation:
            "Redux is a predictable state management library commonly used with React applications.",
    },
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function QuizReview() {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(7);

    const question = questions[currentQuestion - 1];

    const correctCount = questions.filter(
        (item) => item.correctAnswer === item.userAnswer
    ).length;

    const incorrectCount = questions.length - correctCount;

    const score = Math.round(
        (correctCount / questions.length) * 100
    );

    const isCorrect =
        question.correctAnswer === question.userAnswer;

    const goToQuestion = (number) => {
        setCurrentQuestion(number);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            goToQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length) {
            goToQuestion(currentQuestion + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1428] text-white flex flex-col">

            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="flex-1">

                <div className="w-full max-w-[880px] lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">

                    {/* =================================================
                        PAGE HEADER
                    ================================================== */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-5 border-b border-gray-800">

                        <div>

                            <h1 className="text-xl sm:text-2xl font-bold text-white">
                                Advanced Web Technologies - Final Quiz
                            </h1>

                            <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                Reviewing your answers
                            </p>

                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">

                            {/* Score */}

                            <div className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-full
                                border
                                border-emerald-500/30
                                bg-emerald-500/10
                                text-emerald-400
                                text-xs
                                sm:text-sm
                                font-semibold
                            ">

                                <CheckCircleOutlineIcon
                                    sx={{ fontSize: 16 }}
                                />

                                Score: 88% (88/100)

                            </div>

                            <button
                                onClick={() =>
                                    navigate("/courses/1/learn")
                                }
                                className="
                                    px-3 sm:px-4
                                    py-2
                                    rounded-md
                                    bg-[#202d43]
                                    border border-gray-700
                                    text-gray-200
                                    text-xs sm:text-sm
                                    font-semibold
                                    hover:bg-[#293750]
                                    transition
                                    cursor-pointer
                                "
                            >
                                Back to Course
                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        CONTENT GRID
                    ================================================== */}

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_285px] gap-5 lg:gap-6 mt-5">

                        {/* =================================================
                            LEFT COLUMN
                        ================================================== */}

                        <div className="min-w-0">

                            {/* QUESTION CARD */}

                            <section className="
                                rounded-xl
                                border border-gray-700
                                bg-[#1d2a40]
                                overflow-hidden
                            ">

                                <div className="p-5 sm:p-6">

                                    {/* Question Header */}

                                    <div className="flex items-start justify-between gap-4 mb-5">

                                        <div className="min-w-0">

                                            <p className="text-[10px] sm:text-xs font-bold tracking-wide text-indigo-200 mb-2">
                                                {question.type}
                                            </p>

                                            <h2 className="text-base sm:text-lg font-bold leading-relaxed text-white">
                                                {question.question}
                                            </h2>

                                        </div>

                                        {/* Status */}

                                        <div className={`
                                            shrink-0
                                            flex
                                            items-center
                                            gap-1.5
                                            px-3
                                            py-1.5
                                            rounded-md
                                            text-xs
                                            font-semibold
                                            ${isCorrect
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-red-500/10 text-red-400"
                                            }
                                        `}>

                                            <CheckCircleOutlineIcon
                                                sx={{ fontSize: 15 }}
                                            />

                                            {isCorrect
                                                ? "Correct"
                                                : "Incorrect"}

                                        </div>

                                    </div>

                                    {/* OPTIONS */}

                                    <div className="space-y-2.5">

                                        {question.options.map(
                                            (option) => {

                                                const isUserAnswer =
                                                    option ===
                                                    question.userAnswer;

                                                const isCorrectAnswer =
                                                    option ===
                                                    question.correctAnswer;

                                                let optionClass =
                                                    "border-gray-700 bg-[#1d2a40]";

                                                if (
                                                    isCorrectAnswer
                                                ) {
                                                    optionClass =
                                                        "border-emerald-500 bg-emerald-500/10";
                                                } else if (
                                                    isUserAnswer &&
                                                    !isCorrectAnswer
                                                ) {
                                                    optionClass =
                                                        "border-red-500 bg-red-500/10";
                                                }

                                                return (
                                                    <div
                                                        key={option}
                                                        className={`
                                                            min-h-[46px]
                                                            rounded-lg
                                                            border
                                                            px-3 sm:px-4
                                                            py-3
                                                            flex
                                                            items-center
                                                            gap-3
                                                            ${optionClass}
                                                        `}
                                                    >

                                                        <div className="shrink-0">

                                                            {isCorrectAnswer ? (
                                                                <CheckCircleOutlineIcon
                                                                    sx={{
                                                                        fontSize: 20,
                                                                        color: "#10b981",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <RadioButtonUncheckedIcon
                                                                    sx={{
                                                                        fontSize: 20,
                                                                        color: isUserAnswer
                                                                            ? "#f87171"
                                                                            : "#7c879b",
                                                                    }}
                                                                />
                                                            )}

                                                        </div>

                                                        <span className={`
                                                            text-sm
                                                            ${isCorrectAnswer
                                                                ? "text-white font-medium"
                                                                : isUserAnswer
                                                                    ? "text-red-300"
                                                                    : "text-gray-400"
                                                            }
                                                        `}>
                                                            {option}
                                                        </span>

                                                        {/* Right label */}

                                                        {isCorrectAnswer && (
                                                            <span className="ml-auto text-[10px] sm:text-xs font-semibold text-emerald-400 text-right">
                                                                {isUserAnswer
                                                                    ? "Your Answer & Correct"
                                                                    : "Correct Answer"}
                                                            </span>
                                                        )}

                                                        {isUserAnswer &&
                                                            !isCorrectAnswer && (
                                                                <span className="ml-auto text-[10px] sm:text-xs font-semibold text-red-400">
                                                                    Your Answer
                                                                </span>
                                                            )}

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            </section>

                            {/* =================================================
                                EXPLANATION
                            ================================================== */}

                            <section className="
                                mt-3 sm:mt-4
                                rounded-xl
                                border border-gray-700
                                bg-[#1d2a40]
                                p-5 sm:p-6
                            ">

                                <div className="flex items-center gap-2 text-indigo-200 font-semibold text-sm mb-4">

                                    <LightbulbOutlinedIcon
                                        sx={{ fontSize: 18 }}
                                    />

                                    Explanation

                                </div>

                                <p className="text-xs sm:text-sm leading-6 text-gray-300">
                                    {question.explanation}
                                </p>

                            </section>

                            {/* =================================================
                                PREVIOUS / NEXT
                            ================================================== */}

                            <div className="flex items-center justify-between mt-6">

                                <button
                                    type="button"
                                    disabled={currentQuestion === 1}
                                    onClick={handlePrevious}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-gray-300
                                        hover:text-white
                                        disabled:opacity-30
                                        disabled:cursor-not-allowed
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    <ArrowBackIcon
                                        sx={{ fontSize: 16 }}
                                    />

                                    Previous

                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        currentQuestion ===
                                        questions.length
                                    }
                                    onClick={handleNext}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2
                                        rounded-md
                                        bg-[#202d43]
                                        border border-gray-700
                                        text-gray-200
                                        text-sm
                                        font-semibold
                                        hover:bg-[#293750]
                                        disabled:opacity-30
                                        disabled:cursor-not-allowed
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    Next

                                    <ArrowForwardIcon
                                        sx={{ fontSize: 16 }}
                                    />

                                </button>

                            </div>

                        </div>

                        {/* =================================================
                            RIGHT SIDEBAR
                        ================================================== */}

                        <aside className="
                            rounded-xl
                            border border-gray-700
                            bg-[#1d2a40]
                            p-5
                            h-fit
                            lg:sticky
                            lg:top-5
                        ">

                            <h2 className="text-base sm:text-lg font-bold text-white">
                                Question Navigator
                            </h2>

                            <div className="border-t border-gray-700 mt-4 pt-4">

                                {/* Legend */}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 mb-5">

                                    <div className="flex items-center gap-2">

                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                                        Correct ({correctCount})

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <span className="w-2.5 h-2.5 rounded-full border border-red-400" />

                                        Incorrect ({incorrectCount})

                                    </div>

                                </div>

                                {/* Question Numbers */}

                                <div className="grid grid-cols-5 gap-2">

                                    {questions.map((item) => {

                                        const itemCorrect =
                                            item.correctAnswer ===
                                            item.userAnswer;

                                        const isActive =
                                            item.id ===
                                            currentQuestion;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() =>
                                                    goToQuestion(
                                                        item.id
                                                    )
                                                }
                                                className={`
                                                    aspect-square
                                                    rounded-md
                                                    border
                                                    text-xs
                                                    sm:text-sm
                                                    font-medium
                                                    transition
                                                    cursor-pointer

                                                    ${isActive
                                                        ? "border-indigo-300 bg-indigo-200 text-indigo-900 ring-2 ring-indigo-300/30"
                                                        : itemCorrect
                                                            ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                                            : "border-red-400/70 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                                    }
                                                `}
                                            >
                                                {item.id}
                                            </button>
                                        );
                                    })}

                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}