'use client';

import React, { useState } from 'react';
import { LogIn, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full stipple-bg opacity-5 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-polished/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-premium-fade relative z-10">
                <div className="text-center mb-10">
                    <img
                        src="/logo.png"
                        alt="INK FLOW"
                        className="h-64 w-auto mx-auto mb-8 logo-alpha transition-transform hover:scale-105"
                    />
                </div>

                <div className="premium-card bg-[#111111]/80 backdrop-blur-xl border-premium-border shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">E-mail do Estúdio</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="email"
                                    placeholder="admin@estudio.com"
                                    className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white outline-none focus:border-gold-polished transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Senha de Acesso</label>
                                <button type="button" className="text-[10px] font-black text-gold-polished uppercase tracking-widest hover:underline">Esqueci a senha</button>
                            </div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white outline-none focus:border-gold-polished transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-premium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-wait"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Entrar no Sistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-premium-border text-center">
                        <p className="text-xs text-secondary-text">
                            Não tem uma conta? <Link href="#" className="text-gold-polished font-bold hover:underline">Solicite Acesso</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                        Conexão Segura // Protocolo INK-SSL
                    </p>
                </div>
            </div>
        </div>
    );
}
