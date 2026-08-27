import Button from '../../components/Button'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function AssignmentSubmitted() {
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
                                <div className="w-[56px] h-[56px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#7378ad] flex items-center justify-center">
                                    <AssignmentTurnedInIcon
                                        sx={{
                                            fontSize: {
                                                xs: 30,
                                                sm: 32,
                                            },
                                            color: "#c9c9ff",
                                        }}
                                    />
                                </div>
                            </div>
                            {/* TITLE */}
                            <h1 className="text-xl sm:text-[21px] md:text-[22px] font-bold text-white leading-tight">
                                Assignments Submitted
                            </h1>
                            {/* DESCRIPTION */}
                            <p className="mt-3 text-sm sm:text-[14px] leading-5 sm:leading-6 text-[#c5cbe0] max-w-[370px] mx-auto">
                                Your assignment has been successfully submitted for review by your instructor.
                            </p>

                            <div className="w-[273px] rounded-md border border-[#2d3a50] bg-[#202b3f] px-3">
                                <div className="flex items-center justify-between border-b border-[#2d3a50] py-2">
                                    <span className="text-[12px] text-[#9ca6b8]">
                                        Assignment:
                                    </span>

                                    <span className="text-[12px] text-[#d6dbe5]">
                                        Build a REST API
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <span className="text-[12px] text-[#9ca6b8]">
                                        Submitted:
                                    </span>

                                    <span className="text-[12px] text-[#d6dbe5]">
                                        Oct 26, 11:45 PM
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 flex-col ">
                                <Button color="primary" >View Submission</Button>
                                <Button color="secondary" variant='outline' className='text-white' >Back to Assignment</Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

        </div>
    );
}

export default AssignmentSubmitted;