export default function Card({ children, className = "", onClick }) {
    return (
        <div
            className={`
                backdrop-blur-2xl
                rounded-[2rem] 
                border border-white/10
                shadow-2xl
                ${className}
                
            `}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
