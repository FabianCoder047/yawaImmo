import { useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-0">
            {/* Partie haute (sur mobile) / gauche (sur desktop) */}
            <div className="w-full lg:w-1/2 bg-[#2E7D32] rounded-lg lg:rounded-none flex items-center justify-center p-8 lg:p-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Nous sommes ravis de vous revoir !</h1>
                    <p className="mt-2 lg:mt-8 text-gray-200">Connectez-vous pour accéder à votre compte</p>
                </div>
            </div>

            {/* Partie formulaire */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
                        <p className="mt-2 text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
                    </div>

                    {status && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                            {status}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    className="pl-10"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="votre@email.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm">
                                        Mot de passe oublié ?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="pl-10 pr-10"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Se souvenir de moi
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-medium rounded-md transition-colors"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        Connexion...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Pas encore de compte ?{' '}
                            <TextLink href={route('register.proprietaire')} className="text-green-600 hover:text-green-700 font-medium">
                                S'inscrire
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
