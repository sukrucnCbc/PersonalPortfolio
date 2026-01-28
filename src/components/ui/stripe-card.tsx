"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface StripeCardProps {
    title: string;
    description: string;
    image: string;
    categoryName?: string;
    categoryColor?: string;
    linkText: string;
    href?: string;
    language?: string;
    onClick?: () => void;
}

export function StripeCard({
    title,
    description,
    image,
    categoryName,
    categoryColor = "#4393fc",
    linkText,
    href,
    language,
    onClick
}: StripeCardProps) {
    const Component = onClick ? 'button' : 'a';
    return (
        <div
            lang={language}
            className='w-full h-[620px] group mx-auto dark:bg-[#111111] p-3 bg-white dark:border border-white/5 overflow-hidden rounded-[2.5rem] dark:text-white text-black shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col'
        >
            <figure className='w-full h-64 group-hover:h-60 transition-all duration-300 dark:bg-[#0a0a0a] bg-[#f0f5fa] p-4 rounded-[2rem] relative overflow-hidden flex-shrink-0'>
                <div
                    style={{
                        background:
                            `linear-gradient(123.9deg, ${categoryColor} 20%, rgba(0, 0, 0, 0) 80%)`,
                    }}
                    className='absolute top-0 left-0 w-full h-full group-hover:opacity-40 opacity-0 transition-all duration-300 z-10'
                ></div>
                <div className='relative w-full h-full'>
                    <img
                        src={image}
                        alt={title}
                        className='absolute -bottom-2 group-hover:-bottom-6 right-0 h-48 w-[90%] group-hover:border-4 border-2 border-white/10 group-hover:border-white/20 rounded-2xl object-cover transition-all duration-500 shadow-2xl z-20'
                    />
                </div>
            </figure>
            <article className='px-6 py-8 space-y-4 flex-1 flex flex-col min-h-0'>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div
                        className='h-2.5 w-2.5 rounded-full'
                        style={{ backgroundColor: categoryColor, boxShadow: `0 0 15px ${categoryColor}` }}
                    ></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">{categoryName || 'PROJE'}</span>
                </div>
                <h1 className='text-xl md:text-2xl font-black outfit uppercase tracking-tighter leading-[1.1] line-clamp-2 flex-shrink-0'>
                    {title}
                </h1>
                <p className='text-sm leading-relaxed text-white/60 line-clamp-3 font-medium overflow-hidden'>
                    {description}
                </p>
                <div className="mt-auto pt-6 flex-shrink-0">
                    <Component
                        href={href}
                        onClick={onClick}
                        className='text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-white group-hover:opacity-100 opacity-80 translate-y-0 flex items-center gap-3 transition-all duration-300 text-left'
                    >
                        {linkText}
                        <div className="p-1.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500 text-blue-400 group-hover:text-white transition-all">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </Component>
                </div>
            </article>
        </div>
    );
}
