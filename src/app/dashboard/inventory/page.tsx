'use client';

import { useState } from 'react';
import {
    Package,
    Plus,
    Search,
    AlertTriangle,
    ArrowRight,
    History,
    Filter,
    MoreHorizontal,
    Box,
    Check,
    Trash2
} from 'lucide-react';

import { useStore } from '@/context/StoreContext';

export default function InventoryPage() {
    const { inventory, updateInventory, addInventoryItem, deleteInventoryItem } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Materiais',
        stock: 0,
        minStock: 5,
        unit: 'un'
    });

    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string, name: string, unit: string } | null>(null);
    const [restockAmount, setRestockAmount] = useState(1);

    const handleRestockClick = (id: string, name: string, unit: string) => {
        setSelectedItem({ id, name, unit });
        setRestockAmount(1);
        setIsRestockModalOpen(true);
    };

    const confirmRestock = () => {
        if (!selectedItem || restockAmount <= 0) return;
        updateInventory(selectedItem.id, restockAmount);
        setIsRestockModalOpen(false);
        alert(`Reabastecimento de ${restockAmount} ${selectedItem.unit}(s) de ${selectedItem.name} concluído!`);
    };

    const handleAddItem = () => {
        if (!newItem.name) return alert('Nome é obrigatório!');
        addInventoryItem(newItem);
        setIsModalOpen(false);
        setNewItem({ name: '', category: 'Materiais', stock: 0, minStock: 5, unit: 'un' });
        alert('Novo suprimento cadastrado!');
    };

    const filteredInventory = inventory.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-premium-fade">
            <div className="flex justify-between items-center text-white">
                <div>
                    <h3 className="text-xl font-black uppercase border-l-4 border-gold-polished pl-4">Suprimentos</h3>
                    <p className="text-[12px] text-zinc-500 font-bold uppercase mt-1">Gestão de Insumos em Tempo Real</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar suprimento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-gold-polished transition-all outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-premium px-4 py-2 text-[12px] items-center gap-2 flex"
                    >
                        <Plus className="w-4 h-4" /> Novo Item
                    </button>
                    <div className="text-[12px] font-black px-3 py-2 bg-rose-500/10 text-rose-500 rounded border border-rose-500/20 uppercase tracking-widest">
                        Alerta: {inventory.filter(i => i.stock <= i.minStock).length} Itens Baixos
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                    <div key={item.id} className="p-5 premium-card group bg-[#0D0D0D] border-white/5 hover:border-gold-polished/20 transition-all space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${item.stock <= item.minStock / 2 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                    item.stock <= item.minStock ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-zinc-900 text-zinc-500 border-white/5 group-hover:text-gold-polished'
                                    }`}>
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-white group-hover:text-gold-polished transition-colors uppercase tracking-tight italic">{item.name}</h4>
                                    <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">{item.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRestockClick(item.id, item.name, item.unit)}
                                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-gold-polished hover:text-black transition-all border border-white/5 hover:border-transparent"
                                title="Repor Estoque"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
                                        deleteInventoryItem(item.id);
                                    }
                                }}
                                className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 hover:border-transparent text-rose-500"
                                title="Excluir Item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status do Item</p>
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${item.stock <= item.minStock / 2 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                    item.stock <= item.minStock ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    }`}>
                                    {item.stock <= item.minStock / 2 ? 'Crítico' : item.stock <= item.minStock ? 'Baixo' : 'Em Dia'}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-1">Quantidade</p>
                                <p className="text-2xl font-black text-white italic">
                                    {item.stock} <span className="text-sm text-zinc-600 uppercase not-italic">{item.unit}</span>
                                </p>
                            </div>
                        </div>

                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${item.stock <= item.minStock / 2 ? 'bg-rose-500' :
                                    item.stock <= item.minStock ? 'bg-amber-500' : 'bg-gold-polished'
                                    }`}
                                style={{ width: `${Math.min(100, (item.stock / (item.minStock * 2)) * 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* NEW ITEM MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Novo Suprimento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <Package className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Nome do Item</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Agulhas RL 03"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Categoria</label>
                                    <select
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                    >
                                        <option>Materiais</option>
                                        <option>Tintas</option>
                                        <option>Agulhas</option>
                                        <option>Higiene</option>
                                        <option>Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Unidade</label>
                                    <select
                                        value={newItem.unit}
                                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                    >
                                        <option>un</option>
                                        <option>cx</option>
                                        <option>frasco</option>
                                        <option>pacote</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Estoque Inicial</label>
                                    <input
                                        type="number"
                                        value={newItem.stock}
                                        onChange={e => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Estoque Mínimo</label>
                                    <input
                                        type="number"
                                        value={newItem.minStock}
                                        onChange={e => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                                        className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={handleAddItem}
                                    className="flex-1 py-4 bg-gold-polished text-black text-[12px] font-black uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Cadastrar Suprimento
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-4 bg-zinc-800 text-white text-[12px] font-black uppercase rounded-xl hover:bg-zinc-700 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* RESTOCK MODAL */}
            {isRestockModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsRestockModalOpen(false)} />
                    <div className="premium-card w-full max-w-sm relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden bg-[#0D0D0D]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Repor Estoque</h3>
                            <button onClick={() => setIsRestockModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <Box className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-1">Item selecionado</p>
                                <h4 className="text-lg font-black text-white uppercase italic">{selectedItem.name}</h4>
                            </div>

                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block text-center mb-4">Quantidade para Adicionar</label>
                                <div className="flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => setRestockAmount(Math.max(1, restockAmount - 1))}
                                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-all border border-white/5"
                                    >
                                        <span className="text-2xl font-black">-</span>
                                    </button>

                                    <div className="text-center">
                                        <input
                                            type="number"
                                            value={restockAmount}
                                            onChange={e => setRestockAmount(Math.max(1, Number(e.target.value)))}
                                            className="bg-transparent text-4xl font-black text-white w-24 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <p className="text-[12px] font-black text-zinc-600 uppercase tracking-widest mt-1">{selectedItem.unit}(s)</p>
                                    </div>

                                    <button
                                        onClick={() => setRestockAmount(restockAmount + 1)}
                                        className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-all border border-white/5"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={confirmRestock}
                                    className="flex-1 py-4 bg-gold-polished text-black text-[12px] font-black uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Confirmar Entrada
                                </button>
                                <button
                                    onClick={() => setIsRestockModalOpen(false)}
                                    className="px-6 py-4 bg-zinc-800 text-white text-[12px] font-black uppercase rounded-xl hover:bg-zinc-700 transition-all"
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
