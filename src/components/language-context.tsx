"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
    tr: {
        nav_welcome: "Hoşgeldin",
        nav_career: "Kariyer",
        nav_blog: "Blog",
        nav_projects: "Projeler",
        nav_whoami: "Ben Kimim?",
        nav_contact: "İletişim",
        career_title: "Mesleki Yolculuğum",
        career_list: [],
        career_details_footer: "Bu görev süresince stratejik kararları veri odaklı bir yaklaşımla destekledim.",
        hero_welcome: "Selam, ben Şükrücan.",
        hero_title: "Verinin Dilini Konuşuyor, Geleceği Analiz Ediyorum.",
        hero_description: "Araştırmacı, sorgulayıcı ve çözüm odaklı bir veri analisti.",
        skills: ["SQL & Python", "Artificial Intelligence & LLM Agents", "İstatistiksel Modelleme", "CRM & Veri Analitiği"],
        blog_title: "Blog Yazılarım",
        blog_link: "Detayları Gör",
        blog_list: [],
        projects_awards_title: "Projeler ve Ödüller",
        projects_awards_content: "<ul><li>Önemli Proje 1</li><li>Başarı / Ödül 1</li></ul>",
        social: {
            linkedin: "",
            github: "",
            email: ""
        },
        about_badge: "HAKKIMDA",
        about_title: "Veriye Duyulan Merak, Analizle Gelen Çözüm",
        about_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80",
        about_text: "Yüksek doğruluk odaklı bir Veri Analisti olarak, karmaşık süreçleri daha hassas ve işlevsel hale getiren veri odaklı çözümler geliştiriyorum.",
        contact_title: "Verilerinizi birlikte inceleyelim.",
        contact_subtitle: "Bir projeniz mi var? Bir kahve eşliğinde analiz yapmaya ne dersiniz?",
        contact_btn: "Analize Başlayalım",
        footer_title_line1: "Geleceği Birlikte",
        footer_title_line2: "Hayal Edelim.",
        footer_desc: "Veri analizinden stratejik danışmanlığa kadar her adımda yanınızdayım.",
        footer_joke: "Buradaki tüm analizler, %95 güven aralığında titizlikle hazırlanmıştır. 😉",
        what_i_do: [
            { title: "VERİ GÖRSELLEŞTİRME", description: "Karmaşık tabloları herkesin anlayabileceği interaktif dashboard'lara dönüştürüyorum." },
            { title: "İSTATİSTİKSEL ANALİZ", description: "Hipotez testleri ve modellemelerle belirsizliği azaltıyorum." },
            { title: "STRATEJİK DANIŞMANLIK", description: "Veriye dayalı önerilerle karar vericilere yol gösteriyorum." }
        ],
        toolbox: [
            { name: "SQL" }, { name: "PYTHON" }, { name: "TABLEAU" }, { name: "POWER BI" }, { name: "EXCEL" }, { name: "İSTATİSTİK" }, { name: "MAKİNE ÖĞRENMESİ" }, { name: "YAPAY ZEKA" }, { name: "BIGQUERY" }, { name: "LOOKER" }, { name: "CRM ANALİTİĞİ" }
        ]
    },
    en: {
        nav_welcome: "Welcome",
        nav_career: "Career",
        nav_blog: "Blog",
        nav_projects: "Projects",
        nav_whoami: "Who am I?",
        nav_contact: "Contact",
        career_title: "Professional Journey",
        career_list: [],
        career_details_footer: "During this tenure, I supported strategic decisions with a data-driven approach.",
        hero_welcome: "Hi, I'm Şükrücan.",
        hero_title: "Speaking the Language of Data, Analyzing the Future.",
        hero_description: "An investigative, curious and solution-driven data analyst.",
        skills: ["SQL & Python", "Artificial Intelligence & LLM Agents", "Statistical Modeling", "CRM & Data Analytics"],
        blog_title: "My Blog Posts",
        blog_link: "View Details",
        blog_list: [],
        projects_awards_title: "Projects & Awards",
        projects_awards_content: "<ul><li>Major Project 1</li><li>Achievement / Award 1</li></ul>",
        social: {
            linkedin: "",
            github: "",
            email: ""
        },
        about_badge: "ABOUT ME",
        about_title: "Curiosity for Data, Solution through Analysis",
        about_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80",
        about_text: "As a high-accuracy Data Analyst, I develop data-driven solutions that make complex processes more precise and functional.",
        contact_title: "Let's examine your data together.",
        contact_subtitle: "Have a project? How about an analysis over a cup of coffee?",
        contact_btn: "Start Analysis",
        footer_title_line1: "Imagine the Future",
        footer_title_line2: "Together.",
        footer_desc: "I am with you every step of the way, from data analysis to strategic consultancy.",
        footer_joke: "All analyses here have been meticulously prepared within a 95% confidence interval. 😉",
        what_i_do: [
            { title: "DATA VISUALIZATION", description: "Transforming complex tables into interactive dashboards anyone can understand." },
            { title: "STATISTICAL ANALYSIS", description: "Reducing uncertainty through hypothesis testing and modeling." },
            { title: "STRATEGIC CONSULTANCY", description: "Guiding decision-makers with data-driven recommendations." }
        ],
        toolbox: [
            { name: "SQL" }, { name: "PYTHON" }, { name: "TABLEAU" }, { name: "POWER BI" }, { name: "EXCEL" }, { name: "STATISTICS" }, { name: "MACHINE LEARNING" }, { name: "ARTIFICIAL INTELLIGENCE" }, { name: "BIGQUERY" }, { name: "LOOKER" }, { name: "CRM ANALYTICS" }
        ]
    }
};

type Language = "tr" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
    isAdmin: boolean;
    setIsAdmin: (val: boolean) => void;
    updateContent: (key: string, value: any) => Promise<void>;
    addItem: (arrayKey: string, item: any) => Promise<void>;
    removeItem: (arrayKey: string, index: number) => Promise<void>;
    anyPopupOpen: boolean;
    setAnyPopupOpen: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("tr");
    const [content, setContent] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [anyPopupOpen, setAnyPopupOpen] = useState(false);
    const contentRef = React.useRef<any>(null);
    const isSaving = React.useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem("language") as Language;
        if (saved) setLanguage(saved);

        const savedAdmin = localStorage.getItem("is_admin") === "true";
        if (savedAdmin) setIsAdmin(true);

        // Fetch dynamic content
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                setContent(data);
                contentRef.current = data;
            })
            .catch(err => console.error("Failed to fetch content:", err));
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const handleSetIsAdmin = (val: boolean) => {
        setIsAdmin(val);
        localStorage.setItem("is_admin", val ? "true" : "false");
    }

    const saveToServer = async (newContent: any) => {
        isSaving.current = true;
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123'
                },
                body: JSON.stringify(newContent)
            });

            if (res.ok) {
                // Success
            } else {
                console.error("Save failed");
            }
        } catch (err) {
            console.error("Network error during save", err);
        } finally {
            isSaving.current = false;
        }
    };

    const updateContent = async (key: string, value: any) => {
        if (!contentRef.current) return;

        const newContent = JSON.parse(JSON.stringify(contentRef.current));
        const keys = key.split(".");
        let obj = newContent[language];

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];

            if (obj[k] && Array.isArray(obj[k])) {
                const nextKey = keys[i + 1];

                if (i === keys.length - 2) {
                    const itemIdx = obj[k].findIndex((it: any) => it && String(it.id) === nextKey);
                    if (itemIdx !== -1) {
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            obj[k][itemIdx] = { ...obj[k][itemIdx], ...value };
                        } else {
                            obj[k][itemIdx] = value;
                        }
                    } else {
                        const idx = parseInt(nextKey, 10);
                        if (!isNaN(idx)) {
                            obj[k][idx] = value;
                        } else {
                            (obj[k] as any)[nextKey] = value;
                        }
                    }
                    contentRef.current = newContent;
                    setContent(newContent);
                    await saveToServer(newContent);
                    return;
                }

                const item = obj[k].find((it: any) => it && String(it.id) === nextKey);
                if (item) {
                    obj = item;
                    i++;
                    continue;
                }
                const idx = parseInt(nextKey, 10);
                if (!isNaN(idx) && obj[k][idx] !== undefined) {
                    obj = obj[k][idx];
                    i++;
                    continue;
                }
            }

            if (!obj[k]) obj[k] = {};
            obj = obj[k];
        }

        const finalKey = keys[keys.length - 1];
        obj[finalKey] = value;

        contentRef.current = newContent;
        setContent(newContent);
        await saveToServer(newContent);
    };

    const addItem = async (arrayKey: string, item: any) => {
        if (!contentRef.current) return;

        const newContent = JSON.parse(JSON.stringify(contentRef.current));
        const keys = arrayKey.split(".");
        let obj = newContent[language];
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        if (!Array.isArray(obj[keys[keys.length - 1]])) {
            obj[keys[keys.length - 1]] = [];
        }

        const itemToAdd = (typeof item === 'object' && item !== null)
            ? { ...item, id: item.id || Date.now().toString() }
            : item;

        obj[keys[keys.length - 1]].push(itemToAdd);

        // Optimistic update
        contentRef.current = newContent;
        setContent(newContent);

        await saveToServer(newContent);
    };

    const removeItem = async (arrayKey: string, index: number) => {
        if (!contentRef.current) return;

        const newContent = JSON.parse(JSON.stringify(contentRef.current));
        const keys = arrayKey.split(".");
        let obj = newContent[language];
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        if (Array.isArray(obj[keys[keys.length - 1]])) {
            obj[keys[keys.length - 1]].splice(index, 1);
        }

        // Optimistic update
        contentRef.current = newContent;
        setContent(newContent);

        await saveToServer(newContent);
    };

    // Optimized translation with simple memoization
    const t = React.useCallback((key: string) => {
        const keys = key.split(".");

        if (content && content[language]) {
            let result: any = content[language];
            let found = true;
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (result === null || result === undefined || typeof result !== 'object') {
                    found = false;
                    break;
                }

                // Handle Array ID lookups
                if (Array.isArray(result)) {
                    const item = result.find((it: any) => it && String(it.id) === k);
                    if (item) {
                        result = item;
                        continue;
                    }
                    const idx = parseInt(k, 10);
                    if (!isNaN(idx) && result[idx] !== undefined) {
                        result = result[idx];
                        continue;
                    }
                    found = false;
                    break;
                }

                if (result[k] === undefined) {
                    found = false;
                    break;
                }
                result = result[k];
            }
            if (found) return result;
        }

        // 2. Fallback to static translations
        let staticResult: any = (translations as any)[language];
        for (const k of keys) {
            if (!staticResult || staticResult[k] === undefined) {
                return key;
            }
            staticResult = staticResult[k];
        }
        return staticResult;
    }, [language, content]);

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: handleSetLanguage,
            t,
            isAdmin,
            setIsAdmin: handleSetIsAdmin,
            anyPopupOpen,
            setAnyPopupOpen,
            addItem,
            removeItem,
            updateContent
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}
