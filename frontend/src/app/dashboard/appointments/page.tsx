'use client';

import {
    Calendar,
    Filter,
    MoreHorizontal,
    Clock,
    User,
    Search,
    ArrowUpRight,
    MapPin,
    AlertCircle,
    X,
    CheckCircle2,
    CalendarCheck,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function AppointmentsPage() {
    const { appointments, clients, addAppointment, updateAppointmentStatus, deleteAppointment } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterTab, setFilterTab] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const [newApp, setNewApp] = useState({
        clientId: '',
        service: '',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        artist: 'Selecione o Artista',
        value: 0
    });

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.service.toLowerCase().includes(searchTerm.toLowerCase());

        const today = new Date().toISOString().split('T')[0];
        if (filterTab === 'Hoje') return matchesSearch && app.date === today;
        if (filterTab === 'Finalizados') return matchesSearch && app.status === 'FINISHED';
        if (filterTab === 'Cancelados') return matchesSearch && app.status === 'CANCELLED';
        return matchesSearch;
    });

    const handleCreateApp = () => {
        const client = clients.find(c => c.id === newApp.clientId);
        if (!client) return alert('Selecione um cliente!');

        addAppointment({
            ...newApp,
            clientName: client.name,
            status: 'PENDING'
        });
        setIsModalOpen(false);
        setNewApp({ clientId: '', service: '', date: new Date().toISOString().split('T')[0], time: '14:00', artist: 'Selecione o Artista', value: 0 });
    };

    return (
        <div className="space-y-8 animate-premium-fade">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Lista de Agendamentos</h1>
                    <p className="text-secondary-text text-sm font-medium">Controle detalhado de todas as sessões e compromissos.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente ou serviço..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 pl-12 text-sm text-white outline-none focus:border-gold-polished/40 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-premium flex items-center gap-2 font-black text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                        <Calendar className="w-4 h-4" /> Novo Agendamento
                    </button>
                </div>
            </div>

            <div className="premium-card p-0">
                <div className="p-6 border-b border-premium-border flex justify-between items-center bg-zinc-900/20">
                    <div className="flex gap-2">
                        {['Todos', 'Hoje', 'Finalizados', 'Cancelados'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${filterTab === tab ? 'bg-gold-polished text-black shadow-lg shadow-gold-polished/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-premium-border">
                    {filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
                        <div key={app.id} className="p-6 flex items-center justify-between group hover:bg-zinc-900/40 transition-all text-white">
                            <div className="flex items-center gap-8 flex-1">
                                <div className="text-center min-w-[80px]">
                                    <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">{new Date(app.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                                    <p className="text-2xl font-black text-white">{app.time}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-premium-border" />
                                <div>
                                    <Link href={`/dashboard/clients/${app.clientId}`} className="text-lg font-bold text-white hover:text-gold-polished transition-colors block italic tracking-tight">{app.clientName}</Link>
                                    <p className="text-[12px] text-zinc-500 uppercase tracking-widest font-black leading-tight">{app.service}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3 h-3 text-gold-polished" />
                                            <span className="text-[11px] font-bold text-secondary-text uppercase tracking-widest">{app.artist}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 text-zinc-600" />
                                            <span className="text-[11px] font-bold text-secondary-text uppercase tracking-widest">Sala principal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`px-4 py-1.5 text-[11px] font-black rounded-full uppercase tracking-[0.2em] border ${app.status === 'CONFIRMED' || app.status === 'FINISHED' ? 'bg-emerald-green/10 text-emerald-green border-emerald-green/20' :
                                    app.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                        app.status === 'WAITING_DEPOSIT' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                    }`}>
                                    {app.status === 'CONFIRMED' ? 'Confirmado' :
                                        app.status === 'FINISHED' ? 'Finalizado' :
                                            app.status === 'CANCELLED' ? 'Cancelado' :
                                                app.status === 'WAITING_DEPOSIT' ? 'Aguardando Sinal' : 'Pendente'}
                                </span>
                                <div className="relative group/menu">
                                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-secondary-text transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {/* DROPDOWN MENU */}
                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] overflow-hidden">
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => updateAppointmentStatus(app.id, 'CONFIRMED')}
                                                className="w-full text-left px-3 py-2 text-[12px] font-black uppercase text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar Sessão
                                            </button>
                                            <button
                                                onClick={() => updateAppointmentStatus(app.id, 'WAITING_DEPOSIT')}
                                                className="w-full text-left px-3 py-2 text-[12px] font-black uppercase text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <Clock className="w-3.5 h-3.5" /> Aguardando Sinal
                                            </button>
                                            <button
                                                onClick={() => updateAppointmentStatus(app.id, 'FINISHED')}
                                                className="w-full text-left px-3 py-2 text-[12px] font-black uppercase text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <CalendarCheck className="w-3.5 h-3.5" /> Finalizar Sessão
                                            </button>
                                            <div className="h-[1px] bg-white/5 my-1" />
                                            <button
                                                onClick={() => updateAppointmentStatus(app.id, 'CANCELLED')}
                                                className="w-full text-left px-3 py-2 text-[12px] font-black uppercase text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-3.5 h-3.5" /> Cancelar Agendamento
                                            </button>
                                            <div className="h-[1px] bg-white/5 my-1" />
                                            <button
                                                onClick={() => {
                                                    if (confirm('Deseja excluir permanentemente este agendamento?')) {
                                                        deleteAppointment(app.id);
                                                    }
                                                }}
                                                className="w-full text-left px-3 py-2 text-[12px] font-black uppercase text-rose-600 hover:bg-rose-600/10 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Excluir Registro
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center opacity-30">
                            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                            <p className="text-sm font-black uppercase tracking-widest">Nenhum agendamento encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6 text-white text-xl font-black uppercase italic">
                            <h3>Novo Agendamento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Cliente</label>
                                <input type="text" placeholder="Nome do cliente..." className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Data</label>
                                    <input type="date" className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Horário</label>
                                    <input type="time" className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Artista Responsável</label>
                                <select className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none">
                                    <option>Selecione o Artista</option>
                                    <option>Artista 1</option>
                                    <option>Recepção</option>
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    alert('Agendamento realizado com sucesso!');
                                }}
                                className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" /> Confirmar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
