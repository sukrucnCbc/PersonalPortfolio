'use client';

import dynamic from 'next/dynamic';
import { ProfileCard } from './profile-card';
import { TypewriterEffectSmooth } from './typewriter-effect';
import { Editable } from './pencil-edit';
import { useLanguage } from '@/components/language-context';
import ShinyText from './shiny-text';

// Import the heavy background without SSR
const HeroBackground = dynamic(() => import('./hero-background'), { ssr: false });

interface HeroProps {
    title: string;
    description: string;
    badgeText?: string;
    ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
    microDetails?: Array<string>;
    language?: string;
    onProfileImageLoad?: () => void;
}

export default function PremiumHero({
    title,
    description,
    ctaButtons: propsCtaButtons = [],
    microDetails: propsMicroDetails = [],
    language,
    badgeText,
    onProfileImageLoad
}: HeroProps) {
    const { addItem, removeItem, t, isAdmin } = useLanguage();

    const ctaButtons = Array.isArray(propsCtaButtons) ? propsCtaButtons : [];
    const microDetails = Array.isArray(propsMicroDetails) ? (propsMicroDetails as any) : [];
    const hasMap = typeof microDetails.map === 'function';

    const welcomeWords = (typeof (badgeText || "") === 'string' ? (badgeText || "Selam, ben Şükrücan.") : "Selam, ben Şükrücan.")
        .split(" ")
        .map(word => ({
            text: word,
            className: "text-white/80 font-semibold font-outfit text-sm md:text-base tracking-wide"
        }));

    return (
        <div lang={language} className="relative min-h-screen w-full flex items-start justify-start overflow-hidden bg-black pt-32 pb-20 md:pt-40 font-outfit">
            <HeroBackground />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-16 pointer-events-none">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-16 pointer-events-auto">
                    <div className="flex flex-col items-start gap-0 md:gap-2 flex-1 -mt-4 lg:-mt-8 w-full">
                        {/* Welcome - Order 1 */}
                        {welcomeWords.length > 0 && (
                            <div className="order-1">
                                <Editable translationKey="hero_welcome">
                                    <TypewriterEffectSmooth words={welcomeWords} className="mb-2" cursorClassName="bg-blue-500" />
                                </Editable>
                            </div>
                        )}

                        {/* Title - Order 2 */}
                        <div className="order-2 w-full">
                            <Editable translationKey="hero_title">
                                <h1 className="max-w-3xl text-left text-3xl font-black leading-[1.1] tracking-tighter text-white sm:text-5xl md:text-6xl drop-shadow-2xl font-outfit uppercase">
                                    <ShinyText
                                        text={title}
                                        speed={1.9}
                                        color="#ffffff80"
                                        shineColor="#ffffff"
                                        className="leading-[1.1]"
                                    />
                                </h1>
                            </Editable>
                        </div>

                        {/* Mobile Profile Card - Order 3 (Visible only on mobile) */}
                        <div className="order-3 lg:hidden w-full flex justify-center mt-12 mb-8">
                            <ProfileCard onLoad={onProfileImageLoad} />
                        </div>

                        {/* Description - Order 4 */}
                        <div className="order-4 mt-6 md:mt-0">
                            <Editable translationKey="hero_description" className="w-full">
                                <p className="max-w-xl text-left text-lg font-medium leading-relaxed text-white/90 drop-shadow-lg opacity-80">
                                    {description}
                                </p>
                            </Editable>
                        </div>

                        {/* Buttons - Order 5 */}
                        <div className="order-5 flex flex-wrap items-center gap-4 pt-6">
                            {ctaButtons.map((btn, i) => (
                                <a
                                    key={i}
                                    href={btn.href}
                                    className={`rounded-full px-10 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-xl ${btn.primary
                                        ? "bg-white text-black hover:bg-gray-200"
                                        : "bg-black/40 text-white backdrop-blur-xl border border-white/20 hover:bg-black/60"
                                        }`}
                                >
                                    {btn.text ?? ""}
                                </a>
                            ))}
                        </div>

                        {/* Skills - Order 6 */}
                        <div className="order-6 mt-12 md:mt-20 w-full lg:max-w-2xl">
                            <div className="flex justify-start mb-8">
                                {isAdmin && (
                                    <button
                                        onClick={() => addItem("skills", "Yeni Yetenek")}
                                        className="px-8 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                    >
                                        + YETENEK EKLE
                                    </button>
                                )}
                            </div>
                            <ul className="flex flex-wrap gap-x-10 gap-y-6">
                                {hasMap && microDetails.map((detail: string, i: number) => (
                                    <li key={i}>
                                        <Editable
                                            translationKey={`skills.${i}`}
                                            onDelete={() => removeItem("skills", i)}
                                            className="w-auto"
                                        >
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all cursor-default group/skill">
                                                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover/skill:scale-125 transition-transform" />
                                                {detail}
                                            </div>
                                        </Editable>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Desktop Profile Card (Visible only on desktop) */}
                    <div className="hidden lg:block flex-shrink-0 lg:mt-0 mt-12 -mt-4 lg:-mt-8">
                        <ProfileCard onLoad={onProfileImageLoad} />
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
            <div className="absolute inset-x-0 bottom-0 h-24 backdrop-blur-[1px] z-[4] pointer-events-none" />
        </div>
    );
}
