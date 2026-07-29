import Card from '../../components/Card'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';


function MyLearning() {

    const learningCourses = [
        {
            id: 1,
            category: "Advanced Data Science",
            title: "Predictive Modeling with Python",
            progress: 68,
            timeLeft: "2h left",
            buttonText: "Continue Lesson",
        },
        {
            id: 2,
            category: "UX/UI Design",
            title: "Design Systems for Enterprise",
            progress: 12,
            timeLeft: "14h left",
            buttonText: "Resume Module",
        },
        {
            id: 3,
            category: "Professional Development",
            title: "Critical Thinking for Leaders",
            progress: 92,
            timeLeft: "45m left",
            buttonText: "Finish Module",
        },
    ];

    const courseSavedCategories = [
        {
            id: 1,
            category: "Management",
            title: "Time Mastery for Creatives",
            duration: "4.5 hours",
        },
        {
            id: 2,
            category: "Security",
            title: "Cybersecurity Fundamentals",
            duration: "12 hours",
        },
    ];

    const completedCategories = [{
        id: 1,
        course: 'Intro to Agile',
        certificateDate: 'certified oct 12'
    },
    {
        id: 2,
        course: 'Modern Js ES6+',
        certificateDate: 'certified sep 28'
    }
    ]
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20">
            <div className=" ">
                <h1 className="text-white text-2xl md:text-4xl font-bold mb-4 ">
                    My Learning
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">
                    track your progress and continue where you left off in your learning journey </p>
            </div>
            <div>
                <h2 className='text-xl mb-2'> <PlayCircleIcon className='mr-2' fontSize="large" />In Progress</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8'>
                    {learningCourses.map((course) => (

                        <Card className="h-full w-full px-4 text-start rounded-xl " key={course.id}>
                            <div className="flex  text-white h-40">

                                <p>{course.timeLeft}</p>
                            </div>
                            <div className="text-white h-40 ">

                                <div className="gap-2">
                                    <p>{course.title}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <div className='flex flex-col xl:flex-row gap-8 xl:gap-6 mt-8'>
                <div className='flex-1'>
                    <h1 className="text-white text-2xl font-bold mb-4 ">Saved for Later</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {courseSavedCategories.map((course) => (
                            <Card className="flex  gap-4 p-4 rounded-xl border border-gray-700 bg-[#1A1D24]" key={course.id} >

                                {/* Image goes here */}
                                <div>
                                    <p className="text-xs text-gray-400">{course.category}</p>
                                    <h3 className="text-white font-medium">{course.title}</h3>
                                    <p className="text-sm text-gray-400">🕒 {course.duration}</p>
                                </div>
                            </Card>
                        ))}


                    </div>
                </div>
                <div className='flex-1'>
                    <h1 className="text-white text-2xl font-bold mb-4 ">Completed</h1>
                    <div className="flex flex-col gap-4">
                    {completedCategories.map((complete) => (
                        <Card className="   p-4 rounded-xl border border-gray-700 bg-[#1A1D24]" key={complete.id} >
                            <h3 className="text-white font-medium">{complete.course}</h3>
                            <p className="text-xs text-gray-400">{complete.certificateDate}</p>

                        </Card>
                    ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyLearning