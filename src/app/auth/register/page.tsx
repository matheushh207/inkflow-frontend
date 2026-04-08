'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studioName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Criar sua Conta InkFlow</h1>
                <p className="text-zinc-500 text-center mb-8">Comece a gerir seu estúdio hoje mesmo</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Seu Nome</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                            placeholder="Ex: Matheus Oliveira"
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Nome do Estúdio</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                            placeholder="Ex: Inked Art Studio"
                            onChange={e => setFormData({...formData, studioName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                            placeholder="seu@email.com"
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">Senha</label>
                        <input 
                            type="password" 
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                            placeholder="••••••••"
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors mt-4">
                        Criar Estúdio
                    </button>
                </form>
                <p className="text-zinc-500 text-sm text-center mt-6">
                    Já tem conta? <a href="/login" className="text-yellow-500 hover:underline">Entre aqui</a>
                </p>
            </div>
        </div>
    );
}
