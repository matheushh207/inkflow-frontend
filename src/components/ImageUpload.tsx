'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    onImagesChange: (images: string[]) => void;
    maxFiles?: number;
    value?: string[];
    label?: string;
}

export default function ImageUpload({ onImagesChange, maxFiles = 3, value = [], label }: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(value);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreviews(value);
    }, [value]);

    const handleFiles = (files: FileList | File[]) => {
        const remainingSlots = maxFiles - previews.length;
        if (remainingSlots <= 0) return;

        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newPreviews = [...previews, base64String];
                setPreviews(newPreviews);
                onImagesChange(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removeImage = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        onImagesChange(newPreviews);
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-[10px] font-black text-gold-polished uppercase tracking-widest block mb-1">{label}</label>}

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group/upload
                    ${isDragging ? 'border-gold-polished bg-gold-polished/10' : 'border-premium-border bg-zinc-900/50 hover:bg-zinc-900 hover:border-gold-polished/40'}
                `}
            >
                <input
                    type="file"
                    multiple={maxFiles > 1}
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />

                <div className={`p-4 bg-zinc-900 rounded-2xl transition-colors ${isDragging ? 'text-gold-polished' : 'group-hover/upload:text-gold-polished'}`}>
                    <Upload className="w-8 h-8" />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-white uppercase tracking-widest">
                        {isDragging ? 'Solte para enviar' : (previews.length >= maxFiles ? 'Limite atingido' : 'Arraste ou clique')}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black mt-1">
                        {previews.length} de {maxFiles} imagens (PNG, JPG)
                    </p>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {previews.map((src, index) => (
                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-premium-border bg-zinc-900 group">
                            <img src={src} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                            <button
                                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-500 text-white rounded-lg transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
