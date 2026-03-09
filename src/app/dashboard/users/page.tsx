'use client';

import {
    Users,
    UserPlus,
    ShieldCheck,
    Key,
    Trash2,
    Edit3,
    MoreHorizontal,
    Zap,
    Clock,
    X,
    UserCheck
} from 'lucide-react';
import { useState } from 'react';
import { useStore, TeamMember } from '@/context/StoreContext';

export default function UsersPage() {
    const { team, addTeamMember, deleteTeamMember, updateTeamMember } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Artista' as const, commission: 40 });

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Tem certeza que deseja remover ${name} da equipe?`)) {
            deleteTeamMember(id);
        }
    };

    const handleInvite = () => {
        if (!newMember.name || !newMember.email) {
            alert('Nome e E-mail são obrigatórios!');
            return;
        }
        addTeamMember({
            ...newMember,
            status: 'Ativo'
        });
        setIsModalOpen(false);
        setNewMember({ name: '', email: '', role: 'Artista', commission: 40 });
        alert('Convite enviado com sucesso! O novo membro receberá as instruções por e-mail.');
    };

    const handleUpdate = () => {
        if (!selectedMember) return;
        updateTeamMember(selectedMember.id, selectedMember);
        setIsEditModalOpen(false);
        alert('Dados do membro atualizados!');
    };

    return (
        <div className="space-y-6 animate-premium-fade">
            <div className="flex justify-between items-center text-white">
                <div>
                    <h3 className="text-xl font-black uppercase border-l-4 border-gold-polished pl-4">Time</h3>
                    <p className="text-[12px] text-zinc-500 font-bold uppercase mt-1">Gestão de Colaboradores e Acessos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gold-polished text-black text-[12px] font-black uppercase rounded hover:bg-white transition-all flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" /> Convidar
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {team.map((member) => (
                    <div key={member.id} className="p-4 premium-card flex justify-between items-center group bg-[#0D0D0D] border-white/5 hover:border-gold-polished/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5 group-hover:text-gold-polished group-hover:border-gold-polished/20 transition-all font-black text-sm uppercase">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white group-hover:text-gold-polished transition-colors uppercase tracking-tight">{member.name}</h4>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${member.status === 'Ativo' ? 'text-zinc-600' : 'text-rose-500'}`}>
                                    {member.role} {' // '} {member.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-white">{member.commission}%</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Comissão</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-white">{member.appointmentsCount}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Sessões</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(member.id, member.name)}
                                    className="p-2 hover:bg-rose-500/10 rounded-lg transition-all text-rose-500/50 hover:text-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedMember(member);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="text-[11px] font-black text-gold-polished hover:text-white uppercase tracking-widest transition-all px-3 py-2 bg-white/5 rounded"
                                >
                                    Gerenciar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL CONVIDAR */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Convidar para Equipe</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Nome do Membro</label>
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={newMember.name}
                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="ex@inkflow.app"
                                        value={newMember.email}
                                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Comissão (%)</label>
                                    <input
                                        type="number"
                                        value={newMember.commission}
                                        onChange={e => setNewMember({ ...newMember, commission: Number(e.target.value) })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Papel / Acesso</label>
                                <select
                                    value={newMember.role}
                                    onChange={e => setNewMember({ ...newMember, role: e.target.value as any })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                >
                                    <option value="Artista">Artista (Tatuador)</option>
                                    <option value="Administrador">Gestor de Estúdio</option>
                                    <option value="Suporte">Suporte / Recepção</option>
                                </select>
                            </div>
                            <button
                                onClick={handleInvite}
                                className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                <UserCheck className="w-5 h-5" /> Enviar Convite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GERENCIAR */}
            {isEditModalOpen && selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Gerenciar Membro</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-gold-polished/10 flex items-center justify-center text-gold-polished border border-gold-polished/20 font-black">
                                    {selectedMember.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase italic">{selectedMember.name}</h4>
                                    <p className="text-[12px] text-zinc-500 font-bold uppercase">{selectedMember.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Comissão (%)</label>
                                    <input
                                        type="number"
                                        value={selectedMember.commission}
                                        onChange={e => setSelectedMember({ ...selectedMember, commission: Number(e.target.value) })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Status</label>
                                    <select
                                        value={selectedMember.status}
                                        onChange={e => setSelectedMember({ ...selectedMember, status: e.target.value as any })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Papel / Permissões</label>
                                <select
                                    value={selectedMember.role}
                                    onChange={e => setSelectedMember({ ...selectedMember, role: e.target.value as any })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-sm text-white focus:border-gold-polished transition-all outline-none"
                                >
                                    <option value="Artista">Artista (Tatuador)</option>
                                    <option value="Administrador">Gestor de Estúdio</option>
                                    <option value="Suporte">Suporte / Recepção</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 py-4 bg-gold-polished text-black text-[11px] font-black uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                                >
                                    <UserCheck className="w-5 h-5" /> Salvar Alterações
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-6 py-4 bg-zinc-800 text-white text-[11px] font-black uppercase rounded-xl hover:bg-zinc-700 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
