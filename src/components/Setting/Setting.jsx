import Card from "../Card";




function Setting() {

    return (
        <div>
            <h1>Profile & Setting</h1>
            <Card className="w-full bg-[#16161AB2] p-7 ">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="border border-white/10 bg-white/5 rounded-full p-4 shrink-0 relative">
                            <AddAPhotoOutlinedIcon sx={{ color: 'white' }} />
                            <div className="absolute right-[-2px] bottom-[-2px] bg-[#6366F1] border border-[#6366F1] rounded-full p-0.5 flex items-center justify-center">
                                <EditIcon fontSize="small" sx={{ fontSize: 12, color: 'white' }} />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-[Poppins] text-base font-bold text-white leading-tight">
                                Profile Picture
                            </h2>
                            <p className="font-[Manrope] text-[11px] text-[#64748B]">
                                Position
                            </p>
                        </div>
                    </div>

                </div>
            </Card>





        </div>
    )
}


export default Setting;