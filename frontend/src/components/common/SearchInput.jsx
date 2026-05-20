import { useEffect, useRef, useState } from "react";

/**
 * SearchInput — ô tìm kiếm có debounce sẵn.
 *
 * Props:
 *  - placeholder : string   — placeholder text
 *  - onSearch    : (value: string) => void — callback sau khi debounce
 *  - delay       : number   — debounce delay (ms), mặc định 500
 *  - isSearching : boolean  — hiện indicator khi đang gọi API
 *  - className   : string   — class bổ sung cho wrapper
 */
const SearchInput = ({
    placeholder = "Search...",
    onSearch,
    delay = 500,
    isSearching = false,
    className = "",
}) => {
    const [inputValue, setInputValue] = useState("");
    const timer = useRef(null);

    useEffect(() => {
        // Cleanup timer khi component unmount
        return () => { if (timer.current) clearTimeout(timer.current); };
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            onSearch?.(value.trim());
        }, delay);
    };

    const handleClear = () => {
        setInputValue("");
        if (timer.current) clearTimeout(timer.current);
        onSearch?.("");
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                </svg>
            </span>

            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="
                    w-full pl-9 pr-8 py-3
                    rounded-xl
                    bg-zinc-800
                    border border-zinc-700
                    text-white text-sm
                    placeholder-zinc-500
                    focus:outline-none focus:border-indigo-500
                    transition-colors
                "
            />

            {/* Clear button — hiện khi có text */}
            {inputValue && !isSearching && (
                <button
                    onClick={handleClear}
                    className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-zinc-500 hover:text-zinc-300
                        transition-colors
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            {/* Searching spinner */}
            {isSearching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                        className="h-4 w-4 animate-spin text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                </span>
            )}
        </div>
    );
};

export default SearchInput;
