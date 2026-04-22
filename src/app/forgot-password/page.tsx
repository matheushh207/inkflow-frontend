'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
            const response = await fetch(`${baseUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsSent(true);
            } else {
                alert('Ocorreu um erro. Tente novamente.');
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
                    {!isSent ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">Recuperar Senha</h1>
                                <p className="text-xs text-secondary-text uppercase tracking-widest font-bold">Digite seu e-mail para receber o link de redefinição.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">E-mail Cadastrado</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                        <input
                                            type="email"
                                            placeholder="seuemail@exemplo.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
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
                                    {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gold-polished/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-gold-polished" />
                            </div>
                            <h2 className="text-xl font-black uppercase italic text-white mb-4">E-mail Enviado!</h2>
                            <p className="text-sm text-secondary-text mb-8">
                                Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes. Verifique também sua caixa de spam.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-premium-border text-center">
                        <Link href="/login" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft className="w-3 h-3" /> Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
