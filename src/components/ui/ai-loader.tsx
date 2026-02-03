import * as React from "react";

interface LoaderProps {
    size?: number;
    text?: string;
}

export const AILoader: React.FC<LoaderProps> = ({ size = 180, text = "Generating" }) => {
    const letters = text.split("");

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
            <div
                className="relative flex items-center justify-center font-inter select-none"
                style={{ width: size, height: size }}
            >
                <div className="flex gap-1 z-10">
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            className="inline-block text-white opacity-40 animate-loader-letter"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                <div
                    className="absolute inset-0 rounded-full animate-loader-circle"
                ></div>
            </div>
        </div>
    );
};
