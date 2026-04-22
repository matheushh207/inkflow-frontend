'use client';

import React, { useState, useEffect } from 'react';
import { 
    Users, 
    CreditCard, 
    Star, 
    Clock, 
    TrendingUp, 
    ExternalLink, 
    Search, 
    Filter,
    ShieldCheck,
    AlertCircle,
    Crown,
    Calendar,
    Infinity,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function MasterDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
                const token = localStorage.getItem('access_token');

                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const [statsRes, tenantsRes] = await Promise.all([
                    fetch(`${baseUrl}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${baseUrl}/admin/tenants`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (statsRes.status === 403) {
                    alert('Acesso negado. Apenas o MASTER do sistema pode acessar esta área.');
                    window.location.href = '/dashboard';
                    return;
                }

                const statsData = await statsRes.json();
                const tenantsData = await tenantsRes.json();

                setStats(statsData);
                setTenants(tenantsData);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.users[0]?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApplyDiscount = async (tenantId: string, percentage: number) => {
        if (!confirm(`Deseja aplicar ${percentage}% de desconto e enviar um e-mail de oferta profissional para este estúdio?`)) return;
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${baseUrl}/admin/tenants/${tenantId}/discount`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ discount: percentage })
            });

            if (res.ok) {
                alert(`Desconto de ${percentage}% aplicado e E-mail enviado com sucesso!`);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error applying discount:', error);
        }
    };

    const handleExtendSubscription = async (tenantId: string, days: number, isLifetime: boolean = false) => {
        const msg = isLifetime ? "Liberar acesso VITALÍCIO para este estúdio?" : `Dar +${days} dias de acesso de presente?`;
        if (!confirm(msg)) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${baseUrl}/admin/tenants/${tenantId}/extend`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ days, isLifetime })
            });

            if (res.ok) {
                alert(`Assinatura estendida com sucesso!`);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error extending sub:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gold-polished border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse italic">Acessando Banco de Dados Master...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-gold-polished" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-polished">Torre de Comando MASTER</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Gestão <span className="text-gold-polished">InkFlow MASTER</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => {
                                localStorage.removeItem('access_token');
                                document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                window.location.href = '/login';
                            }}
                            className="text-xs font-bold uppercase tracking-widest px-6 py-3 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/10 transition-all"
                        >
                            Sair do Master
                        </button>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/20 border border-purple-400/20">Atualizar Monitoramento</button>
                    </div>
                </div>

                {/* GLOBAL STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    <StatCard 
                        icon={Users} 
                        label="Total de Estúdios" 
                        value={stats?.totalTenants || 0} 
                        sub="+3 nas últimas 24h"
                        color="text-blue-500"
                    />
                    <StatCard 
                        icon={TrendingUp} 
                        label="Faturamento Total" 
                        value={`R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR')}`}
                        sub="Mês atual"
                        color="text-emerald-500"
                    />
                    <StatCard 
                        icon={Star} 
                        label="Assinantes Ativos" 
                        value={stats?.activeSubscriptions || 0} 
                        sub="Planos Pagos"
                        color="text-gold-polished"
                    />
                    <StatCard 
                        icon={Clock} 
                        label="Trials Expirando" 
                        value={stats?.trialsExpiring || 0} 
                        sub="Próximas 48 horas"
                        color="text-rose-500"
                    />
                    <StatCard 
                        icon={AlertCircle} 
                        label="Novos Hoje" 
                        value={stats?.newTenantsToday || 0} 
                        sub="Cadastros recentes"
                        color="text-purple-500"
                    />
                </div>

                {/* MONITORING TABLE */}
                <div className="premium-card p-0 border-premium-border bg-[#111]/80 backdrop-blur-xl mb-12 overflow-hidden">
                    <div className="p-6 border-b border-premium-border flex flex-col md:flex-row justify-between items-center gap-6">
                        <h2 className="text-sm font-black uppercase text-gold-polished tracking-[0.2em]">Monitoramento de Clientes em Tempo Real</h2>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                                type="text" 
                                placeholder="Pesquisar estúdio ou e-mail..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-3 pl-12 text-xs outline-none focus:border-gold-polished transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto font-medium">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">
                                    <th className="p-6">Estúdio / Slug</th>
                                    <th className="p-6">Cadastro</th>
                                    <th className="p-6">Administrador</th>
                                    <th className="p-6">Plano / Status</th>
                                    <th className="p-6">Expiração</th>
                                    <th className="p-6">Ações / Ofertas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-premium-border">
                                {filteredTenants.map((tenant) => {
                                    const sub = tenant.subscriptions[0];
                                    const isTrial = sub?.planId === 'solo' && sub?.status === 'ACTIVE'; // Simplificado
                                    const daysLeft = sub?.expiresAt ? Math.ceil((new Date(sub.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

                                    return (
                                        <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <p className="text-sm font-bold text-white group-hover:text-gold-polished transition-colors">{tenant.name}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{tenant.slug}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Inscrito em:</p>
                                                <p className="text-xs text-white">{new Date(tenant.createdAt).toLocaleDateString('pt-BR')}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-sm text-zinc-300">{tenant.users[0]?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-zinc-500">{tenant.users[0]?.email || 'N/A'}</p>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                                                        sub?.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                    )}>
                                                        {sub?.plan?.name || 'SEM PLANO'}
                                                    </span>
                                                    {isTrial && <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black uppercase tracking-tighter">TRIAL</span>}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-1">
                                                    {daysLeft > 10000 ? (
                                                        <div className="flex items-center gap-2 text-purple-400">
                                                            <Infinity size={16} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">VIP VITALÍCIO</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className={`text-sm font-bold ${daysLeft <= 1 ? 'text-rose-500' : 'text-zinc-300'}`}>
                                                                {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
                                                            </p>
                                                            <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${daysLeft <= 1 ? 'bg-rose-500' : 'bg-gold-polished'}`} 
                                                                    style={{ width: `${Math.min(100, (daysLeft / 5) * 100)}%` }} 
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                                                        {[15, 20, 25].map(pct => (
                                                            <button 
                                                                key={pct}
                                                                onClick={() => handleApplyDiscount(tenant.id, pct)}
                                                                className={`px-2 py-1 text-[9px] font-black rounded transition-all ${tenant.discount === pct ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                                                                title={`Enviar Oferta de ${pct}%`}
                                                            >
                                                                {pct}%
                                                            </button>
                                                        ))}
                                                        {tenant.discount > 0 && (
                                                            <button 
                                                                onClick={() => handleApplyDiscount(tenant.id, 0)}
                                                                className="px-2 py-1 text-[9px] font-black text-rose-500 hover:bg-rose-500/10 rounded"
                                                                title="Remover Desconto"
                                                            >
                                                                X
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleExtendSubscription(tenant.id, 7)}
                                                            className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[9px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                                                        >
                                                            +7D
                                                        </button>
                                                        <button 
                                                            onClick={() => handleExtendSubscription(tenant.id, 30)}
                                                            className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[9px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                                                        >
                                                            +30D
                                                        </button>
                                                        <button 
                                                            onClick={() => handleExtendSubscription(tenant.id, 0, true)}
                                                            className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] font-black text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all flex items-center gap-1"
                                                            title="Liberar Acesso Vitalício"
                                                        >
                                                            <Crown size={12} /> VIP
                                                        </button>
                                                    </div>

                                                    <button 
                                                        onClick={() => window.open(`https://wa.me/5500000000000?text=Olá, sou o suporte master. Como posso ajudar o estúdio ${tenant.name}?`)}
                                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors w-fit mx-auto"
                                                    >
                                                        SUPORTE MASTER
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
    return (
        <div className="premium-card bg-[#111] border-premium-border/50 group hover:border-gold-polished/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
            <h4 className="text-2xl font-black text-white mb-2">{value}</h4>
            <p className="text-[10px] font-bold text-zinc-600 uppercase italic tracking-widest">{sub}</p>
        </div>
    );
}
