"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function FlashlightEffect() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-30 opacity-60"
            style={{
                background: `radial-gradient(600px circle at var(--x) var(--y), rgba(59, 130, 246, 0.15), transparent 80%)`,
                // @ts-ignore
                "--x": springX,
                // @ts-ignore
                "--y": springY,
            }}
        />
    );
}

export function StageLight() {
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none z-0">
            <div className="absolute top-[-500px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full opacity-50" />
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full" />
        </div>
    );
}
