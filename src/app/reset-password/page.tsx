'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ShieldCheck, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
            const response = await fetch(`${baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const error = await response.json();
                alert(error.message || 'Erro ao redefinir senha. O link pode ter expirado.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-red-500 font-bold uppercase tracking-widest">Token Inválido</p>
                <p className="text-secondary-text mt-2">O link de recuperação está incompleto ou expirado.</p>
                <Link href="/forgot-password" className="btn-premium inline-flex mt-6 px-6 py-3">Tentar Novamente</Link>
            </div>
        );
    }

    return (
        <>
            {!isSuccess ? (
                <>
                    <div className="mb-8">
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">Nova Senha</h1>
                        <p className="text-xs text-secondary-text uppercase tracking-widest font-bold">Defina sua nova credencial de acesso.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Nova Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white outline-none focus:border-gold-polished transition-all"
                                    required
                                    min={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white outline-none focus:border-gold-polished transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-premium flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? 'Redefinindo...' : 'Atualizar Senha'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-xl font-black uppercase italic text-white mb-4">Senha Atualizada!</h2>
                    <p className="text-sm text-secondary-text mb-8">
                        Sua nova senha foi salva com sucesso. Você já pode acessar o sistema.
                    </p>
                    <Link href="/login" className="btn-premium w-full flex items-center justify-center gap-2">
                        Fazer Login Agora <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full stipple-bg opacity-5 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-polished/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-premium-fade relative z-10">
                <div className="text-center mb-10">
                    <Image
                        src="/logo.png"
                        alt="INK FLOW"
                        width={200}
                        height={60}
                        className="h-auto w-auto mx-auto mb-8 logo-alpha"
                    />
                </div>

                <div className="premium-card bg-[#111111]/80 backdrop-blur-xl border-premium-border shadow-2xl">
                    <Suspense fallback={<div className="text-center text-white p-10 font-black uppercase tracking-widest animate-pulse italic">Carregando Protocolo...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
