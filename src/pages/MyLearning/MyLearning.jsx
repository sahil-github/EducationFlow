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
    return (
        <div className="w-full p-10">
            <div className=" ">
                <h1 className="text-white text-4xl font-bold mb-4 ">

                    My Learning
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">
                    track your progress and continue where you left off in your learning journey </p>
            </div>
            <div>
                <h2 className='text-xl mb-2'> <PlayCircleIcon className='mr-2' fontSize="large" />In Progress</h2>
                <div className='flex gap-4 mb-4'>
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
            <div>
                <h1 className="text-white text-2xl font-bold mb-4 ">Saved for Later</h1>
            </div>
        </div>
    )
}

export default MyLearning