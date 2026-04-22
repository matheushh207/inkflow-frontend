'use client';

import React, { useState, useEffect } from 'react';
import { 
    Zap, 
    Star, 
    ShieldCheck, 
    CheckCircle2, 
    Copy, 
    Check, 
    AlertTriangle,
    Crown,
    Lock
} from 'lucide-react';

const plans = [
    { 
        id: 'solo', 
        name: 'Solo', 
        price: 50, 
        icon: Zap,
        features: ['1 Tatuador (Você)', 'Todos os Recursos Liberados', 'Agenda Online', 'Financeiro Profissional', 'Clientes Ilimitados'],
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    { 
        id: 'professional', 
        name: 'Profissional', 
        price: 80, 
        icon: Star,
        features: ['Até 3 Tatuadores', 'Todos os Recursos Liberados', 'Gestão Financeira Full', 'Suporte Prioritário 24h', 'Relatórios de Performance'],
        color: 'text-gold-polished',
        bg: 'bg-gold-polished/10',
        popular: true
    },
    { 
        id: 'elite', 
        name: 'Elite', 
        price: 120, 
        icon: ShieldCheck,
        features: ['Até 10 Tatuadores', 'Todos os Recursos Liberados', 'Métricas Avançadas', 'Whitelist de E-mail', 'Assistente Dedicado'],
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
];

export default function SubscriptionBlock() {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleSubscribe = async (planId: string) => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${baseUrl}/mercadopago/pix`, {
                method: 'POST',
                body: JSON.stringify({ planId }),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSelectedPlan(data);
        } catch (error) {
            console.error('Payment generation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (selectedPlan) {
            navigator.clipboard.writeText(selectedPlan.qrCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-[#0A0A0A]/95 backdrop-blur-2xl flex justify-center items-start md:items-center p-4 overflow-y-auto pt-10 pb-10">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full stipple-bg opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-gold-polished/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-6xl relative z-10 animate-premium-fade">
                {!selectedPlan ? (
                    <div className="space-y-8">
                        <div className="text-center space-y-3 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 mb-2 animate-bounce">
                                <Lock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acesso Bloqueado</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Seu Tempo <span className="text-gold-polished">Expirou</span>
                            </h2>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
                                Seu período de teste ou assinatura chegou ao fim. <br />
                                Escolha um plano abaixo para liberar sua agenda e continuar evoluindo seu estúdio.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                            {plans.map((plan) => (
                                <div 
                                    key={plan.id} 
                                    className={`premium-card group relative flex flex-col transition-all duration-500 border-2 bg-zinc-950/50 ${plan.popular ? 'border-gold-polished/40 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-polished text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                            Mais Vendido
                                        </div>
                                    )}
                                    
                                    <div className="mb-8">
                                        <div className={`w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <plan.icon className={`w-6 h-6 ${plan.color}`} />
                                        </div>
                                        <h4 className="text-white text-2xl font-black uppercase tracking-tighter">{plan.name}</h4>
                                        <div className="mt-4">
                                            <span className="text-4xl font-black text-white italic tracking-tighter">R$ {plan.price}</span>
                                            <span className="text-zinc-500 text-sm italic font-medium"> / mês</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feat) => (
                                            <li key={feat} className="flex items-start gap-3 text-xs font-bold text-zinc-400">
                                                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.color}`} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gold-polished text-black hover:bg-white shadow-lg' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10'}`}
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Assinar este Plano <Zap className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <button 
                                onClick={() => window.location.href = '/login'} 
                                className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Sair da conta atual
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto animate-premium-fade w-full">
                        <div className="premium-card p-6 sm:p-10 bg-zinc-950 border-gold-polished/30 text-center space-y-6 shadow-[0_0_100px_rgba(212,175,55,0.05)]">
                            <div className="inline-flex p-4 bg-gold-polished/10 rounded-full mb-2">
                                <Crown className="w-8 h-8 text-gold-polished animate-pulse" />
                            </div>
                            
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Quase lá!</h2>
                                <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                                    O código PIX foi gerado. <br /> Pague agora para liberar seu acesso instantaneamente.
                                </p>
                            </div>

                             <div className="flex flex-col items-center gap-4 py-2">
                                <div className="p-4 bg-white rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-500">
                                    <img 
                                        src={`data:image/png;base64,${selectedPlan.qrCodeBase64}`} 
                                        alt="QR Code PIX"
                                        className="w-56 h-56"
                                    />
                                </div>
                                
                                <div className="w-full space-y-3">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Copia e Cola</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-[9px] break-all text-zinc-500 text-left line-clamp-1 italic">
                                            {selectedPlan.qrCode}
                                        </div>
                                        <button 
                                            onClick={copyToClipboard}
                                            className={`px-8 rounded-xl flex items-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gold-polished text-black hover:scale-105 active:scale-95'}`}
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            <span className="text-[10px] font-black uppercase">{copied ? "Copiado" : "Copiar"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] text-zinc-500 font-bold italic">
                                    A liberação é automática. Assim que o pagamento for confirmado, esta tela desaparecerá.
                                </p>
                                <button 
                                    onClick={() => setSelectedPlan(null)}
                                    className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-gold-polished transition-colors"
                                >
                                    Alterar Plano Escolhido
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
