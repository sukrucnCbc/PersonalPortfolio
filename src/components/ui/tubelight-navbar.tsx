"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "../language-context"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    extraContent?: React.ReactNode // For language switcher
    language?: string
}

export function NavBar({ items, className, extraContent, language }: NavBarProps) {
    const { anyPopupOpen } = useLanguage()
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMobile, setIsMobile] = useState(false)

    // Sync activeTab when items change (e.g., language switch)
    useEffect(() => {
        const currentItem = items.find(item => {
            // This is a bit tricky, we might want to track by URL instead of name
            // but for now let's try to find the item that matches the URL of the previous active tab
            return items.some(prev => prev.name === activeTab && prev.url === item.url);
        });
        if (currentItem) {
            setActiveTab(currentItem.name);
        } else {
            // Fallback to first item if no match
            // setActiveTab(items[0].name); 
        }
    }, [items]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        // High-Performance Scroll Spy using IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Detects section when it's in the top-middle areas
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const activeItem = items.find(item => item.url === `#${entry.target.id}`);
                    if (activeItem) {
                        setActiveTab(activeItem.name);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sectionIds = items.map(item => item.url.replace("#", ""));
        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            observer.disconnect();
        }
    }, [items])

    return (
        <AnimatePresence>
            {!anyPopupOpen && (
                <motion.div
                    lang={language}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className={cn(
                        "fixed top-0 left-1/2 -translate-x-1/2 z-40 pt-8 w-fit shrink-0",
                        className,
                    )}
                >
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] backdrop-blur-[24px] py-2 px-2 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
                        {items.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.name

                            return (
                                <Link
                                    key={item.name}
                                    href={item.url}
                                    onClick={(e) => {
                                        setActiveTab(item.name);
                                        if (item.url === "#home") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    className={cn(
                                        "relative cursor-pointer text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase px-4 md:px-5 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center min-w-[60px] md:min-w-[100px]",
                                        "text-white/50 hover:text-white",
                                        isActive && "text-white",
                                    )}
                                >
                                    <span className="hidden md:inline whitespace-nowrap text-center w-full">{item.name}</span>
                                    <span className="md:hidden flex items-center justify-center">
                                        <Icon size={18} strokeWidth={2.5} />
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="lamp"
                                            className="absolute inset-0 w-full bg-white/[0.05] rounded-full -z-10"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        >
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                                <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                                                <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                                                <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                                            </div>
                                        </motion.div>
                                    )}
                                </Link>
                            )
                        })}

                        {extraContent && (
                            <div className="ml-2 pl-2 border-l border-white/10">
                                {extraContent}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
