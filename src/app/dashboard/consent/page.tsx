'use client';

import {
    ShieldAlert,
    FileSignature,
    History,
    CheckCircle2,
    Printer,
    Search,
    User,
    Clock,
    X,
    ClipboardCheck,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function ConsentPage() {
    const { consentTerms, consentPrintHistory, clients, recordConsentPrint, deleteConsentTerm, updateConsentTerm } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState('');
    const [newTerm, setNewTerm] = useState({ name: 'Consentimento Geral Tatuagem', version: 'v1.0' });
    const [editForm, setEditForm] = useState({ name: '', version: '' });
    const [selectedClientId, setSelectedClientId] = useState('');
    const [showPrintView, setShowPrintView] = useState(false);

    const client = clients.find(c => c.id === selectedClientId);

    const handlePrint = () => {
        if (!selectedClientId) return alert('Selecione um cliente primeiro!');
        recordConsentPrint({ termName: newTerm.name, termVersion: newTerm.version, clientId: selectedClientId });
        setShowPrintView(true);
        setTimeout(() => {
            window.print();
            setShowPrintView(false);
            setIsModalOpen(false);
        }, 100);
    };

    const handleManageClick = (termId: string) => {
        const term = consentTerms.find(t => t.id === termId);
        if (term) {
            setSelectedTermId(termId);
            setEditForm({ name: term.name, version: term.version });
            setIsEditModalOpen(true);
        }
    };

    const handleUpdateTerm = () => {
        updateConsentTerm(selectedTermId, editForm);
        setIsEditModalOpen(false);
    };

    const handleDeleteTerm = () => {
        if (confirm('Tem certeza que deseja excluir este modelo de termo?')) {
            deleteConsentTerm(selectedTermId);
            setIsEditModalOpen(false);
        }
    };

    return (
        <div className="space-y-8 animate-premium-fade relative">
            {/* PRINT VIEW (Hidden on screen unless printing) */}
            <div className={`fixed inset-0 bg-white z-[9999] p-12 text-black overflow-y-auto ${showPrintView ? 'block' : 'hidden print:block'}`}>
                <div className="max-w-3xl mx-auto space-y-8 font-serif leading-relaxed">
                    {/* Header */}
                    <div className="text-center border-b-2 border-black pb-6">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">INKFLOW STUDIO</h1>
                        <p className="text-[12px] uppercase font-bold tracking-widest mt-1">Termo de Consentimento & Responsabilidade</p>
                    </div>

                    {/* Client Info */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                            <p><strong>Nome:</strong> {client?.name || '__________________________'}</p>
                            <p><strong>WhatsApp:</strong> {client?.phone || '__________________________'}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                            <p><strong>Documento:</strong> {newTerm.name}</p>
                        </div>
                    </div>

                    {/* Term Content */}
                    <div className="space-y-6">
                        <section className="space-y-2">
                            <h3 className="font-bold uppercase text-sm">1. Natureza do Procedimento</h3>
                            <p className="text-xs text-justify">Pelo presente instrumento, o(a) CLIENTE declara estar ciente de que o procedimento de tatuagem é de caráter definitivo e irreversível sem intervenções a laser, consistindo na introdução de pigmentos na derme por meio de agulhas estéreis.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-bold uppercase text-sm">2. Riscos e Cicatrização</h3>
                            <p className="text-xs text-justify">O(A) CLIENTE declara possuir plena consciência dos riscos inerentes ao procedimento, incluindo, mas não se limitando a: reações alérgicas aos pigmentos, processos inflamatórios, infecções caso os cuidados pós-tatuagem não sejam seguidos rigorosamente, e variações na pigmentação conforme o biotipo cutâneo.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-bold uppercase text-sm">3. Declaração de Saúde</h3>
                            <p className="text-xs text-justify">O(A) CLIENTE afirma não ser portador(a) de doenças infectocontagiosas (Hepatite, HIV), não possuir histórico de reações anafiláticas graves e não estar sob efeito de álcool ou substâncias psicotrópicas no momento do atendimento.</p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-bold uppercase text-sm">4. Uso de Imagem</h3>
                            <p className="text-xs text-justify">Fica autorizado o uso de registros fotográficos e audiovisuais do procedimento e da arte finalizada para fins de divulgação em portfólios, redes sociais e material publicitário do estúdio {new Date().getFullYear()}.</p>
                        </section>
                    </div>

                    {/* Signatures */}
                    <div className="pt-20 grid grid-cols-2 gap-12">
                        <div className="text-center space-y-2">
                            <div className="border-t border-black w-full" />
                            <p className="text-[12px] uppercase font-bold">Assinatura do Cliente</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="border-t border-black w-full" />
                            <p className="text-[12px] uppercase font-bold text-center">Assinatura do Profissional</p>
                        </div>
                    </div>

                    <div className="pt-12 text-[8px] text-center opacity-50">
                        Documento gerado eletronicamente por Inkflow CRM - {new Date().toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>

            <div className="print:hidden space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Termos de Consentimento</h1>
                        <p className="text-secondary-text text-sm font-medium">Gestão de termos de conformidade e prontuários para impressão.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-3 bg-premium-card border border-premium-border rounded-xl text-secondary-text hover:text-gold-polished transition-all">
                            <History className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-premium flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                        >
                            <FileSignature className="w-4 h-4" /> Novo Documento
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ACTIVE TERMS */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Modelos Ativos</h2>
                        <div className="space-y-4">
                            {consentTerms.map((doc) => (
                                <div key={doc.id} className="premium-card group hover:border-gold-polished/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gold-polished/10 rounded-xl">
                                            <FileSignature className="w-6 h-6 text-gold-polished" />
                                        </div>
                                        <span className="text-[12px] font-black text-zinc-600 uppercase tracking-widest">{doc.version}</span>
                                    </div>
                                    <h3 className="text-white font-bold group-hover:text-gold-polished transition-colors">{doc.name}</h3>
                                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-premium-border/50">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-green" />
                                            <span className="text-[12px] font-black text-secondary-text uppercase tracking-widest">{doc.signedCount} Impressões</span>
                                        </div>
                                        <button
                                            onClick={() => handleManageClick(doc.id)}
                                            className="text-[12px] font-black text-gold-polished uppercase tracking-widest hover:underline"
                                        >
                                            Gerenciar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECENT SIGNATURES */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Histórico de Impressão</h2>
                        <div className="premium-card p-0 overflow-hidden">
                            <div className="divide-y divide-premium-border">
                                {consentPrintHistory.length > 0 ? consentPrintHistory.slice(0, 10).map((r) => (
                                    <div key={r.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                                                <User className="w-4 h-4 text-zinc-600" />
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/clients/${r.clientId}`} className="text-xs font-bold text-white hover:text-gold-polished transition-colors block">{r.clientName}</Link>
                                                <p className="text-[11px] text-zinc-500 uppercase tracking-widest">{r.termName} {r.termVersion}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] text-zinc-600 font-black uppercase italic">
                                                {new Date(r.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedClientId(r.clientId);
                                                    setNewTerm({ name: r.termName, version: r.termVersion });
                                                    handlePrint();
                                                }}
                                                className="p-2 hover:bg-zinc-800 rounded-lg text-secondary-text transition-all hover:text-white"
                                                title="Reimprimir"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center opacity-50">
                                        <p className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500">Nenhuma impressão registrada ainda</p>
                                    </div>
                                )}
                            </div>
                            <button className="w-full p-4 text-[12px] font-black text-gold-polished uppercase tracking-[0.2em] bg-zinc-900/50 hover:bg-zinc-900 transition-all">Ver Todos os Registros</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Gerar Termo para Impressão</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Selecionar Modelo</label>
                                <select
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    value={newTerm.name}
                                    onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                                >
                                    <option value="Consentimento Geral Tatuagem">Consentimento Geral Tatuagem</option>
                                    <option value="Uso de Imagem & Divulgação">Uso de Imagem & Divulgação</option>
                                    <option value="Pós-Procedimento Care">Pós-Procedimento Care</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Vincular a Cliente</label>
                                <select
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    <option value="">Selecione um cliente...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handlePrint}
                                    className="btn-premium w-full py-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                >
                                    <Printer className="w-5 h-5" /> Gerar para Impressão
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT TERM MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Gerenciar Modelo</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Nome do Modelo</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Versão</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    value={editForm.version}
                                    onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button
                                    onClick={handleDeleteTerm}
                                    className="border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 py-4 rounded-xl font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-2 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" /> Excluir
                                </button>
                                <button
                                    onClick={handleUpdateTerm}
                                    className="btn-premium py-4 font-black uppercase text-[12px] tracking-widest"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
