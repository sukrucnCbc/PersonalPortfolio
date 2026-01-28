"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/language-context";
import { Pencil, Plus, Trash2, X, Link as LinkIcon } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { Calendar } from 'primereact/calendar';
import { ChevronDown } from "lucide-react";

interface EditableProps {
    translationKey: string;
    children: React.ReactNode;
    className?: string;
    type?: "text" | "link" | "image" | "rich-text" | "boolean";
    fields?: Array<{
        key: string;
        label: string;
        type: string;
        options?: string[];
    }>;
    onAdd?: () => void;
    onDelete?: () => void;
}

export function Editable({
    translationKey,
    children,
    className,
    type = "text",
    fields,
    onAdd,
    onDelete
}: EditableProps) {
    const { isAdmin, updateContent, t, setAnyPopupOpen } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [editValue, setEditValue] = useState<any>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isAdmin) return <>{children}</>;

    const openEditor = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const currentData = t(translationKey);
        setEditValue(currentData || "");
        setIsOpen(true);
        setAnyPopupOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeEditor = () => {
        setIsOpen(false);
        setAnyPopupOpen(false);
        document.body.style.overflow = 'unset';
    };

    const saveChanges = async () => {
        await updateContent(translationKey, editValue);
        closeEditor();
    };

    const updateField = (key: string, val: any) => {
        if (fields) {
            setEditValue({ ...editValue, [key]: val });
        } else {
            setEditValue(val);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key?: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (key) updateField(key, base64);
                else setEditValue(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderField = (field: any) => {
        const fieldValue = editValue?.[field.key] || "";

        if (field.type === "rich-text") {
            return (
                <div className="min-h-[400px] border border-white/10 rounded-3xl overflow-hidden bg-black/20">
                    <RichTextEditor
                        value={fieldValue}
                        onChange={(v) => updateField(field.key, v)}
                    />
                </div>
            );
        }

        if (field.type === "boolean") {
            return (
                <div className="flex items-center gap-4 px-6 py-5 bg-black/40 border border-white/5 rounded-[2rem]">
                    <input
                        type="checkbox"
                        checked={!!fieldValue}
                        onChange={(e) => updateField(field.key, e.target.checked)}
                        className="w-6 h-6 rounded-lg text-blue-500"
                    />
                    <span className="text-sm font-bold text-white/60">{field.label}</span>
                </div>
            );
        }

        if (field.type === "image") {
            return (
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            placeholder="URL veya Dosya Seç"
                            className="flex-1 bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-8 text-white"
                        />
                        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-6 rounded-[1.5rem] text-white flex items-center justify-center">
                            <Plus size={24} />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, field.key)} />
                        </label>
                    </div>
                    {fieldValue && (
                        <div className="w-40 h-40 rounded-3xl overflow-hidden border border-white/10">
                            <img src={fieldValue} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                    )}
                </div>
            );
        }

        if (field.type === "select") {
            return (
                <div className="relative">
                    <select
                        value={fieldValue}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-8 text-white appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Seçiniz...</option>
                        {field.options?.map((o: string) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <ChevronDown size={20} />
                    </div>
                </div>
            );
        }

        if (field.type === "date") {
            return (
                <Calendar
                    value={fieldValue ? new Date(fieldValue) : null}
                    onChange={(e: any) => {
                        const date = e.value;
                        if (date && date instanceof Date) {
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            updateField(field.key, `${year}-${month}`);
                        }
                    }}
                    view="month"
                    dateFormat="yy-mm"
                    placeholder={field.label}
                    appendTo="self"
                    className="w-full"
                    inputClassName="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-8 text-white"
                />
            );
        }

        return (
            <input
                type="text"
                value={fieldValue}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.label}
                className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-8 text-white"
            />
        );
    };

    const renderPopup = () => {
        if (!isOpen || !mounted) return null;

        return createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
                <div
                    className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[3.5rem] w-full max-w-4xl shadow-2xl my-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8">
                        <div>
                            <h3 className="text-3xl font-black outfit uppercase tracking-tighter text-white">Düzenle</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">{translationKey}</p>
                        </div>
                        <button onClick={closeEditor} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
                        {fields ? (
                            fields.map((field) => (
                                <div key={field.key} className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">
                                        {field.label}
                                    </label>
                                    {renderField(field)}
                                </div>
                            ))
                        ) : type === "rich-text" ? (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">İçerik</label>
                                <div className="min-h-[400px] border border-white/10 rounded-3xl overflow-hidden bg-black/20">
                                    <RichTextEditor value={editValue} onChange={setEditValue} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">İçerik</label>
                                <textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full h-60 bg-black/40 border border-white/5 rounded-[1.5rem] py-5 px-8 text-white"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={closeEditor}
                            className="px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all"
                        >
                            İptal
                        </button>
                        <button
                            onClick={saveChanges}
                            className="px-14 py-4 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                        >
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className={`relative group/editable w-fit transition-all duration-300 rounded-xl hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-4 hover:ring-offset-black ${className}`}>
            {children}

            <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover/editable:opacity-100 transition-opacity z-[50] pointer-events-none">
                <div className="flex gap-1 pointer-events-auto">
                    {onAdd && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}
                            className="p-1.5 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <Plus size={10} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                            className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <Trash2 size={10} />
                        </button>
                    )}
                    <button
                        onClick={openEditor}
                        className="p-1.5 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <Pencil size={10} />
                    </button>
                </div>
            </div>

            {renderPopup()}
        </div>
    );
}
