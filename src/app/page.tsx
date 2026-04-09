'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    ShieldCheck,
    Smartphone,
    BarChart3,
    Zap,
    CheckCircle2,
    ArrowRight,
    Play,
    LayoutDashboard
} from 'lucide-react';
import SystemDemo from './SystemDemo';

// Custom CheckCircle SVG component
function CheckCircleCustom({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

export default function LandingPage() {
    const showDemo = process.env.NEXT_PUBLIC_SHOW_DEMO === 'true';

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-gold-polished selection:text-black">
            {/* NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-premium-border">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="InkFlow Logo"
                            width={160}
                            height={48}
                            className="logo-alpha"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#beneficios" className="text-sm font-black uppercase tracking-widest text-secondary-text hover:text-white transition-colors">Benefícios</Link>
                        <Link href="#demonstracao" className="text-sm font-black uppercase tracking-widest text-secondary-text hover:text-white transition-colors">Demonstração</Link>
                        <Link
                            href="/login"
                            className="text-sm font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="btn-premium py-2 px-6"
                        >
                            Teste Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* HERO SECTION */}
                <section className="relative py-24 lg:py-40 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full stipple-bg opacity-20 pointer-events-none" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-polished/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-premium-fade">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">A revolução na gestão já começou</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] max-w-5xl mx-auto uppercase">
                            Transforme a <span className="text-gold-polished italic">Gestão</span> do seu estúdio de tatuagem.
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-secondary-text max-w-3xl mx-auto mb-12 font-medium">
                            O sistema mais completo do Brasil. Gerencie agendamentos, orçamentos, estoque e finanças em uma única plataforma premium.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/register" className="btn-premium px-10 py-5 text-lg w-full sm:w-auto flex items-center justify-center gap-3 group">
                                TESTE GRÁTIS POR 5 DIAS
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="px-6 py-2 border border-primary-light/20 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
                                LOGIN
                            </Link>
                        </div>
                    </div>
                </section>

                {/* BENEFITS SECTION */}
                <section id="beneficios" className="py-24 bg-[#0F0F0F]">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="mb-16">
                            <p className="text-gold-polished font-black uppercase tracking-[0.3em] text-[10px] mb-4">Performance Máxima</p>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Por que o InkFlow é <br />o sistema ideal para você?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <BenefitCard
                                icon={Mail}
                                title="Confirmação por E-mail"
                                description="Envio automático de links de confirmação para agendamentos e orçamentos, garantindo zero faltas."
                                color="text-gold-polished"
                            />
                            <BenefitCard
                                icon={ShieldCheck}
                                title="Dados 100% Seguros"
                                description="Sua base de clientes e informações financeiras protegidas com criptografia de nível bancário."
                                color="text-blue-500"
                            />
                            <BenefitCard
                                icon={Smartphone}
                                title="Acesso Global"
                                description="Controle seu estúdio de qualquer lugar do mundo, seja pelo celular, tablet ou computador."
                                color="text-emerald-500"
                            />
                            <BenefitCard
                                icon={BarChart3}
                                title="Controle Financeiro"
                                description="Relatórios de DRE, fluxo de caixa, comissões de artistas e gestão de despesas completa."
                                color="text-rose-500"
                            />
                            <BenefitCard
                                icon={Zap}
                                title="SMTP Personalizado"
                                description="Configure seu próprio servidor de e-mail e envie notificações diretamente da sua conta profissional."
                                color="text-purple-500"
                            />
                            <BenefitCard
                                icon={CheckCircle2}
                                title="Gestão Completa"
                                description="Anamnese digital, estoque inteligente, gestão de materiais e controle de sessões."
                                color="text-amber-500"
                            />
                        </div>
                    </div>
                </section>

                {/* DEMO VIDEO SECTION */}
                <section id="demonstracao" className="py-24 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gold-polished/5 blur-[150px] -z-10" />
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="text-center mb-16 animate-premium-fade">
                            <p className="text-gold-polished font-black uppercase tracking-[0.3em] text-[10px] mb-4">Experiência Real</p>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 underline decoration-gold-polished/30">O Sistema em Ação</h2>
                            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest font-bold">
                                Veja como a interface fluida e os processos automatizados <br /> podem economizar horas do seu dia.
                            </p>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            {/* Monitor Frame Decoration */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-gold-polished/30 to-blue-500/30 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="relative bg-[#111] border-4 border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
                                {/* Video Player Placeholder/Real View */}
                                <div className="aspect-video relative bg-black group cursor-pointer overflow-hidden">
                                    <video 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                                    >
                                        <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-38390-large.mp4" type="video/mp4" />
                                        Seu navegador não suporta vídeos.
                                    </video>
                                    
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-500">
                                        <div className="w-20 h-20 bg-gold-polished rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,215,0,0.4)] group-hover:scale-110 transition-transform duration-500">
                                            <Play className="w-8 h-8 fill-current" />
                                        </div>
                                    </div>

                                    {/* Video Label */}
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-gold-polished uppercase tracking-[0.3em] mb-1">Preview do Sistema</p>
                                            <p className="text-xl font-bold text-white">Dashboard InkFlow v4.0</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/20 rounded-full" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* OLD DEMO SECTION (keep if needed, otherwise removed for the video focus) */}
                {showDemo && (
                    <section className="py-24 bg-[#0A0A0A]/50 border-y border-white/5">
                        <div className="max-w-[1400px] mx-auto px-6">
                            <SystemDemo />
                        </div>
                    </section>
                )}

                {/* CTA SECTION */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-polished/5" />
                    <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-tight">
                            Pronto para elevar o <br />nível do seu estúdio?
                        </h2>
                        <Link href="/register" className="btn-premium px-12 py-6 text-xl inline-flex items-center gap-4 group">
                            COMECE SEU TESTE GRÁTIS AGORA!
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <p className="mt-8 text-secondary-text font-black uppercase tracking-widest text-xs italic">
                            Sem cartão de crédito necessário por 5 dias.
                        </p>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-premium-border py-12 bg-[#050505]">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <Image
                        src="/logo.png"
                        alt="InkFlow Logo"
                        width={120}
                        height={40}
                        className="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer"
                    />
                    <p className="text-zinc-600 text-sm font-medium">© 2026 Gestão Ink Flow. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

function BenefitCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
    return (
        <div className="premium-card hover:-translate-y-2 transition-all duration-300">
            <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${color}`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-white">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
}
