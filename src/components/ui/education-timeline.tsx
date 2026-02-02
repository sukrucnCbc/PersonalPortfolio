"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/components/language-context";
import { Plus, GraduationCap, Calendar, School } from "lucide-react";
import { Editable } from "@/components/ui/pencil-edit";
import { motion } from "framer-motion";

export function EducationTimeline() {
    const { t, language, addItem, removeItem, isAdmin } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const educationData = t("education_list");
    let educationRaw = Array.isArray(educationData) ? [...educationData] : [];

    const items = educationRaw.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `edu-${idx}`,
        _originalIndex: idx
    })).sort((a, b) => {
        const dateA = a.startDate || "";
        const dateB = b.startDate || "";
        return dateA.localeCompare(dateB); // Newest at the bottom
    });

    const fields: any[] = [
        { key: "school", label: "Okul / Kurum", type: "text" },
        { key: "degree", label: "Bölüm / Derece", type: "text" },
        { key: "startDate", label: "Başlangıç", type: "date" },
        { key: "endDate", label: "Bitiş (Boş = Devam)", type: "date" },
    ];

    const formatYear = (item: any) => {
        if (!item) return "";
        const start = item.startDate?.split("-")[0] || item.startDate || "";
        const end = item.endDate ? (item.endDate.split("-")[0] || item.endDate) : (language === 'tr' ? 'Günümüz' : 'Present');
        return `${start} — ${end}`;
    };

    return (
        <div lang={language} className="py-12 relative overflow-hidden bg-black" id="education">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-20">
                <div className="flex flex-col gap-4 mb-24">
                    <Editable translationKey="nav_education">
                        <span className="text-white/50 text-[10px] font-black tracking-[0.4em] uppercase">
                            {language === 'tr' ? 'AKADEMİK GEÇMİŞ' : 'ACADEMIC BACKGROUND'}
                        </span>
                    </Editable>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <Editable translationKey="education_title" className="w-auto">
                            <h2 className="text-4xl md:text-6xl font-black outfit uppercase tracking-tighter text-white leading-none">
                                {t("education_title") || (language === 'tr' ? 'Eğitim' : 'Education')}
                            </h2>
                        </Editable>

                        {isAdmin && (
                            <button
                                onClick={async () => {
                                    const newId = Date.now().toString();
                                    await addItem("education_list", { id: newId, school: "Yeni Okul", degree: "Bölüm", logo: "", startDate: "2020", endDate: "" });
                                }}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Plus size={14} />
                                {language === 'tr' ? 'EĞİTİM EKLE' : 'ADD EDUCATION'}
                            </button>
                        )}
                    </div>
                </div>

                {/* MOBILE VIEW: Vertical Timeline (Visible only on Mobile) */}
                <div className="lg:hidden relative">
                    <div className="absolute left-4 top-0 bottom-10 w-[1px] bg-white/10" />
                    <div className="absolute left-4 top-0 bottom-10 w-[1px] bg-blue-500/30" />

                    <div className="flex flex-col gap-8 relative z-10">
                        {items.map((item: any, idx: number) => (
                            <div key={item.id} className="relative pl-12">
                                <div className="absolute left-[10px] top-2 w-[13px] h-[13px] rounded-full bg-black border-2 border-blue-500/50 z-20" />
                                <Editable
                                    translationKey={`education_list.${item.id}`}
                                    fields={fields}
                                    onDelete={() => removeItem("education_list", item._originalIndex)}
                                >
                                    <div className="glass-effect p-6 rounded-[2.5rem] border border-white/10 bg-white/[0.01] relative overflow-hidden">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={10} className="text-blue-400" />
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                                    {formatYear(item)}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight">
                                                    {item.school}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">{item.degree}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Editable>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DESKTOP VIEW: Horizontal Timeline (Visible only on Desktop) */}
                <div className="hidden lg:block relative">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-10 overflow-x-auto pb-20 pt-10 px-4 custom-scrollbar snap-x no-scrollbar"
                    >
                        {items.length === 0 && !isAdmin && (
                            <div className="w-full text-center py-20 text-white/10 uppercase font-black tracking-[0.5em] text-xs">
                                {language === 'tr' ? 'EĞİTİM BİLGİSİ BULUNMUYOR' : 'NO EDUCATION INFO'}
                            </div>
                        )}

                        {items.map((item: any, idx: number) => (
                            <div key={item.id} className="min-w-[320px] md:min-w-[400px] snap-center relative">
                                <Editable
                                    translationKey={`education_list.${item.id}`}
                                    fields={fields}
                                    onDelete={() => removeItem("education_list", item._originalIndex)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative group/edu"
                                    >
                                        <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-[2px] bg-blue-500/20 z-0" />
                                        <div className="glass-effect p-8 rounded-[3rem] border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 relative overflow-hidden group-hover/edu:scale-[1.02] shadow-2xl">
                                            <div className="absolute inset-0 translate-x-[-100%] group-hover/edu:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-3 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                                                            <Calendar size={12} className="text-blue-400" />
                                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                                                {formatYear(item)}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover/edu:text-blue-400 transition-colors duration-500">
                                                            {item.school}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                                                            {language === 'tr' ? 'BÖLÜM / DERECE' : 'DEPARTMENT / DEGREE'}
                                                        </span>
                                                        <p className="text-lg font-bold text-white/70 uppercase tracking-tight leading-relaxed">
                                                            {item.degree}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-emerald-500/50 opacity-0 group-hover/edu:opacity-100 transition-opacity duration-700" />
                                        </div>
                                    </motion.div>
                                </Editable>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
