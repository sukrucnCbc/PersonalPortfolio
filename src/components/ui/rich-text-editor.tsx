"use client";

import React, { useRef, useEffect, useState } from "react";
import {
    Bold, Italic, Underline, List, ListOrdered, Type, Link as LinkIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette, Highlighter,
    Code, Eraser, Image as ImageIcon, ChevronDown
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeStyles, setActiveStyles] = useState<string[]>([]);

    // Sync external value with editor
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const execCommand = (command: string, val: string | undefined = undefined) => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStyles();
    };

    const updateActiveStyles = () => {
        const styles = [];
        if (document.queryCommandState("bold")) styles.push("bold");
        if (document.queryCommandState("italic")) styles.push("italic");
        if (document.queryCommandState("underline")) styles.push("underline");
        setActiveStyles(styles);
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const addLink = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = prompt("Link URL'si giriniz:");
        if (url) execCommand("createLink", url);
    };

    const addImage = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = prompt("Görsel URL'si giriniz:");
        if (url) execCommand("insertImage", url);
    };

    const handleColor = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreColor' | 'hiliteColor') => {
        execCommand(type, e.target.value);
    };

    return (
        <div className="flex flex-col w-full border border-white/10 rounded-2xl overflow-hidden bg-zinc-950/50 shadow-2xl backdrop-blur-md">
            {/* TOOLBAR */}
            <div className="flex flex-wrap items-center gap-1 p-3 bg-zinc-900/95 border-b border-white/10 overflow-x-auto no-scrollbar">

                {/* Text Style Dropdown */}
                <div className="relative group/tool">
                    <select
                        onChange={(e) => execCommand("formatBlock", e.target.value)}
                        className="appearance-none bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white outline-none hover:bg-zinc-700 transition-all cursor-pointer pr-10 shadow-lg"
                    >
                        <option value="P" className="bg-zinc-900 text-white">Normal</option>
                        <option value="H1" className="bg-zinc-900 text-white">Başlık 1</option>
                        <option value="H2" className="bg-zinc-900 text-white">Başlık 2</option>
                        <option value="H3" className="bg-zinc-900 text-white">Başlık 3</option>
                        <option value="BLOCKQUOTE" className="bg-zinc-900 text-white">Alıntı</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                </div>

                {/* Font Dropdown */}
                <div className="relative group/tool">
                    <select
                        onChange={(e) => execCommand("fontName", e.target.value)}
                        className="appearance-none bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white outline-none hover:bg-zinc-700 transition-all cursor-pointer pr-10 min-w-[120px] shadow-lg"
                    >
                        <option value="Inter, sans-serif" className="bg-zinc-900 text-white">Sans Serif</option>
                        <option value="Georgia, serif" className="bg-zinc-900 text-white">Serif</option>
                        <option value="monospace" className="bg-zinc-900 text-white">Monospace</option>
                        <option value="Outfit, sans-serif" className="bg-zinc-900 text-white">Outfit</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Formatting Trio */}
                <ToolbarButton
                    active={activeStyles.includes("bold")}
                    onClick={() => execCommand("bold")}
                    icon={<Bold size={16} />}
                    title="Kalın"
                />
                <ToolbarButton
                    active={activeStyles.includes("italic")}
                    onClick={() => execCommand("italic")}
                    icon={<Italic size={16} />}
                    title="İtalik"
                />
                <ToolbarButton
                    active={activeStyles.includes("underline")}
                    onClick={() => execCommand("underline")}
                    icon={<Underline size={16} />}
                    title="Altı Çizili"
                />

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Colors */}
                <div className="relative group/tool">
                    <ToolbarButton icon={<Palette size={16} />} title="Yazı Rengi" />
                    <input
                        type="color"
                        onChange={(e) => handleColor(e, 'foreColor')}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
                <div className="relative group/tool">
                    <ToolbarButton icon={<Highlighter size={16} />} title="Vurgu Rengi" />
                    <input
                        type="color"
                        onChange={(e) => handleColor(e, 'hiliteColor')}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Lists */}
                <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={<List size={16} />} title="Maddeli Liste" />
                <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={<ListOrdered size={16} />} title="Numaralı Liste" />

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Alignment */}
                <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={<AlignLeft size={16} />} title="Sola Yasla" />
                <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={<AlignCenter size={16} />} title="Ortala" />
                <ToolbarButton onClick={() => execCommand("justifyRight")} icon={<AlignRight size={16} />} title="Sağa Yasla" />

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Media & Link */}
                <ToolbarButton onClick={addLink} icon={<LinkIcon size={16} />} title="Bağlantı Ekle" />
                <ToolbarButton onClick={addImage} icon={<ImageIcon size={16} />} title="Görsel Ekle" />
                <ToolbarButton onClick={() => execCommand("formatBlock", "PRE")} icon={<Code size={16} />} title="Kod Bloğu" />

                <div className="flex-1" />

                {/* Clear All */}
                <ToolbarButton onClick={() => execCommand("removeFormat")} icon={<Eraser size={16} />} title="Formatı Temizle" className="hover:text-red-400" />
            </div>

            {/* EDITOR AREA */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onMouseUp={updateActiveStyles}
                onKeyUp={updateActiveStyles}
                className="w-full min-h-[350px] p-10 text-white focus:outline-none overflow-y-auto prose prose-invert prose-blue max-w-none font-medium selection:bg-blue-500/30 editor-content-area"
                style={{
                    lineHeight: '1.8',
                    caretColor: '#3b82f6'
                }}
            />

            <style jsx>{`
                .editor-content-area :global(*) {
                    color: white !important;
                }
                .editor-content-area :global(span) {
                    background-color: transparent !important;
                    color: white !important;
                }
                .editor-content-area :global(a) {
                    color: #3b82f6 !important;
                    text-decoration: underline !important;
                }
            `}</style>

            {/* Footer Status */}
            <div className="px-5 py-3 bg-zinc-900 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Zengin Metin Editörü
                </div>
                <span>Premium Editor v2.0</span>
            </div>
        </div>
    );
}

function ToolbarButton({
    onClick,
    icon,
    title,
    active = false,
    className = ""
}: {
    onClick?: (e: any) => void;
    icon: React.ReactNode;
    title: string;
    active?: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }
            }}
            title={title}
            className={`
                p-2 rounded-lg transition-all 
                ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
                ${className}
            `}
        >
            {icon}
        </button>
    );
}
