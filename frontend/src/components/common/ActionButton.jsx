const ActionButton = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
}) => {

    const baseStyle =
        "rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95";

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-5 py-3 text-base font-semibold rounded-xl",
    };

    const variants = {
        edit: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-white",

        delete: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white",

        primary: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white",

        add: "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${sizes[size]} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

export default ActionButton;