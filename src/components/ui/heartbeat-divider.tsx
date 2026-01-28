"use client";

import React from "react";
import { motion } from "framer-motion";

export const HeartbeatDivider = () => {
    return (
        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden pointer-events-none my-12">
            {/* Background Base Line */}
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Siri-style Wave Container */}
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {/* Each wave is a layer of the Siri-like animation */}
                {[
                    { color: "rgba(59, 130, 246, 0.4)", scale: 1, duration: 3, delay: 0 },
                    { color: "rgba(16, 185, 129, 0.3)", scale: 0.8, duration: 4, delay: 0.5 },
                    { color: "rgba(96, 165, 250, 0.2)", scale: 1.2, duration: 5, delay: 1 },
                    { color: "rgba(255, 255, 255, 0.1)", scale: 0.6, duration: 6, delay: 1.5 }
                ].map((wave, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scaleY: [1, 1.5, 0.8, 1.2, 1],
                            scaleX: [1, 1.05, 0.95, 1]
                        }}
                        transition={{
                            duration: wave.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: wave.delay
                        }}
                        className="absolute w-full h-12 rounded-[100%] blur-2xl mix-blend-screen"
                        style={{
                            backgroundColor: wave.color,
                            transform: `scale(${wave.scale})`,
                        }}
                    />
                ))}

                {/* The Core Vibrant Line */}
                <svg
                    viewBox="0 0 1000 100"
                    className="w-full h-full relative z-10"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="20%" stopColor="rgba(59, 130, 246, 0.2)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
                            <stop offset="80%" stopColor="rgba(59, 130, 246, 0.2)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Animated Wave Path - Statik Ama Canlı Dalgalanma */}
                    <motion.path
                        animate={{
                            d: [
                                "M 0 50 Q 250 20 500 50 T 1000 50",
                                "M 0 50 Q 250 80 500 50 T 1000 50",
                                "M 0 50 Q 250 20 500 50 T 1000 50"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        fill="none"
                        stroke="url(#waveGradient)"
                        strokeWidth="2"
                        style={{ filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))" }}
                    />

                    {/* Complementary Subtle Wave */}
                    <motion.path
                        animate={{
                            d: [
                                "M 0 50 Q 250 80 500 50 T 1000 50",
                                "M 0 50 Q 250 20 500 50 T 1000 50",
                                "M 0 50 Q 250 80 500 50 T 1000 50"
                            ]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.2)"
                        strokeWidth="1"
                    />
                </svg>
            </div>
        </div>
    );
};
