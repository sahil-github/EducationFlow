import Button from '../../components/Button'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function EmptyStateAssignment() {
    return (
        <div className="min-h-screen w-full bg-[#0b1428] text-white flex flex-col">
            {/* MAIN CONTENT */}
            <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl">
                    {/* Empty Certificate Container */}
                    <section className="min-h-[calc(100vh-180px)] flex items-center justify-center py-10 sm:py-14 md:py-16">
                        <div className="w-full max-w-[488px] bg-[#202c40] border border-[#344158] rounded-xl px-5 py-10 sm:px-8 sm:py-11 md:px-10 md:py-12 text-center shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                            {/* CERTIFICATE ICON */}
                            <div className="flex justify-center mb-6">
                                <div className="w-[76px] h-[76px] sm:w-[78px] sm:h-[78px] rounded-full bg-[#7378ad] flex items-center justify-center">
                                    <AssignmentTurnedInIcon
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
                            {/* TITLE */}
                            <h1 className="text-xl sm:text-[21px] md:text-[22px] font-bold text-white leading-tight">
                                No Assignments yet
                            </h1>
                            {/* DESCRIPTION */}
                            <p className="mt-3 text-sm sm:text-[14px] leading-5 sm:leading-6 text-[#c5cbe0] max-w-[370px] mx-auto">
                                You don't have any assignments the movement.Take a break or explore new courses.
                            </p>
                            <Button color="primary" size="large" className='mt-4' >Explore Courses</Button>
                        </div>
                    </section>
                </div>
            </main>

        </div>
    );
}

export default EmptyStateAssignment;