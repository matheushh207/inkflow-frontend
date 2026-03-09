'use client';

import React from 'react';
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

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={Home} placeholder="Estúdio..." />
                        <InputGroup icon={Mail} placeholder="E-mail..." type="email" />
                    </div>

                    <InputGroup icon={Phone} placeholder="WhatsApp DDD(Sem o Zero) + NR" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputGroup icon={Lock} placeholder="Senha..." type="password" />
                        <InputGroup icon={Lock} placeholder="Confirmar Senha..." type="password" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectGroup icon={CreditCard} label="Plano">
                            <option className="bg-[#1A1A1A]">Selecione um Plano</option>
                            <option className="bg-[#1A1A1A]">Tattoo Studio Basic (5 PROF.)</option>
                            <option className="bg-[#1A1A1A]">Autônomo (1 PROFISSIONAL)</option>
                            <option className="bg-[#1A1A1A]">Tattoo Studio Pro (ILIMITADOS)</option>
                            <option className="bg-[#1A1A1A]">Plano Anual Basic</option>
                            <option className="bg-[#1A1A1A]">Plano Anual Pro</option>
                        </SelectGroup>

                        <SelectGroup icon={Search} label="Como nos conheceu?">
                            <option className="bg-[#1A1A1A]">Como nos conheceu?</option>
                            <option className="bg-[#1A1A1A]">Instagram</option>
                            <option className="bg-[#1A1A1A]">Facebook</option>
                            <option className="bg-[#1A1A1A]">Youtube</option>
                            <option className="bg-[#1A1A1A]">Indicação</option>
                        </SelectGroup>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group py-4">
                        <div className="relative flex items-center">
                            <input type="checkbox" className="peer hidden" />
                            <div className="w-5 h-5 border-2 border-premium-border rounded peer-checked:bg-gold-polished peer-checked:border-gold-polished transition-all" />
                            <CheckCircleCustom className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 left-1 transition-opacity" />
                        </div>
                        <span className="text-xs text-secondary-text uppercase font-black tracking-widest group-hover:text-white transition-colors">
                            Aceito os <Link href="#" className="underline text-white">Termos e Condições</Link>
                        </span>
                    </label>

                    <button className="btn-premium w-full py-5 text-lg flex items-center justify-center gap-4 group">
                        CADASTRAR
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center mt-6">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-text hover:text-gold-polished transition-all">
                            Já possui conta? <span className="text-white border-b border-white/20">Fazer Login</span>
                        </Link>
                    </p>
                </form>
            </div>

            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
                Ink Flow Management System // Precision & Style
            </p>
        </div>
    );
}

function InputGroup({ icon: Icon, placeholder, type = "text" }: { icon: any, placeholder: string, type?: string }) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold-polished transition-colors">
                <Icon size={18} />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-[#1A1A1A] border border-premium-border rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-gold-polished focus:ring-1 focus:ring-gold-polished/20 transition-all placeholder:text-zinc-600 italic"
            />
        </div>
    );
}

function SelectGroup({ icon: Icon, label, children }: { icon: any, label: string, children: React.ReactNode }) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold-polished transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <select className="w-full bg-[#1A1A1A] border border-premium-border rounded-xl py-4 pl-12 pr-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold-polished focus:ring-1 focus:ring-gold-polished/20 transition-all appearance-none cursor-pointer">
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

function CheckCircleCustom({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
