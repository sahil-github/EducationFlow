const Button = ({ children, variant = "primary", className = "", disabled = false, type = "button", onClick }) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-lg shadow-[#6366F1]/20",
        outline: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
        ghost: "text-white hover:bg-white/10",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${variants[variant] ?? ""} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
