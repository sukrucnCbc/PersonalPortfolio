'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ProfileCard } from './profile-card';
import { TypewriterEffectSmooth } from './typewriter-effect';
import { Editable } from './pencil-edit';
import { useLanguage } from '@/components/language-context';
import ShinyText from './shiny-text';

// ===================== SHADER =====================
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= iResolution.x / iResolution.y;

    float t = iTime * 0.2;
    
    vec3 color = vec3(0.0);
    for(float i = 1.0; i < 4.0; i++){
        uv.x += 0.6 / i * sin(i * 3.0 * uv.y + t);
        uv.y += 0.6 / i * cos(i * 3.0 * uv.x + t);
        color += 0.1 / length(uv) * vec3(
            sin(t + i), 
            cos(t + i * 2.0), 
            sin(t + i * 3.0)
        );
    }
    color *= 1.5;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlowMaterial = shaderMaterial(
    { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
    vertexShader,
    fragmentShader
);

extend({ FlowMaterial });

function ShaderPlane() {
    const materialRef = useRef<any>(null!);
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.iTime = state.clock.elapsedTime;
            materialRef.current.iResolution.set(state.size.width, state.size.height);
        }
    });
    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <flowMaterial ref={materialRef} />
        </mesh>
    );
}

// ===================== HERO =====================
interface HeroProps {
    title: string;
    description: string;
    badgeText?: string;
    ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
    microDetails?: Array<string>;
    language?: string;
}

export default function PremiumHero({
    title,
    description,
    ctaButtons: propsCtaButtons = [],
    microDetails: propsMicroDetails = [],
    language,
    badgeText
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
        <div lang={language} className="relative min-h-screen w-full flex items-start justify-start overflow-hidden bg-black pt-20 pb-20 md:pt-32 font-outfit">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <ShaderPlane />
                </Canvas>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-16 pointer-events-none">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-16 pointer-events-auto">
                    <div className="flex flex-col items-start gap-2 flex-1 -mt-4 lg:-mt-8">
                        <Editable translationKey="hero_welcome">
                            <TypewriterEffectSmooth words={welcomeWords} className="mb-2" cursorClassName="bg-blue-500" />
                        </Editable>

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

                        <Editable translationKey="hero_description" className="w-full">
                            <p className="max-w-xl text-left text-lg font-medium leading-relaxed text-white/90 drop-shadow-lg opacity-80">
                                {description}
                            </p>
                        </Editable>

                        <div className="flex flex-wrap items-center gap-4 pt-6">
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

                        <div className="mt-20 w-full lg:max-w-2xl">
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

                    <div className="flex-shrink-0 lg:mt-0 mt-12 -mt-4 lg:-mt-8">
                        <ProfileCard />
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
            <div className="absolute inset-x-0 bottom-0 h-24 backdrop-blur-[1px] z-[4] pointer-events-none" />
        </div>
    );
}

declare module '@react-three/fiber' {
    interface ThreeElements {
        flowMaterial: any;
    }
}
