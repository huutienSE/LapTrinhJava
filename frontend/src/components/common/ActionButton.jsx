const ActionButton = ({
    children,
    onClick,
    variant = "primary",
}) => {

    const baseStyle =
        "px-3 py-1 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95";

    const variants = {
        edit: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-white",

        delete: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white",

        primary: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

export default ActionButton;