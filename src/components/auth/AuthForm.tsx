import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';
import { Target, Mail, Lock, User, MoreHorizontal } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
    role: z.string().optional()
});

const signupSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    fullName: z.string().min(2, 'Nome é obrigatório'),
}).refine((data) => data.password.length >= 6, {
    message: "A senha deve ter no mínimo 6 caracteres",
    path: ["password"],
});

type AuthFormData = z.infer<typeof signupSchema>;

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.fullName,
                            role: 'subject', // Default to subject for now
                        },
                    },
                });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu email se necessário.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px] flex flex-col items-center">
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-white/20">
                    <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded-full" />
                    </div>
                </div>
                <h1 className="text-2xl font-light tracking-[0.2em] text-white">SYNTHONIA</h1>
            </div>

            {/* Tab Switcher */}
            <div className="w-full grid grid-cols-2 p-1 bg-zinc-900/50 rounded-lg mb-8 border border-white/5">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`text-sm font-medium py-2.5 rounded-md transition-all duration-300 ${isLogin
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    Entrar
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`text-sm font-medium py-2.5 rounded-md transition-all duration-300 ${!isLogin
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    Cadastrar
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
                {!isLogin && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-1">
                            NOME
                        </label>
                        <div className="relative group">
                            <Input
                                {...register('fullName')}
                                placeholder="Seu nome completo"
                                className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 pl-4 h-11 focus:border-white/30 transition-all rounded-lg"
                            />
                            <User className="absolute right-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                        </div>
                        {errors.fullName && <p className="text-xs text-red-500 pl-1">{String(errors.fullName.message)}</p>}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-1">
                        E-MAIL
                    </label>
                    <div className="relative group">
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="seu@email.com"
                            className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 pl-4 h-11 focus:border-white/30 transition-all rounded-lg"
                        />
                        <Mail className="absolute right-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 pl-1">{String(errors.email.message)}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-1">
                        SENHA
                    </label>
                    <div className="relative group">
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="Sua senha"
                            className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 pl-4 h-11 focus:border-white/30 transition-all rounded-lg"
                        />
                        <MoreHorizontal className="absolute right-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                    </div>
                    {errors.password && <p className="text-xs text-red-500 pl-1">{String(errors.password.message)}</p>}
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg tracking-wide uppercase mt-4 transition-all"
                >
                    {isLogin ? 'ENTRAR' : 'CADASTRAR'}
                </Button>

                <div className="text-center pt-2">
                    <button type="button" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        Esqueceu a senha?
                    </button>
                </div>
            </form>
        </div>
    );
}
