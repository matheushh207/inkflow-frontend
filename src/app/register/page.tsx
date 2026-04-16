'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    User,
    Mail,
    Phone,
    Lock,
    Home,
    Search,
    CreditCard,
    ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        studioName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        plan: 'Solo'
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inkflow-backend-90nn.onrender.com';
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name, // Nome real do responsável
                    email: formData.email,
                    password: formData.password,
                    studioName: formData.studioName,
                    planName: formData.plan
                }),
            });

            if (response.ok) {
                alert('Conta criada com sucesso! Redirecionando para o login...');
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.message || 'Erro ao criar conta.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full stipple-bg opacity-10 pointer-events-none" />
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-gold-polished/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Logo */}
            <div className="mb-8 relative z-10">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="InkFlow Logo"
                        width={200}
                        height={60}
                        className="logo-alpha"
                    />
                </Link>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-[550px] premium-card bg-[#151515] border-white/5 shadow-2xl relative z-10 animate-premium-fade">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Criar Conta</h1>
                    <p className="text-secondary-text font-black uppercase tracking-widest text-[10px]">
                        Não tem uma conta? <span className="text-gold-polished">Cadastre-se! 5 Dias Grátis!</span>
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup 
                            icon={Home} 
                            placeholder="Nome do Estúdio..." 
                            name="studioName" 
                            value={formData.studioName} 
                            onChange={handleChange} 
                        />
                        <InputGroup 
                            icon={User} 
                            placeholder="Nome do Responsável..." 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup 
                            icon={Mail} 
                            placeholder="E-mail..." 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        <InputGroup 
                            icon={Phone} 
                            placeholder="WhatsApp (Ex: 11999999999)" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup 
                            icon={Lock} 
                            placeholder="Senha..." 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                        <InputGroup 
                            icon={Lock} 
                            placeholder="Confirmar Senha..." 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                        <SelectGroup 
                            icon={CreditCard} 
                            label="Plano" 
                            name="plan" 
                            value={formData.plan} 
                            onChange={handleChange}
                        >
                            <option value="Solo" className="bg-[#1A1A1A]">Plano Solo (1 Profissional)</option>
                            <option value="Professional" className="bg-[#1A1A1A]">Plano Profissional (Até 3 Tatuadores)</option>
                            <option value="Elite" className="bg-[#1A1A1A]">Plano Elite (Até 10 Tatuadores)</option>
                        </SelectGroup>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn-premium w-full py-5 text-lg flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                        {isLoading ? 'CADASTRANDO...' : 'CADASTRAR CONTA'}
                        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <p className="text-center mt-6">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-text hover:text-gold-polished transition-all">
                            Já possui conta? <span className="text-white border-b border-white/20">Fazer Login</span>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

function InputGroup({ icon: Icon, placeholder, name, value, onChange, type = "text" }: any) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold-polished transition-colors">
                <Icon size={18} />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-[#1A1A1A] border border-premium-border rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-gold-polished focus:ring-1 focus:ring-gold-polished/20 transition-all placeholder:text-zinc-600 italic text-white"
                required
            />
        </div>
    );
}

function SelectGroup({ icon: Icon, label, name, value, onChange, children }: any) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold-polished transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <select 
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-[#1A1A1A] border border-premium-border rounded-xl py-4 pl-12 pr-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold-polished focus:ring-1 focus:ring-gold-polished/20 transition-all appearance-none cursor-pointer text-white"
            >
                {children}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
