"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RubiksCube({ size = "large" }: { size?: "large" | "small" }) {
    const isLarge = size === "large";
    const cubeSize = isLarge ? 240 : 80;
    const faceOffset = cubeSize / 2;

    const [solving, setSolving] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setSolving(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const faces = [
        { color: "rgba(59, 130, 246, 0.15)", transform: `translateZ(${faceOffset}px)`, label: "front" },
        { color: "rgba(255, 255, 255, 0.05)", transform: `rotateY(180deg) translateZ(${faceOffset}px)`, label: "back" },
        { color: "rgba(37, 99, 235, 0.15)", transform: `rotateY(90deg) translateZ(${faceOffset}px)`, label: "right" },
        { color: "rgba(255, 255, 255, 0.1)", transform: `rotateY(-90deg) translateZ(${faceOffset}px)`, label: "left" },
        { color: "rgba(96, 165, 250, 0.15)", transform: `rotateX(90deg) translateZ(${faceOffset}px)`, label: "top" },
        { color: "rgba(0, 0, 0, 0.3)", transform: `rotateX(-90deg) translateZ(${faceOffset}px)`, label: "bottom" },
    ];

    return (
        <div
            className={`relative ${isLarge ? 'w-64 h-64' : 'w-20 h-20'} [transform-style:preserve-3d] [perspective:1200px] group`}
            style={{ width: cubeSize, height: cubeSize }}
        >
            {isLarge && (
                <>
                    <motion.div
                        animate={{ rotateZ: 360, rotateX: 60 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-[-25%] inset-y-[-25%] border border-blue-500/10 rounded-full [transform-style:preserve-3d]"
                    />
                    <motion.div
                        animate={{ rotateZ: -360, rotateY: 70 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-[-35%] inset-y-[-35%] border border-white/5 rounded-full [transform-style:preserve-3d]"
                    />
                </>
            )}

            <motion.div
                animate={{
                    rotateX: solving ? [0, 90, 180, 270, 360] : [360, 270, 180, 90, 0],
                    rotateY: solving ? [0, -90, -180, -270, -360] : [-360, -270, -180, -90, 0],
                    scale: solving ? [1, 0.9, 1.1, 1] : [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: isLarge ? 20 : 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative w-full h-full [transform-style:preserve-3d]"
            >
                {faces.map((face, idx) => (
                    <div
                        key={idx}
                        style={{
                            transform: face.transform,
                            backgroundColor: face.color,
                            width: cubeSize,
                            height: cubeSize
                        }}
                        className={`absolute inset-0 border border-white/10 backdrop-blur-xl flex items-center justify-center ${isLarge ? 'p-4' : 'p-1'}`}
                    >
                        <div className={`grid ${isLarge ? 'grid-cols-4' : 'grid-cols-2'} gap-1 w-full h-full`}>
                            {[...Array(isLarge ? 16 : 4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        rotateX: solving ? [0, 90, 180, 0] : [0, -90, -180, 0],
                                        rotateY: solving ? [0, 180, 360, 0] : [0, -180, -360, 0],
                                        rotateZ: solving ? [0, 45, 0] : 0,
                                        scale: solving ? [1, 1.1, 0.9, 1] : 1,
                                        backgroundColor: i % 3 === 0 ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.08)"
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeInOut"
                                    }}
                                    className="rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                />
                            ))}
                        </div>

                        {isLarge && idx % 2 === 0 && (
                            <motion.div
                                animate={{ y: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent pointer-events-none"
                            />
                        )}
                    </div>
                ))}
            </motion.div>

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isLarge ? 'w-[200%] h-[200%] blur-[100px]' : 'w-[150%] h-[150%] blur-[40px]'} bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] -z-10 pointer-events-none`} />
        </div>
    );
}
