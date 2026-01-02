import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';

const authSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    fullName: z.string().optional(),
    role: z.enum(['subject', 'doctor', 'coach']).optional(),
    doctorId: z.string().optional(),
    coachId: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<{ id: string, full_name: string }[]>([]);
    const [coaches, setCoaches] = useState<{ id: string, full_name: string }[]>([]);
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            role: 'subject'
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (!isLogin && selectedRole === 'subject') {
            const fetchPros = async () => {
                try {
                    // Fetch Doctors
                    const { data: docs, error: docError } = await supabase
                        .from('profiles')
                        .select('id, full_name')
                        .eq('role', 'doctor');
                    
                    if (!docError && docs) setDoctors(docs);

                    // Fetch Coaches
                    const { data: coachesData, error: coachError } = await supabase
                        .from('profiles')
                        .select('id, full_name')
                        .eq('role', 'coach');
                    
                    if (!coachError && coachesData) setCoaches(coachesData);
                } catch (err) {
                    console.error('Erro ao buscar profissionais:', err);
                    // Silently fail or set empty lists is better than crashing
                }
            };
            fetchPros();
        }
    }, [isLogin, selectedRole]);

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
                            role: data.role || 'subject',
                            doctor_id: data.role === 'subject' && data.doctorId ? data.doctorId : null,
                            coach_id: data.role === 'subject' && data.coachId ? data.coachId : null
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
        <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {isLogin ? 'Entre para acessar a plataforma' : 'Monitoramento Integrativo de Saúde'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {!isLogin && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Nome Completo
                            </label>
                            <Input
                                {...register('fullName')}
                                placeholder="Seu nome"
                                className={errors.fullName ? 'border-destructive' : ''}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Tipo de Conta
                            </label>
                            <select
                                {...register('role')}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="subject">Sujeito (Paciente)</option>
                                <option value="doctor">Médico</option>
                                <option value="coach">Treinador</option>
                            </select>
                        </div>

                        {selectedRole === 'subject' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        Selecione seu Médico (Opcional)
                                    </label>
                                    <select
                                        {...register('doctorId')}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                {doc.full_name || 'Médico sem nome'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        Selecione seu Treinador (Opcional)
                                    </label>
                                    <select
                                        {...register('coachId')}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        {coaches.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.full_name || 'Treinador sem nome'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Email
                    </label>
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="seu@email.com"
                        className={errors.email ? 'border-destructive' : ''}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Senha
                    </label>
                    <Input
                        {...register('password')}
                        type="password"
                        placeholder="••••••"
                        className={errors.password ? 'border-destructive' : ''}
                    />
                </div>

                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                </Button>
            </form>

            <div className="text-center">
                <Button
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                </Button>
            </div>
        </div>
    );
}
