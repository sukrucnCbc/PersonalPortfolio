"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Linkedin, User, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../language-context";
import { Editable } from "./pencil-edit";

export function ProfileCard() {
    const { t, language } = useLanguage();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["10deg", "-10deg"]);

    const [copied, setCopied] = useState(false);

    const profile = t("profile_card") || {
        name: "Şükrücan Cebeci",
        role: "Senior Data Analyst",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80"
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(t("social.email"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const profileFields: any[] = [
        { key: "name", label: "İsim", type: "text" },
        { key: "role", label: "Ünvan", type: "text" },
        { key: "image", label: "Profil Fotoğrafı URL", type: "image" }
    ];

    return (
        <Editable translationKey="profile_card" fields={profileFields}>
            <div className="relative group perspective-[2000px]">
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative w-full max-w-[calc(100vw-3rem)] md:w-96 rounded-[3rem] bg-zinc-900/40 p-3 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-float pointer-events-auto"
                >
                    <div
                        style={{
                            transform: "translateZ(80px)",
                            transformStyle: "preserve-3d",
                        }}
                        className="relative h-full w-full rounded-[2.8rem] bg-gradient-to-br from-white/10 via-transparent to-transparent p-10 text-center overflow-hidden"
                    >
                        {/* THE SHINE EFFECT */}
                        <motion.div
                            initial={{ x: "-150%", skewX: -20 }}
                            whileHover={{ x: "150%" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none"
                        />

                        {/* Profile Photo Area */}
                        <div className="mx-auto mb-8 h-48 w-48 overflow-hidden rounded-[2.5rem] border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-700 bg-zinc-800 relative">
                            <Image
                                src={profile.image}
                                alt="Profile"
                                fill
                                priority
                                sizes="192px"
                                className="object-cover transition-all duration-700"
                            />
                        </div>

                        {/* Name & Title */}
                        <div style={{ transform: "translateZ(50px)" }} className="mb-10">
                            <h2 className="text-3xl font-black outfit text-white tracking-tighter leading-none mb-3 uppercase">{profile.name}</h2>
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400/80">{profile.role}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ transform: "translateZ(60px)" }} className="flex flex-col gap-4">
                            <a
                                href="#about"
                                className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-blue-500 hover:text-white active:scale-95 shadow-xl"
                            >
                                <User size={16} />
                                {t("nav_whoami")}
                            </a>

                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href={t("social.linkedin")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600/20 px-2 py-4 text-[10px] font-black text-white backdrop-blur-md border border-blue-500/20 transition-all hover:bg-blue-600 hover:scale-[1.05] shadow-lg shadow-blue-500/10"
                                >
                                    <Linkedin size={14} />
                                    {language === 'tr' ? 'BAĞLANTI' : 'CONNECT'}
                                </a>
                                <button
                                    onClick={copyEmail}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-2 py-4 text-[10px] font-black text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:scale-[1.05] shadow-lg"
                                >
                                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                    {copied ? (language === 'tr' ? 'OK' : 'DONE') : (language === 'tr' ? 'E-POSTA' : 'EMAIL')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Constant Glow Reflection */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-white/10 pointer-events-none rounded-[3rem]" />
                </motion.div>
            </div>
        </Editable>
    );
}
