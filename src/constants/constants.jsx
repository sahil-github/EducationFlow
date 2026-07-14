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
        options: ["Student", "Software / IT professional", "Healthcare", "Other"],
    },
    {
        id: "age",
        label: "Age",
        options: ["Under 18", "18-24", "25-34", "35-50", "50+"],
    },
    {
        id: "cert",
        label: "Certification held",
        options: [
            "None",
            "Vendor cert (AWS, Microsoft, etc.)",
            "Academic degree",
            "Professional license (PMP, CPA, etc.)",
        ],
    },
    {
        id: "aicert",
        label: "AI certification",
        options: ["None", "In progress", "Completed one", "Completed multiple"],
    },
    {
        id: "experience",
        label: "Experience level",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    {
        id: "goal",
        label: "Primary learning goal",
        options: [
            "Career switch",
            "Skill upgrade",
            "Certification prep",
            "Personal interest",
        ],
    },
    {
        id: "time",
        label: "Time commitment",
        options: [
            "Under 2 hrs/week",
            "2-5 hrs/week",
            "5-10 hrs/week",
            "10+ hrs/week",
        ],
    },
    {
        id: "format",
        label: "Preferred format",
        options: [
            "Self-paced video",
            "Live cohort",
            "Reading / text",
            "Hands-on projects",
        ],
    },
];

