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
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

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

export const locations = [
    "San Francisco, CA",
    "New York, NY",
    "London, UK",
    "Bengaluru, India",
    "Toronto, Canada",
    "Sydney, Australia",
    "Remote / Anywhere",
];

export const levels = [
    { id: 'Web development', title: 'Web Development', icon: <CodeIcon /> },
    { id: 'Public speaking', title: 'Public Speaking', icon: <RecordVoiceOverIcon /> },
    { id: 'UI/UX Design', title: 'UI/UX Design', icon: <ColorLensIcon /> }
];

export const DEFAULT_SKILLS = [
    "Tech & Development",
    "Business Strategy & Growth",
    "Marketing & Branding",
    "Sales & Partnerships",
    "Communication",
    "Leadership",
    "Project Management",
    "Problem Solving",
    "Teamwork",
    "Time Management",
    "Critical Thinking",
    "Negotiation",
    "Technical Writing",
    "Data Analysis",
    "Python",
    "Java",
    "Public Speaking",
    "Creativity",
    "Customer Service",
    "UI/UX Design",
    "React",
    "Node.js",
    "Cloud Computing",
    "Machine Learning",
    "Cybersecurity",
    "SQL",
    "Product Management",
    "DevOps",
];

export const DEFAULT_INTERESTS = [
    "Web Development",
    "AI & ML",
    "UI/UX Design",
    "Cybersecurity",
    "Data Analytics",
    "Graphic Design",
    "Marketing",
    "Entrepreneurship",
    "Photography",
    "Music Theory",
    "Physics",
    "Wellness",
    "Psychology",
    "Cloud Architecture",
    "Mobile Apps",
    "Blockchain",
];

export const DEFAULT_GOALS = [
    "Get a software development job",
    "Improve React skills",
    "Learn backend development",
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
];



export const dummyCoursePricing = {
    price: 399,
    originalPrice: 3289,
    discount: 88,
    currency: "INR",
};

export const dummyCourseContent = {
    whatYouWillLearn: [
        "Build and train machine learning models using Python",
        "Perform data preprocessing and feature engineering",
        "Build regression and classification models",
        "Understand decision trees and random forest algorithms",
        "Work with clustering and unsupervised learning",
        "Build neural networks and understand deep learning fundamentals",
        "Evaluate and improve machine learning model performance",
        "Handle overfitting and underfitting",
        "Perform hyperparameter tuning",
        "Deploy machine learning models into production",
    ],

    modules: [
        {
            id: 1,
            title: "Python for Machine Learning",
            duration: "2h 30m",
            lessons: [
                "Introduction to Machine Learning",
                "Python Environment Setup",
                "NumPy Fundamentals",
                "Pandas for Data Analysis",
            ],
        },
        {
            id: 2,
            title: "Data Preparation & Exploration",
            duration: "2h 15m",
            lessons: [
                "Understanding Real-World Datasets",
                "Data Cleaning",
                "Handling Missing Values",
                "Feature Engineering",
                "Data Visualization",
            ],
        },
        {
            id: 3,
            title: "Supervised Learning",
            duration: "3h 20m",
            lessons: [
                "Linear Regression",
                "Logistic Regression",
                "Classification Algorithms",
                "Model Evaluation",
                "Confusion Matrix",
            ],
        },
        {
            id: 4,
            title: "Decision Trees & Ensemble Learning",
            duration: "2h 45m",
            lessons: [
                "Decision Trees",
                "Random Forest",
                "Gradient Boosting",
                "XGBoost",
            ],
        },
        {
            id: 5,
            title: "Unsupervised Learning",
            duration: "2h 10m",
            lessons: [
                "Introduction to Clustering",
                "K-Means Clustering",
                "Hierarchical Clustering",
                "Dimensionality Reduction",
            ],
        },
        {
            id: 6,
            title: "Deep Learning Fundamentals",
            duration: "4h 00m",
            lessons: [
                "Introduction to Neural Networks",
                "Neurons and Activation Functions",
                "Building Neural Networks",
                "Training Deep Learning Models",
            ],
        },
    ],

    projects: [
        {
            title: "Customer Churn Prediction",
            description:
                "Build a machine learning model that predicts whether a customer is likely to leave a service.",
            technology: "Python • Pandas • Scikit-learn",
        },
        {
            title: "House Price Prediction",
            description:
                "Build a regression model to predict house prices using real-world housing data.",
            technology: "Python • Regression • ML",
        },
        {
            title: "Customer Segmentation",
            description:
                "Use clustering algorithms to divide customers into meaningful groups.",
            technology: "Python • K-Means • Pandas",
        },
    ],

    technologies: [
        "Python",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Scikit-learn",
        "TensorFlow",
        "PyTorch",
        "Jupyter Notebook",
        "Git",
    ],

    requirements: [
        "Basic Python programming knowledge",
        "Understanding of programming fundamentals",
        "Basic mathematics and statistics",
        "A laptop or desktop computer",
        "No previous machine learning experience is required",
    ],

    targetAudience: [
        "Students who want to learn Machine Learning",
        "Software developers interested in AI/ML",
        "Data analysts moving toward Machine Learning",
        "Python developers",
        "AI and Machine Learning enthusiasts",
    ],

    includes: [
        "24 hours of on-demand video",
        "48 lessons",
        "Downloadable resources",
        "Coding exercises",
        "Real-world projects",
        "Certificate of completion",
        "Lifetime course access",
        "Mobile and desktop access",
    ],

    about: [
        "This course takes you from advanced machine learning concepts to building practical and production-ready machine learning applications using Python.",
        "You will work with real-world datasets and learn how to prepare data, select appropriate algorithms, train models, evaluate their performance, and improve them using different optimization techniques.",
        "Throughout the course, you will also build practical projects that help you understand how machine learning is applied to real-world problems.",
    ],

    instructor: {
        name: "Dr. Sarah Jenkins",
        role: "Senior Machine Learning Engineer",
        experience: "10+ years of industry experience",
        students: "45K+",
        courses: 12,
        rating: 4.9,
    },

    faqs: [
        {
            question: "Do I need prior Python knowledge?",
            answer:
                "Yes. Basic Python programming knowledge is recommended before starting this course.",
        },
        {
            question: "Is this course suitable for beginners?",
            answer:
                "This course is designed for learners who already understand basic programming concepts.",
        },
        {
            question: "Will I build real projects?",
            answer:
                "Yes. You will build multiple practical machine learning projects using real-world datasets.",
        },
        {
            question: "Will I receive a certificate?",
            answer:
                "Yes. You will receive a certificate after successfully completing the course.",
        },
        {
            question: "Can I access the course from mobile?",
            answer:
                "Yes. The course can be accessed from both desktop and mobile devices.",
        },
    ],
};
