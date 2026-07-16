import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";
import CodeIcon from "@mui/icons-material/Code";
import CampaignIcon from "@mui/icons-material/Campaign";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BrushIcon from "@mui/icons-material/Brush";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ScienceIcon from "@mui/icons-material/Science";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BiotechIcon from "@mui/icons-material/Biotech";


export const InterestData = [
    {
        id: 1,
        name: "Technology",
        color: "text-indigo-400",
        example: [
            {
                id: 101,
                exname: "AI & ML",
                icon: PsychologyIcon,
            },
            {
                id: 102,
                exname: "Web Development",
                icon: CodeIcon,
            },
            {
                id: 103,
                exname: "Cybersecurity",
                icon: SecurityIcon,
            },
        ],
    },

    {
        id: 2,
        name: "Arts",
        color: "text-cyan-400",
        example: [
            {
                id: 201,
                exname: "Graphic Design",
                icon: BrushIcon,
            },
            {
                id: 202,
                exname: "Photography",
                icon: CameraAltIcon,
            },
            {
                id: 203,
                exname: "Music Theory",
                icon: MusicNoteIcon,
            },
        ],
    },

    {
        id: 3,
        name: "Business",
        color: "text-pink-400",
        example: [
            {
                id: 301,
                exname: "Marketing",
                icon: CampaignIcon,
            },
            {
                id: 302,
                exname: "Data Analytics",
                icon: AnalyticsIcon,
            },
            {
                id: 303,
                exname: "Entrepreneurship",
                icon: BusinessCenterIcon,
            },
        ],
    },

    {
        id: 4,
        name: "Science & Health",
        color: "text-orange-400",
        example: [
            {
                id: 401,
                exname: "Physics",
                icon: ScienceIcon,
            },
            {
                id: 402,
                exname: "Wellness",
                icon: FavoriteIcon,
            },
            {
                id: 403,
                exname: "Psychology",
                icon: BiotechIcon,
            },
        ],
    },
];

export const FIELDS = [
    {
        id: "profession",
        label: "Profession",
        options: [
            "Student",
            "Software / IT Professional",
            "Healthcare",
            "Teacher / Educator",
            "Business / Management",
            "Finance / Banking",
            "Marketing / Sales",
            "Designer / Creative",
            "Engineer",
            "Entrepreneur",
            "Government Employee",
            "Freelancer",
            "Other",
        ],
    },
    {
        id: "age",
        label: "Age",
        options: [
            "Under 18",
            "18-24",
            "25-34",
            "35-44",
            "45-54",
            "55-64",
            "65+",
        ],
    },
    {
        id: "cert",
        label: "Certification Held",
        options: [
            "None",
            "High School Diploma",
            "Bachelor's Degree",
            "Master's Degree",
            "Doctorate (PhD)",
            "Diploma",
            "Vendor Certification (AWS, Azure, Google Cloud)",
            "Professional Certification (PMP, CPA, Scrum Master)",
            "Industry License",
            "Other",
        ],
    },
    {
        id: "aicert",
        label: "AI Certification",
        options: [
            "None",
            "In Progress",
            "Completed One",
            "Completed Multiple",
            "Google AI",
            "Microsoft AI",
            "AWS AI",
            "IBM AI",
            "Coursera AI Certificate",
            "Udacity AI Nanodegree",
        ],
    },
    {
        id: "experience",
        label: "Experience Level",
        options: [
            "Complete Beginner",
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
            "5+ Years",
            "10+ Years",
        ],
    },
    {
        id: "goal",
        label: "Primary Learning Goal",
        options: [
            "Career Switch",
            "Skill Upgrade",
            "Certification Preparation",
            "Personal Interest",
            "Get a Promotion",
            "Start Freelancing",
            "Build a Portfolio",
            "Prepare for Interviews",
            "Learn AI",
            "Become a Full Stack Developer",
            "Start a Business",
            "Improve Productivity",
        ],
    },
    {
        id: "time",
        label: "Time Commitment",
        options: [
            "Less than 1 hour/week",
            "1-2 hours/week",
            "2-5 hours/week",
            "5-10 hours/week",
            "10-15 hours/week",
            "15-20 hours/week",
            "20+ hours/week",
        ],
    },
    {
        id: "format",
        label: "Preferred Learning Format",
        options: [
            "Self-paced Video",
            "Live Cohort",
            "Reading / Text",
            "Hands-on Projects",
            "Interactive Coding Exercises",
            "One-on-One Mentorship",
            "Bootcamp",
            "Workshops",
            "Podcasts",
            "Webinars",
            "Case Studies",
            "Community Discussions",
        ],
    },
];
export const bios = [
    "Passionate Full Stack Developer focused on building modern, scalable web applications and continuously learning new technologies.",
    "Tech enthusiast who enjoys solving real-world problems through clean code, innovative solutions, and continuous learning.",
    "Frontend developer dedicated to creating responsive, user-friendly interfaces with React and modern JavaScript.",
    "Aspiring software engineer passionate about web development, problem-solving, and building impactful digital products.",
    "Lifelong learner exploring web technologies, UI/UX design, and software engineering best practices every day."
];

