
export default function Notification() {
    return (
        <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
            {/* Header Title & Tag */}
          <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20 text-start">
                <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                    Notifications
                </h1>
                <div className="self-start px-2 py-0.5 bg-[#1E1F2A] border border-white/10 rounded text-[10px] font-bold text-[#94A3B8] tracking-wider uppercase font-[Manrope]">
                    Manage Your Notifications
                </div>
            </div>

            {/* Desktop Navigation Menu (Vertical list) */}
            {/* <nav className="flex flex-col gap-2">
                {NOTIFICATIONS_SECTIONS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (onScrollTo) {
                                    onScrollTo(item.id);
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-[Poppins] transition-all duration-200 cursor-pointer whitespace-nowrap ${isActive
                                    ? 'bg-[#1D61E7] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon sx={{ fontSize: 18, color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav> */}
        </div>
    );
}