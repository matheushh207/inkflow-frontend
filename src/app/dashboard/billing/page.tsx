'use client';

import React, { useState, useEffect } from 'react';
import { 
    CreditCard, 
    CheckCircle2, 
    Zap, 
    Star, 
    ShieldCheck, 
    Copy, 
    Check,
    Clock,
    AlertCircle
} from 'lucide-react';

const plans = [
    { 
        id: 'solo', 
        name: 'Solo', 
        price: 50, 
        icon: Zap,
        features: ['1 Tatuador', 'Clientes Ilimitados', 'Agenda Online', 'Financeiro Básico'],
        color: 'text-blue-500'
    },
    { 
        id: 'professional', 
        name: 'Professional', 
        price: 80, 
        icon: Star,
        features: ['Até 3 Tatuadores', 'Gestão Financeira Full', 'Suporte Prioritário', 'Relatórios DRE'],
        color: 'text-gold-polished',
        popular: true
    },
    { 
        id: 'elite', 
        name: 'Elite', 
        price: 120, 
        icon: ShieldCheck,
        features: ['Até 10 Tatuadores', 'Métricas Avançadas', 'Whitelist de E-mail', 'Assistente Dedicado'],
        color: 'text-purple-500'
    },
];

interface PaymentResponse {
    amount: number;
    qrCode: string;
    qrCodeBase64: string;
}

export default function BillingPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<PaymentResponse | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-90nn.onrender.com';
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${baseUrl}/billing/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            console.error('Error fetching billing status:', error);
        }
    };

    const handleSubscribe = async (planId: string) => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-90nn.onrender.com';
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${baseUrl}/billing/subscribe`, {
                method: 'POST',
                body: JSON.stringify({ planId, paymentMethod: 'PIX' }),
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

    const daysLeft = status?.expiresAt ? Math.ceil((new Date(status.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* CURRENT STATUS VIEW */}
            <div className="premium-card bg-gradient-to-br from-zinc-900 to-black border-gold-polished/10 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gold-polished" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-polished">Status da Assinatura</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                            {daysLeft > 0 ? (
                                <>Acesso Liberado: <span className="text-gold-polished">{daysLeft} Dias</span> Restantes</>
                            ) : (
                                "Sua Assinatura Expirou"
                            )}
                        </h2>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Plano Atual: {status?.plan?.name || 'Carregando...'}</p>
                    </div>
                    {daysLeft > 0 && (
                        <div className="h-1.5 w-full md:w-80 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gold-polished rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,215,0,0.5)]" 
                                style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }} 
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden lg:block">
                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Próximo Vencimento</p>
                        <p className="text-lg font-bold text-white tracking-tighter">{status?.expiresAt ? new Date(status.expiresAt).toLocaleDateString('pt-BR') : '--/--/----'}</p>
                    </div>
                    <AlertCircle className={`w-8 h-8 ${daysLeft <= 2 ? 'text-rose-500 animate-pulse' : 'text-zinc-800'}`} />
                </div>
            </div>

            {/* PAYMENT VIEW */}
            {!selectedPlan ? (
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-2">Renove seu Acesso</h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] font-medium">Selecione o melhor plano para o seu estágio atual</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`premium-card group relative flex flex-col transition-all duration-500 border-2 ${plan.popular ? 'border-gold-polished/30 bg-gold-polished/[0.02]' : 'border-premium-border/50 hover:border-white/10'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-polished text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-gold-polished/20">
                                        Recomendado
                                    </div>
                                )}
                                
                                <div className="mb-8">
                                    <plan.icon className={`w-8 h-8 ${plan.color} mb-4`} />
                                    <h4 className="text-white text-2xl font-black uppercase tracking-tighter">{plan.name}</h4>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Mensal</p>
                                </div>

                                <div className="mb-8">
                                    <span className="text-4xl font-black text-white italic tracking-tighter">R$ {plan.price}</span>
                                    <span className="text-zinc-500 text-sm italic font-medium"> / mês</span>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-3 text-sm font-medium text-zinc-400">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 " />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-gold-polished text-black hover:bg-white' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10'}`}
                                >
                                    {loading ? "Processando..." : (plan.id === status?.planId ? "Renovar Agora" : "Mudar para este Plano")}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto animate-premium-fade">
                    <div className="premium-card p-10 bg-zinc-950/80 border-gold-polished/20 text-center space-y-8">
                        <div className="inline-flex p-4 bg-gold-polished/10 rounded-full mb-2">
                            <Zap className="w-8 h-8 text-gold-polished animate-pulse" />
                        </div>
                        
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Quase Lá!</h2>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-2">Pague agora para liberar seu acesso</p>
                        </div>

                        <div className="flex flex-col items-center gap-6 py-4">
                            <div className="p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-500">
                                <img 
                                    src={`data:image/png;base64,${selectedPlan.qrCodeBase64}`} 
                                    alt="QR Code PIX"
                                    className="w-56 h-56"
                                />
                            </div>
                            
                            <div className="w-full space-y-3">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Copia e Cola</p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-[10px] break-all text-zinc-400 text-left line-clamp-1">
                                        {selectedPlan.qrCode}
                                    </div>
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`px-6 rounded-xl flex items-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gold-polished text-black hover:bg-white'}`}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span className="text-[10px] font-black uppercase">{copied ? "Copiado" : "Copiar"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-secondary-text font-bold italic">A liberação ocorre em segundos após a confirmação do pagamento pelo Banco.</p>
                            <button 
                                onClick={() => setSelectedPlan(null)}
                                className="mt-8 text-[11px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Escolher Outro Plano
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
