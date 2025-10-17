import { useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type RegisterForm = {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    password_confirmation: string;
};

export default function RegisterProprietaire() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.proprietaire'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row p-4 lg:p-8 gap-6 lg:gap-0">
            {/* Partie haute (sur mobile) / gauche (sur desktop) */}
            <div className="w-full lg:w-1/2 bg-[#2E7D32] rounded-lg lg:rounded-none flex items-center justify-center p-8 lg:p-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Devenez propriétaire !</h1>
                    <p className="mt-2 lg:mt-8 text-gray-200">Rejoignez notre plateforme pour gérer facilement vos biens immobiliers</p>
                </div>
            </div>

            {/* Partie formulaire */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Inscription Propriétaire</h2>
                        <p className="mt-2 text-gray-600">Créez votre compte pour vendre ou louer vos biens immobiliers</p>
                        <p className="mt-2 text-sm text-orange-600 font-bold">
                            Note : Vous devrez souscrire à un abonnement après inscription pour activer votre compte.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="nom"
                                        type="text"
                                        required
                                        className="pl-10"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <InputError message={errors.nom} className="mt-1" />
                            </div>
                            <div>
                                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                                    Prénom
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="prenom"
                                        type="text"
                                        required
                                        className="pl-10"
                                        value={data.prenom}
                                        onChange={(e) => setData('prenom', e.target.value)}
                                        placeholder="Votre prénom"
                                    />
                                </div>
                                <InputError message={errors.prenom} className="mt-1" />
                            </div>
                        </div>

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
                                    className="pl-10"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="votre@email.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    required
                                    className="pl-10"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    placeholder="Votre numéro de téléphone"
                                />
                            </div>
                            <InputError message={errors.telephone} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
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

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="pl-10"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
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
                                        Création du compte...
                                    </>
                                ) : (
                                    'Créer mon compte propriétaire'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Déjà un compte ?{' '}
                            <TextLink href={route('login')} className="text-green-600 hover:text-green-700 font-medium">
                                Se connecter
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
