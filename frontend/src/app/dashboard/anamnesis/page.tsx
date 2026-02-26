'use client';

import {
    HeartPulse,
    FileText,
    AlertCircle,
    History,
    CheckCircle2,
    Plus,
    User,
    X,
    ClipboardCheck,
    Printer,
    Download
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function AnamnesisPage() {
    const { clients, anamnesisPrintHistory, recordAnamnesisPrint } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [showPrintView, setShowPrintView] = useState(false);

    const selectedClient = clients.find(c => c.id === selectedClientId);

    const handlePrint = () => {
        if (!selectedClientId) return alert('Selecione um cliente primeiro!');
        recordAnamnesisPrint(selectedClientId);
        setShowPrintView(true);
        setTimeout(() => {
            window.print();
            setShowPrintView(false);
            setIsModalOpen(false);
        }, 100);
    };

    const updatedClientIds = new Set(anamnesisPrintHistory.map(r => r.clientId));
    const updatedCount = updatedClientIds.size;
    const pendingCount = Math.max(0, clients.length - updatedCount);

    return (
        <div className="space-y-8 animate-premium-fade relative">
            {/* PRINT VIEW (Hidden on screen unless printing) */}
            <div className={`fixed inset-0 bg-white z-[9999] p-12 text-black overflow-y-auto ${showPrintView ? 'block' : 'hidden print:block'}`}>
                <div className="max-w-3xl mx-auto space-y-8 font-serif leading-relaxed">
                    {/* Header */}
                    <div className="text-center border-b-2 border-black pb-6">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">INKFLOW STUDIO</h1>
                        <p className="text-[12px] uppercase font-bold tracking-widest mt-1">Ficha de Anamnese & Consentimento Informado</p>
                    </div>

                    {/* Client Info */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                            <p><strong>Nome:</strong> {selectedClient?.name || '__________________________'}</p>
                            <p><strong>WhatsApp:</strong> {selectedClient?.phone || '__________________________'}</p>
                        </div>
                        <div className="space-y-1">
                            <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                            <p><strong>CPF/RG:</strong> __________________________</p>
                        </div>
                    </div>

                    {/* Clinical Questions */}
                    <div className="space-y-4">
                        <h4 className="font-bold border-l-4 border-black pl-3 uppercase text-sm">Questionário Clínico</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                            <p>Possui diabetes? ( ) Sim ( ) Não</p>
                            <p>Possui epilepsia? ( ) Sim ( ) Não</p>
                            <p>Cicatrização queloide? ( ) Sim ( ) Não</p>
                            <p>Problemas cardíacos? ( ) Sim ( ) Não</p>
                            <p>Alergia a pigmentos? ( ) Sim ( ) Não</p>
                            <p>Uso de anticoagulantes? ( ) Sim ( ) Não</p>
                            <p>Gestante ou lactante? ( ) Sim ( ) Não</p>
                            <p>Hepatite ou HIV? ( ) Sim ( ) Não</p>
                        </div>
                        <div className="text-xs space-y-2">
                            <p><strong>Medicamentos em uso:</strong> ____________________________________________________</p>
                            <p><strong>Alergias conhecidas:</strong> ____________________________________________________</p>
                        </div>
                    </div>

                    {/* Consent Text */}
                    <div className="space-y-3 text-[10px] text-justify leading-snug">
                        <h4 className="font-bold uppercase">Termo de Responsabilidade</h4>
                        <p>Declaro estar ciente de todos os procedimentos aos quais serei submetido, bem como dos riscos inerentes (infecção, reações alérgicas ou má cicatrização). Comprometo-me a seguir todas as orientações pós-procedimento fornecidas pelo profissional. Isento o estúdio e o profissional de qualquer responsabilidade por omissão de informações sobre meu estado de saúde.</p>
                        <p>Autorizo o uso de fotografias do procedimento para fins de divulgação em portfólio e redes sociais do estúdio.</p>
                    </div>

                    {/* Signatures */}
                    <div className="pt-12 grid grid-cols-2 gap-12">
                        <div className="text-center space-y-2">
                            <div className="border-t border-black w-full" />
                            <p className="text-[9px] uppercase font-bold">Assinatura do Cliente</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="border-t border-black w-full" />
                            <p className="text-[9px] uppercase font-bold">Assinatura do Profissional</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN UI */}
            <div className="print:hidden space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">Anamnese & Saúde</h1>
                        <p className="text-secondary-text text-sm font-medium">Fichas de anamnese e histórico clínico dos clientes.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-premium flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" /> Nova Ficha
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="premium-card bg-emerald-green/5 border-emerald-green/20">
                        <p className="text-[12px] font-black text-emerald-green uppercase tracking-widest">Atualizadas</p>
                        <h3 className="text-3xl font-black text-white py-2">{updatedCount}</h3>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold text-right pt-2 border-t border-emerald-green/10">
                            {clients.length > 0 ? `${Math.round((updatedCount / clients.length) * 100)}% da base` : '0% da base'}
                        </p>
                    </div>
                    <div className="premium-card bg-amber-500/5 border-amber-500/20">
                        <p className="text-[12px] font-black text-amber-500 uppercase tracking-widest">Pendentes</p>
                        <h3 className="text-3xl font-black text-white py-2">{pendingCount}</h3>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold text-right pt-2 border-t border-amber-500/10">Aguardando geração</p>
                    </div>
                    <div className="premium-card bg-rose-500/5 border-rose-500/20">
                        <p className="text-[12px] font-black text-rose-500 uppercase tracking-widest">Alerta Clínico</p>
                        <h3 className="text-3xl font-black text-white py-2">0</h3>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold text-right pt-2 border-t border-rose-500/10">Sem dados clínicos salvos</p>
                    </div>
                </div>

                <div className="premium-card p-0 overflow-hidden">
                    <div className="p-6 border-b border-premium-border flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Últimas Atualizações</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-zinc-900 border border-premium-border rounded-xl text-[12px] font-bold text-secondary-text hover:text-white transition-all">FILTRAR POR ARTISTA</button>
                        </div>
                    </div>
                    <div className="divide-y divide-premium-border">
                        {anamnesisPrintHistory.length > 0 ? anamnesisPrintHistory.slice(0, 10).map((r) => (
                            <div key={r.id} className="p-6 flex items-center justify-between group hover:bg-zinc-900/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-premium-border flex items-center justify-center text-lg font-bold text-white">
                                        {r.clientName.charAt(0)}
                                    </div>
                                    <div>
                                        <Link href={`/dashboard/clients/${r.clientId}`} className="text-white font-bold hover:text-gold-polished transition-colors block underline-offset-4 hover:underline">{r.clientName}</Link>
                                        <p className="text-[12px] text-secondary-text uppercase tracking-widest">
                                            Atualizado em {new Date(r.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedClientId(r.clientId);
                                            handlePrint();
                                        }}
                                        className="px-4 py-2 bg-zinc-800 text-secondary-text rounded-xl text-[12px] font-black uppercase hover:text-white hover:bg-gold-polished/20 transition-all flex items-center gap-3"
                                    >
                                        <Printer className="w-3.5 h-3.5" /> Imprimir Anamnese
                                    </button>
                                    <button className="p-2 bg-zinc-800 text-secondary-text rounded-lg hover:text-white transition-all">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center opacity-50">
                                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500">Nenhuma ficha gerada ainda</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL NOVA FICHA */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-white uppercase italic">Anamnese de Impressão</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Selecionar Cliente</label>
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    >
                                        <option value="">Selecione um cliente...</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Motivo da Ficha</label>
                                    <select className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none">
                                        <option>Novo Procedimento</option>
                                        <option>Atualização Semestral</option>
                                        <option>Revisão Pós-Tattoo</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-gold-polished/5 border border-gold-polished/10 rounded-xl space-y-2">
                                    <p className="text-[12px] text-gold-polished font-bold uppercase leading-tight italic">
                                        * Ao gerar, o sistema abrirá o painel de impressão com os dados do cliente preenchidos para assinatura manual.
                                    </p>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                >
                                    <Printer className="w-5 h-5" /> Gerar para Impressão
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
