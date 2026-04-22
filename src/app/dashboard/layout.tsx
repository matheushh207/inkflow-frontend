'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Users,
    DollarSign,
    Package,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    User,
    ShieldAlert,
    HeartPulse,
    FileSignature,
    ImageIcon,
    ClipboardList,
    CreditCard,
    Info,
    CheckCircle2,
    AlertTriangle,
    Headset
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import SubscriptionBlock from '@/components/SubscriptionBlock';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Resumo / Dashboard', href: '/dashboard', permission: 'any' },
    { icon: Calendar, label: 'Minha Agenda', href: '/dashboard/agenda', permission: 'agenda' },
    { icon: ClipboardList, label: 'Controle de Agendamentos', href: '/dashboard/appointments', permission: 'agenda' },
    { icon: Users, label: 'Gestão de Clientes', href: '/dashboard/clients', permission: 'clientes' },
    { icon: BarChart3, label: 'Painel de Orçamentos', href: '/dashboard/budgets', permission: 'any' },
    { icon: DollarSign, label: 'Controle Financeiro', href: '/dashboard/finance', permission: 'financeiro' },
    { icon: Package, label: 'Controle de Estoque', href: '/dashboard/inventory', permission: 'estoque' },
    { icon: CreditCard, label: 'Minha Assinatura', href: '/dashboard/billing', permission: 'any' },
    { icon: User, label: 'Equipe e Artistas', href: '/dashboard/users', permission: 'configuracoes' },
    { icon: HeartPulse, label: 'Fichas de Anamnese', href: '/dashboard/anamnesis', permission: 'agenda' },
    { icon: FileSignature, label: 'Termos Consentimento', href: '/dashboard/consent', permission: 'agenda' },
    { icon: ImageIcon, label: 'Meu Portfólio', href: '/dashboard/portfolio', permission: 'any' },
    { icon: Headset, label: 'Suporte InkFlow 24h', href: 'https://wa.me/5500000000000', permission: 'any', highlight: true },
    { icon: Settings, label: 'Ajustes e Configurações', href: '/dashboard/settings', permission: 'configuracoes' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { team, currentUserId, setCurrentUser, notifications, studioName, markNotificationAsRead } = useStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Get current user details dynamically and read cookies for real auth
    let realRole = 'Administrador';
    let realEmail = '';
    if (typeof document !== 'undefined') {
        const roleMatch = document.cookie.match(new RegExp('(^| )user_role=([^;]+)'));
        if (roleMatch) realRole = decodeURIComponent(roleMatch[2]);
        const emailMatch = document.cookie.match(new RegExp('(^| )user_email=([^;]+)'));
        if (emailMatch) realEmail = decodeURIComponent(emailMatch[2]);
    }

    const currentUser = team.find(m => m.id === currentUserId) || team[0];
    const activeRole = currentUser?.role || (realRole === 'ADMIN' ? 'Administrador' : realRole);
    const isMaster = (realEmail === 'admin@inkflow.com' && realRole === 'MASTER') || (currentUser?.email === 'admin@inkflow.com' && currentUser?.role === 'MASTER');

    React.useEffect(() => {
        if (isMaster && pathname.startsWith('/dashboard')) {
            router.push('/master');
        }
    }, [isMaster, pathname, router]);

    // Check Subscription Status
    useEffect(() => {
        const checkSubscription = async () => {
            if (isMaster) {
                setIsCheckingSubscription(false);
                return;
            }

            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-73a5.onrender.com';
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${baseUrl}/billing/status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                // Consider expired if no active subscription or expired date
                const expired = !data || data.status !== 'ACTIVE' || new Date(data.expiresAt) < new Date();
                setIsExpired(expired);
            } catch (error) {
                console.error('Subscription check error:', error);
            } finally {
                setIsCheckingSubscription(false);
            }
        };

        checkSubscription();
    }, [isMaster]);

    const handleLogout = () => {
        router.push('/login');
    };

    const filteredMenu = MENU_ITEMS.filter(item => {
        // Master gets everything
        if (isMaster) return true;
        
        // Items with 'any' permission ALWAYS show
        if (item.permission === 'any') return true;

        const role = activeRole || 'Administrador';

        // Role-based restrictions
        if (role === 'Artista' || (role as string) === 'ARTIST') {
            const forbiddenForArtists = ['Controle Financeiro', 'Equipe e Artistas', 'Ajustes e Configurações', 'Minha Assinatura', 'Controle de Estoque'];
            if (forbiddenForArtists.includes(item.label)) return false;
        }

        if (role === 'Recepção' || (role as string) === 'RECEPTIONIST' || role === 'Suporte') {
            const forbiddenForReception = ['Controle Financeiro', 'Equipe e Artistas', 'Minha Assinatura', 'Ajustes e Configurações'];
            if (forbiddenForReception.includes(item.label)) return false;
        }

        // Se chegou aqui e é owner/admin, garante acesso
        if (role === 'Administrador' || (role as string) === 'ADMIN' || !currentUser) return true;
        
        // Se tem array de permissões customizado (equipe secundaria)
        if (currentUser?.permissions) {
            const permissionKey = item.permission as keyof typeof currentUser.permissions;
            return currentUser.permissions[permissionKey];
        }

        return false;
    });

    return (
        <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-64 border-r border-premium-border flex-col">
                <div className="p-8 border-b border-premium-border flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="INK FLOW"
                        className="h-28 w-auto logo-alpha object-contain"
                    />
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-scroll">
                    {isMaster && (
                        <Link
                            href="/master"
                            className="flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-gold-polished text-black shadow-[0_10px_25px_rgba(212,175,55,0.25)] mb-6 hover:scale-[1.03] active:scale-95 transition-all text-center justify-center font-black"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            Torre de Comando MASTER
                        </Link>
                    )}
                    {filteredMenu.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-gold-polished text-black shadow-[0_5px_15px_rgba(212,175,55,0.3)]"
                                        : item.highlight
                                            ? "bg-gold-polished/10 text-gold-polished border border-gold-polished/20 hover:bg-gold-polished hover:text-black"
                                            : "text-secondary-text hover:bg-zinc-900 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : item.highlight ? "text-gold-polished group-hover:text-black" : "group-hover:text-gold-polished")} />
                                <span className="text-[13px] font-bold uppercase tracking-widest">{item.label}</span>
                                {isActive && !item.highlight && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black/50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-premium-border space-y-2">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-[13px] font-bold uppercase tracking-widest text-secondary-text hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Encerrar Sessão</span>
                    </button>

                    {/* DEMO ROLE SWITCHER */}
                    <div className="pt-2">
                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-2">Alterar Perfil (DEMO)</p>
                        <div className="flex flex-col gap-2">
                            {team.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => setCurrentUser(member.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-2 rounded-xl border transition-all text-left",
                                        currentUserId === member.id
                                            ? "bg-gold-polished/10 border-gold-polished/30"
                                            : "bg-black border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black",
                                        currentUserId === member.id ? "bg-gold-polished text-black" : "bg-zinc-900 text-zinc-500"
                                    )}>
                                        {member.name.substring(0, 2)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className={cn("text-[12px] font-bold truncate", currentUserId === member.id ? "text-white" : "text-zinc-500")}>
                                            {member.name}
                                        </p>
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-tighter truncate font-medium">
                                            {member.role}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden md:overflow-hidden">
                {/* TOP HEADER */}
                <header className="h-16 md:h-20 border-b border-premium-border flex items-center justify-between px-4 md:px-8 bg-[#0A0A0A]/50 backdrop-blur-xl z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg border border-white/5 text-secondary-text hover:text-white hover:bg-zinc-900 transition-all"
                            aria-label="Abrir menu"
                        >
                            ☰
                        </button>
                        <img
                            src="/logo.png"
                            alt="INK FLOW"
                            className="h-10 md:h-12 w-auto logo-alpha object-contain"
                        />
                        <div className="hidden sm:block text-sm md:text-base text-gold-polished uppercase tracking-[0.3em] font-black border-l border-premium-border pl-6">
                            DASHBOARD
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={cn(
                                    "p-2 relative transition-all rounded-lg border",
                                    notificationsOpen ? "bg-gold-polished text-black border-gold-polished" : "text-secondary-text hover:text-gold-polished border-white/5 hover:border-white/10"
                                )}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-[#0A0A0A] rounded-full text-[8px] font-black flex items-center justify-center text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* NOTIFICATIONS DROPDOWN */}
                            {notificationsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                    <div className="absolute right-0 mt-4 w-80 bg-[#0D0D0D] border border-premium-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-premium-pop">
                                        <div className="p-4 border-b border-premium-border bg-zinc-900/50 flex justify-between items-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold-polished">Centro de Alertas</h4>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">{unreadCount} Novas</span>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((n) => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => {
                                                            markNotificationAsRead(n.id);
                                                            setNotificationsOpen(false);
                                                        }}
                                                        className={cn(
                                                            "p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group relative",
                                                            !n.read && "bg-gold-polished/[0.02]"
                                                        )}
                                                    >
                                                        {!n.read && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-polished animate-pulse" />}
                                                        <div className="flex gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                                                                n.type === 'SUCCESS' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                                                n.type === 'WARNING' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                                                "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                                            )}>
                                                                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : 
                                                                 n.type === 'WARNING' ? <AlertTriangle className="w-4 h-4" /> : 
                                                                 <Info className="w-4 h-4" />}
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                                                                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{n.message}</p>
                                                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest pt-1">{n.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <Bell className="w-8 h-8 text-zinc-800 mx-auto mb-3 opacity-20" />
                                                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Nenhum alerta pendente</p>
                                                </div>
                                            )}
                                        </div>
                                        <button className="w-full p-4 text-[10px] font-black text-white hover:text-gold-polished uppercase tracking-widest bg-zinc-900/30 transition-colors">
                                            Ver Histórico Completo
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-3 md:p-8 scrollbar-hide">
                    {isExpired && !isMaster && !pathname.includes('/billing') ? (
                        <SubscriptionBlock />
                    ) : (
                        children
                    )}
                </div>
            </main>

            {/* MOBILE MENU DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[200] md:hidden">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-[320px] bg-[#0A0A0A] border-r border-premium-border flex flex-col">
                        <div className="p-5 border-b border-premium-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="INK FLOW" className="h-10 w-auto object-contain" />
                                <span className="text-[12px] font-black uppercase tracking-widest text-gold-polished">Menu</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg border border-white/5 text-secondary-text hover:text-white hover:bg-zinc-900 transition-all"
                                aria-label="Fechar menu"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="flex-1 p-3 space-y-1 overflow-y-auto sidebar-scroll">
                            {filteredMenu.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gold-polished/10 text-gold-polished"
                                                : "text-secondary-text hover:bg-zinc-900 hover:text-white"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-gold-polished" : "group-hover:text-gold-polished")} />
                                        <span className="text-[13px] font-bold uppercase tracking-widest">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-3 border-t border-premium-border space-y-2">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-3 w-full text-[13px] font-bold uppercase tracking-widest text-secondary-text hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Encerrar Sessão</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
