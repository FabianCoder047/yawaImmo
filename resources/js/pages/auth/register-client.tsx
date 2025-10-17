import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function RegisterClient() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register/client');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Inscription Client</h2>
                    <p className="mt-2 text-sm text-gray-600">Créez votre compte pour accéder à nos services d'achat et de location</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Remplissez le formulaire ci-dessous pour créer votre compte client</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.nom && (
                                <Alert>
                                    <AlertDescription>{errors.nom}</AlertDescription>
                                </Alert>
                            )}
                            {errors.prenom && (
                                <Alert>
                                    <AlertDescription>{errors.prenom}</AlertDescription>
                                </Alert>
                            )}
                            {errors.email && (
                                <Alert>
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                            {errors.telephone && (
                                <Alert>
                                    <AlertDescription>{errors.telephone}</AlertDescription>
                                </Alert>
                            )}
                            {errors.password && (
                                <Alert>
                                    <AlertDescription>{errors.password}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nom">Nom</Label>
                                    <Input id="nom" type="text" value={data.nom} onChange={(e) => setData('nom', e.target.value)} required />
                                </div>
                                <div>
                                    <Label htmlFor="prenom">Prénom</Label>
                                    <Input id="prenom" type="text" value={data.prenom} onChange={(e) => setData('prenom', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            </div>

                            <div>
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                                <Input
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Création du compte...' : 'Créer mon compte client'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <a href="/login" className="text-green-600 hover:text-green-500">
                                    Se connecter
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
