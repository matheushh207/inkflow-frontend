'use client';

import {
    User,
    Calendar,
    DollarSign,
    ArrowLeft,
    Phone,
    Instagram,
    Mail,
    History,
    ShieldCheck,
    Image as ImageIcon,
    Clock,
    Plus,
    UserCircle,
    Edit3,
    Check,
    Trash2,
    X
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useParams } from 'next/navigation';

export default function ClientProfilePage() {
    const params = useParams();
    const { clients, appointments, updateClient } = useStore();
    const client = clients.find(c => c.id === params.id);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: ''
    });

    const openEditModal = () => {
        if (!client) return;
        setEditForm({
            name: client.name,
            phone: client.phone,
            email: client.email || '',
            instagram: client.instagram || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProfile = () => {
        if (!client) return;
        updateClient(client.id, editForm);
        setIsEditModalOpen(false);
    };

    const updateStatus = (newStatus: 'ACTIVE' | 'VIP' | 'RISK') => {
        if (!client) return;
        updateClient(client.id, { status: newStatus });
    };

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-premium-fade">
                <UserCircle className="w-20 h-20 text-zinc-800 mb-6" />
                <h2 className="text-2xl font-black text-white uppercase italic">Cliente não encontrado</h2>
                <Link href="/dashboard/clients" className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-white transition-all">Voltar para CRM</Link>
            </div>
        );
    }

    const clientAppointments = appointments.filter(app => app.clientId === client.id);

    return (
        <div className="space-y-8 animate-premium-fade">
            {/* BACK & HEADER */}
            <div className="flex flex-col gap-6">
                <Link href="/dashboard/clients" className="flex items-center gap-2 text-secondary-text hover:text-gold-polished transition-all w-fit group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Voltar para CRM</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-premium-border flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative">
                            {client.name.charAt(0)}
                            <div className={`absolute -bottom-2 -right-2 text-black text-[10px] font-black px-3 py-1 rounded-full ${client.status === 'VIP' ? 'bg-gold-polished' : 'bg-zinc-600 text-white'}`}>
                                {client.status}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{client.name}</h1>
                            <p className="text-secondary-text text-sm font-medium mt-1">Cliente • <span className="text-gold-polished">Registrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}</span></p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={openEditModal}
                            className="bg-zinc-900 border border-premium-border p-3 rounded-xl text-secondary-text hover:text-white transition-all"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <Link href="/dashboard/agenda" className="btn-premium flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                            <Calendar className="w-4 h-4" /> Novo Agendamento
                        </Link>
                    </div>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEFT COL: INFO */}
                <div className="space-y-6">
                    <div className="premium-card space-y-4">
                        <h3 className="text-[10px] font-black text-gold-polished uppercase tracking-[0.2em] mb-4">Informações</h3>
                        <div className="flex items-center gap-4 text-secondary-text">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-white">{client.phone}</span>
                        </div>
                        {client.instagram && (
                            <div className="flex items-center gap-4 text-secondary-text">
                                <Instagram className="w-4 h-4 text-pink-500" />
                                <span className="text-sm font-bold text-white">{client.instagram}</span>
                            </div>
                        )}
                        {client.email && (
                            <div className="flex items-center gap-4 text-secondary-text">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold text-white">{client.email}</span>
                            </div>
                        )}
                        <div className="divider opacity-10"></div>
                        <div className="flex items-center gap-4 text-secondary-text">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Anamnese OK</span>
                        </div>

                        <div className="divider opacity-10"></div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Classificação do Cliente</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => updateStatus('ACTIVE')}
                                    className={`py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${client.status === 'ACTIVE' ? 'bg-zinc-200 text-black border-zinc-200' : 'bg-transparent text-secondary-text border-white/5 hover:border-white/20'}`}
                                >
                                    Novo
                                </button>
                                <button
                                    onClick={() => updateStatus('VIP')}
                                    className={`py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${client.status === 'VIP' ? 'bg-gold-polished text-black border-gold-polished' : 'bg-transparent text-secondary-text border-white/5 hover:border-gold-polished/20'}`}
                                >
                                    VIP
                                </button>
                                <button
                                    onClick={() => updateStatus('RISK')}
                                    className={`py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${client.status === 'RISK' ? 'bg-rose-500 text-white border-rose-500' : 'bg-transparent text-secondary-text border-white/5 hover:border-rose-500/20'}`}
                                >
                                    Risco
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card bg-gold-polished/5 border-gold-polished/20">
                        <h3 className="text-[10px] font-black text-gold-polished uppercase tracking-[0.2em] mb-4">Métricas de Valor</h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[8px] font-bold text-zinc-500 uppercase">Gasto Total</p>
                                <p className="text-2xl font-black text-white">R$ {client.totalSpent.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-bold text-zinc-500 uppercase">Sessões</p>
                                <p className="text-2xl font-black text-white">{String(clientAppointments.length).padStart(2, '0')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE & RIGHT COL: HISTORY & GALLERY */}
                <div className="md:col-span-2 space-y-8">
                    {/* GALLERY PREVIEW */}
                    <div className="premium-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Galeria de Projetos</h3>
                            <button className="text-[10px] font-black text-gold-polished uppercase flex items-center gap-2 hover:underline">
                                <Plus className="w-3 h-3" /> Adicionar Foto
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-zinc-900 rounded-xl border border-premium-border overflow-hidden group relative">
                                    <div className="absolute inset-0 bg-gold-polished/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-full h-full stipple-bg opacity-10"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECENT TATTOOS */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <History className="w-4 h-4 text-gold-polished" /> Histórico de Agendamentos
                        </h3>
                        {clientAppointments.length > 0 ? clientAppointments.map((app) => (
                            <div key={app.id} className={`premium-card flex items-center justify-between group hover:bg-zinc-900/50 transition-all cursor-pointer border-l-4 ${app.status === 'FINISHED' ? 'border-l-emerald-500' :
                                app.status === 'CANCELLED' ? 'border-l-rose-500' : 'border-l-gold-polished'
                                }`}>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-xl border border-premium-border flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-gold-polished transition-colors">{app.service}</h4>
                                        <p className="text-[10px] text-secondary-text uppercase tracking-widest mt-1">{new Date(app.date).toLocaleDateString('pt-BR')} {'//'} {app.artist}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">R$ {app.value.toLocaleString('pt-BR')}</p>
                                    <p className={`text-[8px] font-bold uppercase tracking-widest ${app.status === 'FINISHED' ? 'text-emerald-500' :
                                        app.status === 'CANCELLED' ? 'text-rose-500' : 'text-amber-500'
                                        }`}>{app.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center opacity-30 border border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Nenhum agendamento para este cliente</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Editar Perfil</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Nome Completo</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Instagram</label>
                                    <input
                                        type="text"
                                        value={editForm.instagram}
                                        onChange={e => setEditForm({ ...editForm, instagram: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">E-mail</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={handleUpdateProfile}
                                className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
