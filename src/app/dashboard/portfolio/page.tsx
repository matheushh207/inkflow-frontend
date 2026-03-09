'use client';

import {
    Image as ImageIcon,
    Plus,
    MoreHorizontal,
    Heart,
    Eye,
    Palette,
    X,
    Upload
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import ImageUpload from '@/components/ImageUpload';

export default function PortfolioPage() {
    const { portfolio, addPortfolioItem, deletePortfolioItem, updatePortfolioItem } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [likedItems, setLikedItems] = useState<string[]>([]);

    const [newArtwork, setNewArtwork] = useState({
        title: '',
        artist: 'Selecione o Artista',
        imageUrl: ''
    });

    const [editForm, setEditForm] = useState({
        title: '',
        artist: '',
        isVisible: true
    });


    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleManageClick = (item: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedItemId(item.id);
        setEditForm({
            title: item.title,
            artist: item.artist,
            isVisible: item.isVisible
        });
        setIsManageModalOpen(true);
    };

    const handleUpdateItem = () => {
        updatePortfolioItem(selectedItemId, editForm);
        setIsManageModalOpen(false);
    };

    const handleDeleteItem = () => {
        if (confirm('Deseja realmente remover esta obra do portfólio?')) {
            deletePortfolioItem(selectedItemId);
            setIsManageModalOpen(false);
        }
    };

    const handlePublish = () => {
        if (!newArtwork.title || !newArtwork.imageUrl) {
            return alert('Por favor, preencha o título e selecione uma imagem.');
        }

        addPortfolioItem({
            title: newArtwork.title,
            artist: newArtwork.artist,
            imageUrl: newArtwork.imageUrl
        });

        setIsModalOpen(false);
        setNewArtwork({ title: '', artist: 'Selecione o Artista', imageUrl: '' });
    };

    return (
        <div className="space-y-8 animate-premium-fade">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Portfólio</h1>
                    <p className="text-secondary-text text-sm font-medium">Vitrine de trabalhos realizados e curadoria de arte do estúdio.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-premium flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                >
                    <Plus className="w-4 h-4" /> Upload de Trabalho
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {portfolio.map((item) => (
                    <div key={item.id} className="premium-card p-0 overflow-hidden group hover:border-gold-polished/30 transition-all cursor-pointer relative">
                        {!item.isVisible && (
                            <div className="absolute top-3 left-3 z-[20] px-2 py-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                <Eye className="w-4 h-4 text-zinc-500" /> Oculto
                            </div>
                        )}
                        <div className="aspect-square bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!item.isVisible ? 'opacity-40 grayscale' : ''}`} />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-zinc-800" />
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-10">
                                <div className="flex gap-4">
                                    <button
                                        onClick={(e) => handleManageClick(item, e)}
                                        className="p-3 bg-white/10 hover:bg-gold-polished/20 rounded-full transition-all backdrop-blur-md text-white hover:text-gold-polished"
                                    >
                                        <Palette className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => toggleLike(item.id, e)}
                                        className={`p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md ${likedItems.includes(item.id) ? 'text-rose-500' : 'text-zinc-400 font-bold'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => handleManageClick(item, e)}
                                    className="text-[12px] font-black text-white uppercase tracking-widest hover:underline"
                                >
                                    Gerenciar Obra
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`text-white font-bold text-base group-hover:text-gold-polished transition-colors ${!item.isVisible ? 'opacity-50' : ''}`}>{item.title}</h4>
                                    <p className="text-[12px] text-zinc-500 uppercase tracking-widest">{item.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-premium-border/50">
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-zinc-500 uppercase">
                                    <Eye className="w-4 h-4" /> {item.views}
                                </div>
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-zinc-500 uppercase">
                                    <Heart className="w-4 h-4" /> {item.likes}
                                </div>
                                <span className="ml-auto text-[11px] font-black text-zinc-700 uppercase italic">{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ADD NEW CARD */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="premium-card border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center gap-4 min-h-[350px] hover:border-gold-polished/40 transition-all group cursor-pointer"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-gold-polished/10 transition-colors">
                        <Plus className="w-8 h-8 text-zinc-800 group-hover:text-gold-polished" />
                    </div>
                    <p className="text-xs font-black text-zinc-700 uppercase tracking-widest group-hover:text-white transition-colors">Adicionar Nova Obra</p>
                </div>
            </div>

            {/* MODAL UPLOAD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Novo Upload</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <ImageUpload
                                label="Arte do Projeto"
                                maxFiles={1}
                                onImagesChange={(imgs) => setNewArtwork({ ...newArtwork, imageUrl: imgs[0] })}
                                value={newArtwork.imageUrl ? [newArtwork.imageUrl] : []}
                            />

                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Título do Projeto</label>
                                <input
                                    type="text"
                                    placeholder="Nome da obra..."
                                    value={newArtwork.title}
                                    onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Artista Responsável</label>
                                <select
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                    value={newArtwork.artist}
                                    onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                                >
                                    <option>Selecione o Artista</option>
                                    <option>Artista 1</option>
                                    <option>Recepção</option>
                                </select>
                            </div>
                            <button
                                onClick={handlePublish}
                                className="btn-premium w-full py-4 mt-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                <ImageIcon className="w-5 h-5" /> Publicar na Vitrine
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MANAGE */}
            {isManageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsManageModalOpen(false)} />
                    <div className="premium-card w-full max-w-md relative z-10 border-gold-polished/20 animate-premium-pop overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase italic">Gerenciar Obra</h3>
                            <button onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-secondary-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-black text-gold-polished uppercase tracking-widest block mb-1.5">Título do Projeto</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full bg-zinc-900 border border-premium-border rounded-xl p-3 text-base text-white focus:border-gold-polished transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-premium-border">
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-widest">Mostrar no Portfolio</p>
                                    <p className="text-[11px] text-zinc-500 uppercase font-black">Controla se a arte aparece na Reserva Online</p>
                                </div>
                                <button
                                    onClick={() => setEditForm({ ...editForm, isVisible: !editForm.isVisible })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${editForm.isVisible ? 'bg-gold-polished' : 'bg-zinc-800'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.isVisible ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button
                                    onClick={handleDeleteItem}
                                    className="border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 py-4 rounded-xl font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-2 transition-all"
                                >
                                    Remover Obra
                                </button>
                                <button
                                    onClick={handleUpdateItem}
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
