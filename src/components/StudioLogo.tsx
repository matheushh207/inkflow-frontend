'use client';

import React from 'react';

interface StudioLogoProps {
    logoUrl?: string;
    studioName?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function StudioLogo({ logoUrl, studioName = 'Studio', size = 'md', className = '' }: StudioLogoProps) {
    // Extract initials: up to 2 characters
    const getInitials = (name: string) => {
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) {
            // Se for composto, pega a inicial de cada um dos dois primeiros nomes
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        // Se for simples, pega apenas a inicial
        return name.charAt(0).toUpperCase();
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xl',
        md: 'w-12 h-12 text-2xl',
        lg: 'w-20 h-20 text-4xl',
        xl: 'w-32 h-32 text-6xl'
    };

    if (logoUrl) {
        return (
            <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-zinc-900 ${sizeClasses[size]} ${className}`}>
                <img 
                    src={logoUrl} 
                    alt={studioName} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('is-fallback');
                    }}
                />
                <style jsx>{`
                    .is-fallback::after {
                        content: "${getInitials(studioName)}";
                        font-family: var(--font-gothic), serif;
                        color: var(--accent-secondary, #FFD700);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div 
            className={`flex items-center justify-center rounded-xl border border-gold-polished/20 bg-gold-polished/10 text-gold-polished shadow-lg shadow-gold-polished/5 ${sizeClasses[size]} ${className}`}
            style={{ fontFamily: 'var(--font-gothic), serif' }}
        >
            {getInitials(studioName)}
        </div>
    );
}
