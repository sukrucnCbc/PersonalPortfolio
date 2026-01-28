"use client";

import React, { useState } from "react";
import { useLanguage } from "./language-context";
import { Lock, LogOut, Settings } from "lucide-react";

export function AdminLogin() {
    const { isAdmin, setIsAdmin } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin123";
        if (password === adminSecret) {
            setIsAdmin(true);
            setShowModal(false);
            setPassword("");
        } else {
            alert("Hatalı şifre!");
        }
    };

    if (isAdmin) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Edit Mode</span>
                </div>
                <button
                    onClick={() => setIsAdmin(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-red-500"
                    title="Çıkış Yap"
                >
                    <LogOut size={14} />
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/10 hover:text-white/40"
            >
                <Lock size={14} />
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto">
                    <form
                        onSubmit={handleLogin}
                        className="bg-zinc-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl text-center"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 border border-blue-500/20">
                            <Settings size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-2 outfit uppercase tracking-tighter text-white">Admin Girişi</h3>
                        <p className="text-white/40 text-sm mb-8 italic">Lütfen yönetim panelini açmak için şifrenizi girin.</p>

                        <input
                            type="password"
                            placeholder="Şifre"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-center font-mono focus:outline-none focus:border-blue-500/50 transition-all mb-6 placeholder:text-white/10"
                        />

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                            >
                                Giriş Yap
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 text-white/30 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
