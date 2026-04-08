'use client';

import React, { useState } from 'react';

const plans = [
    { id: 'solo', name: 'Solo', price: 50, features: ['1 Tatuador', 'Clientes Ilimitados', 'Agenda Online'] },
    { id: 'professional', name: 'Professional', price: 80, features: ['Até 3 Tatuadores', 'Gestão Financeira', 'Suporte'] },
    { id: 'elite', name: 'Elite', price: 120, features: ['Até 10 Tatuadores', 'Métricas Avançadas', 'Prioridade'] },
];

export default function BillingPage() {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSubscribe = async (planId: string) => {
        setLoading(true);
        // Chamada para o backend que criamos no Passo 3
        const response = await fetch('/api/billing/subscribe', {
            method: 'POST',
            body: JSON.stringify({ planId, paymentMethod: 'PIX' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setSelectedPlan(data);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-white">Escolha seu Plano InkFlow</h1>
            
            {!selectedPlan ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl flex flex-col hover:border-yellow-500 transition-all">
                            <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
                            <p className="text-4xl font-black text-yellow-500 mb-6">R$ {plan.price}<span className="text-sm font-normal text-zinc-400">/mês</span></p>
                            <ul className="flex-1 mb-8 space-y-3">
                                {plan.features.map(f => (
                                    <li key={f} className="text-zinc-300 flex items-center">
                                        <span className="mr-2 text-green-500">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loading}
                                className="bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
                            >
                                {loading ? 'Gerando PIX...' : 'Assinar Agora'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-900 p-8 rounded-2xl text-center border border-yellow-500">
                    <h2 className="text-2xl font-bold text-white mb-4">Escaneie o QR Code PIX</h2>
                    <p className="text-zinc-400 mb-6">Total a pagar: R$ {selectedPlan.amount}</p>
                    <img src={`data:image/png;base64,${selectedPlan.qrCodeBase64}`} className="mx-auto mb-6 w-64 h-64 border-4 border-white rounded-lg" />
                    <div className="bg-black p-4 rounded mb-6 font-mono text-xs break-all text-zinc-300">
                        {selectedPlan.qrCode}
                    </div>
                    <p className="text-yellow-500 animate-pulse font-bold">Aguardando confirmação do pagamento...</p>
                </div>
            )}
        </div>
    );
}
