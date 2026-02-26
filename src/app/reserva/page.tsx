'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    User,
    MessageCircle,
    Phone,
    Instagram,
    CheckCircle2,
    Palette,
    FileText,
    ArrowRight,
    Star,
    Image as ImageIcon,
    X
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function ReservaPublicaPage() {
    const { addBudget, portfolio, studioName } = useStore();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        idea: '',
        availability: 'Qualquer Dia',
        images: [] as string[]
    });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else {
            addBudget({
                title: `Nova Solicitação: ${formData.idea.substring(0, 20)}...`,
                clientName: formData.name,
                value: 0,
                status: 'NEW',
                source: 'Reserva Online',
                description: `WhatsApp: ${formData.whatsapp}\n\nIdeia: ${formData.idea}\n\nDisponibilidade: ${formData.availability}`,
                images: formData.images
            });
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 bg-[url('/stipple.png')]">
                <div className="w-full max-w-lg premium-card text-center space-y-6 animate-premium-fade py-12">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Solicitação Enviada!</h2>
                    <p className="text-secondary-text font-medium leading-relaxed">
                        Recebemos seu pedido de orçamento. Nossa equipe analisará as referências e entrará em contato via WhatsApp em breve.
                    </p>
                    <div className="pt-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 text-center">Protocolo: #SESSAO-{Math.floor(Math.random() * 90000 + 10000)}</p>
                        <button onClick={() => window.location.reload()} className="w-full bg-zinc-900 border border-premium-border text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all">
                            Nova Solicitação
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6 overflow-hidden relative">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-0 left-0 w-full h-screen stipple-bg opacity-5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-polished/10 rounded-full blur-[160px] pointer-events-none" />

            {/* HEADER */}
            <header className="max-w-4xl w-full mx-auto flex justify-between items-center mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gold-polished/10 rounded-xl border border-gold-polished/20">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase">{studioName}</h1>
                        <p className="text-[9px] font-black text-secondary-text uppercase tracking-widest">Reserva & Orçamentos Online</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-6 items-center">
                    <button
                        onClick={() => setIsPortfolioOpen(true)}
                        className="flex items-center gap-2 text-secondary-text hover:text-white transition-all cursor-pointer"
                    >
                        <ImageIcon className="w-4 h-4 text-gold-polished" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Ver Portfolio</span>
                    </button>
                </div>
            </header>

            {/* MAIN FORM */}
            <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col items-center justify-center relative z-10 pb-20">
                <div className="w-full max-w-2xl">
                    {/* PROGRESS BAR */}
                    <div className="flex gap-2 mb-10">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gold-polished shadow-[0_0_10px_var(--accent-secondary)]' : 'bg-zinc-800'}`} />
                        ))}
                    </div>

                    <div className="premium-card bg-[#111111]/80 backdrop-blur-xl border-premium-border/50 shadow-2xl p-8 md:p-12 relative overflow-hidden">

                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-polished/5 rounded-full blur-3xl" />

                        {step === 1 && (
                            <div className="space-y-8 animate-premium-fade">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Informações Básicas</h2>
                                    <p className="text-zinc-500 text-sm">Inicie seu projeto com os dados de contato.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Seu Nome Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                            <input
                                                type="text"
                                                placeholder="Ex: Ana Paula Miranda"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">WhatsApp para Contato</label>
                                        <div className="relative">
                                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                            <input
                                                type="text"
                                                placeholder="(11) 99999-9999"
                                                value={formData.whatsapp}
                                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                                className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-premium-fade">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">O Projeto</h2>
                                    <p className="text-zinc-500 text-sm">Conte-nos sobre a tattoo que você deseja.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-text uppercase tracking-widest ml-1">Estilo & Ideia Principal</label>
                                        <div className="relative">
                                            <Palette className="absolute left-4 top-4 w-4 h-4 text-zinc-700" />
                                            <textarea
                                                rows={4}
                                                placeholder="Descreva o que você quer tatuar, o local do corpo e o tamanho estimado em cm..."
                                                value={formData.idea}
                                                onChange={e => setFormData({ ...formData, idea: e.target.value })}
                                                className="w-full bg-[#0A0A0A] border border-premium-border rounded-xl p-4 pl-12 text-sm text-white focus:border-gold-polished transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                    <ImageUpload
                                        label="Anexar Referências"
                                        maxFiles={3}
                                        onImagesChange={(imgs) => setFormData({ ...formData, images: imgs })}
                                        value={formData.images}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-premium-fade">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Preferências</h2>
                                    <p className="text-zinc-500 text-sm">Escalabilidade e disponibilidade para a sessão.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-secondary-text uppercase tracking-widest">Melhores dias para você</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Seg - Sex', 'Final de Semana', 'Qualquer Dia'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setFormData({ ...formData, availability: opt })}
                                                    className={`px-6 py-3 border rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest ${formData.availability === opt ? 'bg-gold-polished/20 border-gold-polished text-gold-polished' : 'bg-[#0A0A0A] border-premium-border text-white hover:border-gold-polished'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gold-polished/5 border border-gold-polished/20 rounded-xl flex items-start gap-4">
                                        <Star className="w-5 h-5 text-gold-polished mt-0.5" />
                                        <p className="text-[10px] text-gold-polished font-medium italic leading-relaxed">
                                            Ao enviar, você concorda com nossos termos de proteção de dados (LGPD) e autoriza o contato para fins de orçamento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex gap-4">
                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)} className="px-8 py-4 bg-zinc-900 text-secondary-text rounded-xl font-bold hover:text-white transition-all uppercase text-xs tracking-widest">
                                    Voltar
                                </button>
                            )}
                            <button onClick={handleNext} className="flex-1 btn-premium flex items-center justify-center gap-3 group uppercase text-xs tracking-[0.2em]">
                                {step === 3 ? 'Finalizar Pedido' : 'Próximo Passo'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="max-w-4xl w-full mx-auto py-8 border-t border-premium-border/30 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 opacity-60">
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest">© 2026 {studioName.toUpperCase()} . Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-800">Termos de Uso</span>
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-800">Privacidade LGPD</span>
                </div>
            </footer>

            {/* PORTFOLIO OVERLAY */}
            {isPortfolioOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-12">
                    <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setIsPortfolioOpen(false)} />

                    <div className="w-full max-w-6xl h-full flex flex-col relative z-20 animate-premium-pop">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Galeria do Estúdio</h3>
                                <p className="text-[10px] font-black text-gold-polished uppercase tracking-[0.3em]">Trabalhos Recentes</p>
                            </div>
                            <button
                                onClick={() => setIsPortfolioOpen(false)}
                                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 sidebar-scroll">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolio && portfolio.filter(item => item.isVisible).length > 0 ? portfolio.filter(item => item.isVisible).map((item) => (
                                    <div key={item.id} className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-gold-polished/50 transition-all">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all z-10" />

                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black text-4xl italic uppercase select-none">
                                                Arte do Estúdio
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all z-20">
                                            <p className="text-[10px] font-black text-gold-polished uppercase tracking-widest mb-1">{item.artist}</p>
                                            <h4 className="text-lg font-bold text-white uppercase italic">{item.title}</h4>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center opacity-30">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Nenhuma obra no portfolio ainda</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
