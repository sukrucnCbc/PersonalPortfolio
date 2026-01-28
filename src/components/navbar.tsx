"use client";

import { useLanguage } from "./language-context";
import { Languages, User, Briefcase, BookOpen, Mail, Home, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";

export function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const navItems = [
        { name: t("nav_welcome"), url: "#home", icon: Home },
        { name: t("nav_career"), url: "#career", icon: Briefcase },
        { name: t("nav_blog"), url: "#blog", icon: BookOpen },
        { name: t("nav_whoami"), url: "#about", icon: User },
        { name: t("nav_contact"), url: "#contact", icon: Mail },
    ];

    const languageSwitcher = (
        <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="px-4 py-2 hover:bg-white/5 rounded-full text-white transition-all duration-300 flex items-center gap-2 group"
        >
            <Languages className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
        </button>
    );

    return <NavBar items={navItems} extraContent={languageSwitcher} language={language} />;
}
