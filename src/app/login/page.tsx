'use client';

import React, { useState } from 'react';
import { LogIn, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-90nn.onrender.com';
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Salva o token no cookie para o middleware
                document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
                document.cookie = `user_role=${data.user?.role}; path=/; max-age=86400; SameSite=Lax`;
                document.cookie = `user_email=${data.user?.email}; path=/; max-age=86400; SameSite=Lax`;
                localStorage.setItem('access_token', data.access_token);
                
                // Redirecionamento Inteligente baseado na Role e E-mail
                const isSuperAdmin = data.user?.role === 'SUPER_ADMIN' && data.user?.email === 'admin@inkflow.com';
                
                if (isSuperAdmin) {
                    window.location.href = '/super-admin';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                alert('Credenciais inválidas. Tente novamente.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full stipple-bg opacity-5 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-polished/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-premium-fade relative z-10">
                <div className="text-center mb-10">
                    <Image
                        src="/logo.png"
                        alt="INK FLOW"
                        width={250}
                        height={80}
                        className="h-auto w-auto mx-auto mb-8 logo-alpha transition-transform hover:scale-105"
                        priority
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
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white outline-none focus:border-gold-polished transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Senha de Acesso</label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-gold-polished uppercase tracking-widest hover:underline">Esqueci a senha</Link>
                            </div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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
                            Não tem uma conta? <Link href="/register" className="text-gold-polished font-bold hover:underline">Solicite Acesso</Link>
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
