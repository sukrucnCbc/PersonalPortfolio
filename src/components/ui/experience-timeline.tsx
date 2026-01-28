"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/components/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Calendar, Briefcase, Info, Wrench } from "lucide-react";
import { Editable } from "@/components/ui/pencil-edit";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline() {
    const { t, language, addItem, removeItem, isAdmin, anyPopupOpen } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const experiencesData = t("career_list");

    const experiences = useMemo(() => {
        let experiencesRaw = Array.isArray(experiencesData) ? [...experiencesData] : [];
        return experiencesRaw.map((exp: any, idx: number) => ({
            ...exp,
            id: exp.id || `exp-${idx}`,
            _originalIndex: idx
        })).sort((a, b) => {
            const dateA = a.startDate || "";
            const dateB = b.startDate || "";
            return dateB.localeCompare(dateA);
        });
    }, [experiencesData]);

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (!activeId && experiences.length > 0) {
            setActiveId(experiences[0].id);
        }
    }, [experiences, activeId]);

    const experienceFields: any[] = [
        { key: "company", label: "Şirket", type: "text" },
        { key: "logo", label: "Şirket Logosu", type: "image" },
        { key: "role", label: "Ünvan", type: "text" },
        { key: "startDate", label: "Başlangıç Tarihi", type: "date" },
        { key: "endDate", label: "Bitiş Tarihi (Boş bırakılabilir)", type: "date" },
        { key: "isCurrent", label: "Halen Burada Çalışıyorum", type: "boolean" },
        { key: "desc", label: "Açıklama", type: "rich-text" },
        { key: "footerInfo", label: "Alt Bilgi (İpucu)", type: "text" },
        {
            key: "fontSize",
            label: "Yazı Boyutu",
            type: "select",
            options: ["0.7rem", "0.8rem", "0.85rem", "0.9rem", "0.95rem", "1rem", "1.1rem", "1.15rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.7rem", "2.0rem"]
        },
        {
            key: "lineHeight",
            label: "Satır Aralığı",
            type: "select",
            options: ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.2", "2.5"]
        },
    ];

    const currentExperience = useMemo(() =>
        experiences.find(e => e.id === activeId) || experiences[0],
        [experiences, activeId]
    );

    // GSAP SCROLL TRIGGER DISABLED FOR POPUP STABILITY
    // useEffect(() => {
    //     if (!lineRef.current || !containerRef.current) return;

    //     ScrollTrigger.refresh();
    //     const trigger = gsap.fromTo(
    //         lineRef.current,
    //         { scaleY: 0 },
    //         {
    //             scaleY: 1,
    //             ease: "none",
    //             scrollTrigger: {
    //                 trigger: containerRef.current,
    //                 start: "top 80%",
    //                 end: "bottom 60%",
    //                 scrub: 1,
    //             },
    //         }
    //     );
    //     return () => { trigger.kill(); };
    // }, []);

    const formatYear = (exp: any) => {
        if (!exp) return "";
        if (exp.isCurrent) return `${exp.startDate} - ${language === 'tr' ? 'Günümüz' : 'Present'}`;
        return `${exp.startDate} - ${exp.endDate}`;
    };

    const normalizeDescription = (html: string) => {
        if (!html) return "";
        let cleaned = html
            .replace(/background-color:[^;]+;?/g, "")
            .replace(/color:[^;]+;?/g, "color: inherit;")
            .replace(/font-family:[^;]+;?/g, "font-family: inherit;")
            .replace(/font-size:[^;]+;?/g, "font-size: inherit;");
        cleaned = cleaned.replace(/•\s*/g, "<br/>• ");
        return cleaned;
    };

    return (
        <div lang={language} className="py-12 px-6 relative overflow-hidden bg-black">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/50 to-transparent z-[10] pointer-events-none" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[radial-gradient(circle_at_50%_0%,rgba(11,101,237,0.2)_0%,transparent_60%)] -translate-y-1/3 opacity-80" />
                <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute top-0 left-1/2 -translate-x-1/2 w-[180%] h-[300px] -translate-y-[20%]">
                    <defs>
                        <linearGradient id="expHorizon" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="30%" stopColor="rgba(59,130,246,0.2)" />
                            <stop offset="50%" stopColor="rgba(59,130,246,0.8)" />
                            <stop offset="70%" stopColor="rgba(59,130,246,0.2)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background orbit line */}
                    <path d="M 50 400 Q 500 -100 950 400" fill="none" stroke="#1a73e8" strokeWidth="1" opacity="0.15" />

                    {/* Animated primary orbit line */}
                    <motion.path
                        d="M 50 400 Q 500 -100 950 400"
                        fill="none"
                        stroke="url(#expHorizon)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />

                    {/* Blue Satellite 1 */}
                    <motion.circle
                        r="3"
                        fill="#3b82f6"
                        filter="url(#glow)"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{
                            offsetPath: "path('M 50 400 Q 500 -100 950 400')",
                            motionPath: "path('M 50 400 Q 500 -100 950 400')"
                        }}
                    />

                    {/* Blue Satellite 2 (Faster) */}
                    <motion.circle
                        r="2"
                        fill="#60a5fa"
                        filter="url(#glow)"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 5 }}
                        style={{
                            offsetPath: "path('M 50 400 Q 500 -100 950 400')",
                            motionPath: "path('M 50 400 Q 500 -100 950 400')"
                        }}
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-20" ref={containerRef}>
                <div className="flex flex-col gap-4 mb-20">
                    <Editable translationKey="nav_career">
                        <span className="text-white/50 text-[10px] font-black tracking-[0.4em] uppercase">{t("nav_career")}</span>
                    </Editable>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <Editable translationKey="career_title" className="w-auto">
                            <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter text-white">{t("career_title")}</h2>
                        </Editable>
                        {isAdmin && (
                            <button
                                onClick={async () => {
                                    const newId = Date.now().toString();
                                    await addItem("career_list", { id: newId, company: "Şirket", role: "Ünvan", logo: "", startDate: "2024", endDate: "", isCurrent: true, desc: "", fontSize: "1.15rem", lineHeight: "1.6" });
                                    setActiveId(newId);
                                }}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                            >
                                <ChevronRight size={14} />
                                {language === 'tr' ? 'DENEYİM EKLE' : 'ADD EXPERIENCE'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-20">
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-24 w-[1px] bg-white/10" />
                        <div className="absolute left-4 top-0 bottom-24 w-[1px] bg-blue-500 z-10" />
                        <div className="flex flex-col gap-12 relative z-20">
                            {experiences.map((exp: any) => (
                                <div
                                    key={exp.id}
                                    className={`relative pl-12 cursor-pointer group transition-all duration-500 ${activeId === exp.id ? "opacity-100" : "opacity-40 hover:opacity-100"} ${anyPopupOpen ? "pointer-events-none" : ""}`}
                                    onClick={() => !anyPopupOpen && setActiveId(exp.id)}
                                >
                                    <div className={`absolute left-[10px] top-1 w-[13px] h-[13px] rounded-full border-2 transition-all duration-500 z-30 ${activeId === exp.id ? "bg-blue-500 border-blue-400 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "bg-black border-white/20"}`} />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">{formatYear(exp)}</span>
                                        <h3 className="text-xl md:text-2xl font-black outfit uppercase group-hover:text-blue-400 transition-colors tracking-tighter leading-tight text-white">{exp.role}</h3>
                                        <p className="text-white/70 text-[10px] font-black uppercase tracking-wider">{exp.company}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {currentExperience && (
                            <div className="h-full transition-opacity duration-300">
                                <Editable
                                    key={currentExperience.id}
                                    translationKey={`career_list.${currentExperience.id}`}
                                    fields={experienceFields}
                                    onDelete={() => {
                                        removeItem("career_list", currentExperience._originalIndex);
                                        setActiveId(experiences[0]?.id || null);
                                    }}
                                    className="w-full h-full"
                                >
                                    <div className="glass p-10 md:p-14 rounded-[3.5rem] border border-white/10 relative overflow-hidden min-h-[500px] flex flex-col justify-center h-full group/card transition-all duration-700">
                                        {/* Aurora Spotlight Effect (Persistent & More Intense) */}
                                        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.35)_0%,rgba(255,255,255,0.15)_35%,transparent_70%)] blur-[110px] opacity-100 pointer-events-none z-0" />
                                        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-blue-400/15 blur-[90px] rounded-full mix-blend-screen opacity-100 pointer-events-none z-0" />
                                        {currentExperience.logo && (
                                            <div className="absolute top-6 right-8 md:right-10 z-30 pointer-events-none">
                                                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                                    {/* Corner Tech Accents */}
                                                    <div className="absolute -inset-3 opacity-0 group-hover/card:opacity-100 transition-all duration-700">
                                                        <div className="absolute top-0 right-0 w-4 h-[1px] bg-blue-500/50" />
                                                        <div className="absolute top-0 right-0 w-[1px] h-4 bg-blue-500/50" />

                                                        <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-blue-500/30" />
                                                        <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-blue-500/30" />
                                                    </div>

                                                    {/* Background Spotlight Glow */}
                                                    <div className="absolute inset-0 bg-blue-500/5 blur-[25px] rounded-full group-hover/card:bg-blue-500/15 transition-all duration-700" />

                                                    <img
                                                        src={currentExperience.logo}
                                                        className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl opacity-50 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700"
                                                        alt={currentExperience.company}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex flex-wrap gap-8 items-center border-b border-white/10 pb-6 opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="text-blue-400" size={16} />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{formatYear(currentExperience)}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Briefcase className="text-blue-400" size={16} />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{currentExperience.company}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h4 className="text-base md:text-4xl font-black outfit leading-none text-white tracking-tighter">{currentExperience.role}</h4>
                                                <div
                                                    className="prose prose-invert max-w-none text-white/70 font-medium"
                                                    style={{
                                                        fontSize: currentExperience.fontSize || '1.2rem',
                                                        lineHeight: currentExperience.lineHeight || '1.6'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: normalizeDescription(currentExperience.desc) }}
                                                />
                                            </div>
                                            <div className="pt-6 mt-auto">
                                                <div className="glass-effect rounded-3xl p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-700 relative overflow-hidden">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-xl bg-blue-500/5 border border-white/5 text-blue-400/50 flex-shrink-0">
                                                            <Wrench size={18} />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="block text-[9px] font-black text-blue-400/40 uppercase tracking-[0.4em]">
                                                                TECH STACK
                                                            </span>
                                                            <p className="text-[11px] md:text-xs text-white/50 leading-relaxed font-medium">
                                                                {currentExperience.footerInfo || t("career_details_footer")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Editable>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
