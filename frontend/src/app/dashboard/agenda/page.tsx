'use client';

import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    MoreVertical,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    XCircle,
    X,
    ClipboardCheck,
    Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function AgendaPage() {
    const { clients, appointments, addAppointment } = useStore();
    const [view, setView] = useState<'day' | 'week' | 'month'>('day');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newAppointment, setNewAppointment] = useState({
        clientId: '',
        artist: 'Selecione o Artista',
        service: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        value: 0
    });

    const handleAddAppointment = () => {
        const client = clients.find(c => c.id === newAppointment.clientId);
        if (!client) {
            alert('Selecione um cliente!');
            return;
        }
        addAppointment({
            ...newAppointment,
            clientName: client.name,
            status: 'PENDING',
            value: Number(newAppointment.value)
        });
        setIsModalOpen(false);
        alert('Agendamento realizado com sucesso!');
    };

    return (
        <div className="space-y-6 animate-premium-fade">
            <div className="flex justify-between items-center text-white">
                <div>
                    <h3 className="text-xl font-black uppercase border-l-4 border-gold-polished pl-4">Agenda Inteligente</h3>
                    <p className="text-[12px] text-zinc-500 font-bold uppercase mt-1">Sincronização em tempo real ativada</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[12px] font-black px-3 py-2 bg-zinc-900 rounded border border-white/5 uppercase tracking-widest">
                        {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-gold-polished text-black text-[12px] font-black uppercase rounded hover:bg-white transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Novo Agendamento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 border border-white/5 rounded-xl overflow-hidden bg-zinc-900/20">
                {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const today = new Date().getDate();
                    const hasAppointments = appointments.some(app => new Date(app.date).getDate() === day);

                    return (
                        <div key={i} className={`aspect-square flex flex-col items-center justify-center border-[0.5px] border-white/5 relative group cursor-pointer hover:bg-white/5 transition-all ${day === today ? 'bg-gold-polished/20 text-gold-polished' : 'text-zinc-600'}`}>
                            <span className="text-[12px] font-black">{day}</span>
                            {hasAppointments && (
                                <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-gold-polished shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                            )}
                            {day === today && (
                                <span className="absolute top-1 right-1 text-[9px] font-black uppercase">Hoje</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4">
                <h4 className="text-[12px] font-black text-gold-polished uppercase tracking-[0.2em]">Próximas Sessões</h4>
                <div className="space-y-3">
                    {appointments.length > 0 ? appointments.map((app) => (
                        <div key={app.id} className="p-4 bg-white/5 rounded-2xl border-l-2 border-gold-polished flex justify-between items-center group hover:bg-white/10 transition-all">
                            <div>
                                <p className={`text-[10px] font-black uppercase mb-1 ${app.status === 'CONFIRMED' ? 'text-emerald-500' :
                                    app.status === 'WAITING_DEPOSIT' ? 'text-amber-500' : 'text-gold-polished'
                                    }`}>
                                    {app.time} {'//'} {app.status === 'CONFIRMED' ? 'Confirmado' : app.status === 'WAITING_DEPOSIT' ? 'Aguardando Sinal' : app.status}
                                </p>
                                <p className="text-base font-bold text-white uppercase group-hover:text-gold-polished transition-colors">{app.clientName} {'//'} {app.service}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-black text-white uppercase">{app.artist}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">R$ {app.value.toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center opacity-30 border border-dashed border-zinc-800 rounded-2xl">
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Nenhum agendamento encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL MOCK */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Novo Agendamento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-2">Cliente</label>
                                <select
                                    value={newAppointment.clientId}
                                    onChange={e => setNewAppointment({ ...newAppointment, clientId: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                >
                                    <option value="">Selecione um cliente...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-2">Serviço/Procedimento</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Blackwork Tatuagem"
                                    value={newAppointment.service}
                                    onChange={e => setNewAppointment({ ...newAppointment, service: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-2">Data</label>
                                    <input
                                        type="date"
                                        value={newAppointment.date}
                                        onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Hora</label>
                                    <input
                                        type="time"
                                        value={newAppointment.time}
                                        onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-2">Valor Estimado (R$)</label>
                                <input
                                    type="number"
                                    value={newAppointment.value}
                                    onChange={e => setNewAppointment({ ...newAppointment, value: Number(e.target.value) })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={handleAddAppointment}
                                className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                <ClipboardCheck className="w-5 h-5" /> Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
