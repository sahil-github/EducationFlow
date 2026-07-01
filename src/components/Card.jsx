export default function Card({ children, className = "" }) {
    return (
        <div
            className={`
                backdrop-blur-2xl
                rounded-[2rem] p-5
                border border-white/10
                shadow-2xl
                ${className}
            `}
            style={{ backgroundColor: 'rgba(18, 18, 24, 0.80)' }}
        >
            {children}
        </div>
    );
}
