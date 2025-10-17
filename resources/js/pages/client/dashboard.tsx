import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClientLayout from '@/layouts/layoutClient';
import { Link } from '@inertiajs/react';
import { FaHeart, FaHome, FaSearch, FaUser } from 'react-icons/fa';


export default function ClientDashboard() {
    return (
        <ClientLayout activeTab="Dashboard">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="mt-2 text-gray-600">Bienvenue sur votre espace client</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mes demandes</CardTitle>
                        <FaSearch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Demandes en cours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Biens favoris</CardTitle>
                        <FaHeart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Biens sauvegardés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Biens disponibles</CardTitle>
                        <FaHome className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Biens à consulter</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profil</CardTitle>
                        <FaUser className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground">Profil complété</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                        <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/properties">
                            <Button className="w-full" variant="outline">
                                <FaSearch className="mr-2 h-4 w-4" />
                                Rechercher un bien
                            </Button>
                        </Link>
                        <Link href="/client/favorites">
                            <Button className="w-full" variant="outline">
                                <FaHeart className="mr-2 h-4 w-4" />
                                Mes favoris
                            </Button>
                        </Link>
                        <Link href="/settings/profile">
                            <Button className="w-full" variant="outline">
                                <FaUser className="mr-2 h-4 w-4" />
                                Modifier mon profil
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mes dernières activités</CardTitle>
                        <CardDescription>Historique de vos actions récentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Aucune activité récente</p>
                                    <p className="text-xs text-gray-500">Commencez par rechercher un bien</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ClientLayout>
    );
}

