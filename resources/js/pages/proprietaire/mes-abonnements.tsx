import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, AlertCircle, X } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import LayoutProprietaire from '@/layouts/layoutProprietaire';
import { Alert } from '@/components/ui/alert';

interface Abonnement {
  id: number;
  nom: string;
  description: string;
  prix: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  est_actif: boolean;
}

interface AbonnementDisponible {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_months: number;
}

interface Flash {
  message?: string;
  status?: 'success' | 'error' | 'warning' | 'info';
}

interface PageProps {
  abonnements: Abonnement[];
  abonnementsDisponibles: AbonnementDisponible[];
  flash?: Flash;
}

export default function MesAbonnements({ abonnements = [], abonnementsDisponibles = [] }: PageProps) {
  const { flash } = usePage<{ flash?: Flash }>().props;
  const [isLoading, setIsLoading] = useState<number | null>(null);

  // Afficher les messages flash
  if (flash?.message) {
    if (flash.status === 'success') {
      toast.success(flash.message);
    } else if (flash.status === 'error') {
      toast.error(flash.message, {
        icon: <AlertCircle className="h-4 w-4" />
      });
    } else {
      toast(flash.message);
    }
  }

  const handleRenouveler = (abonnementId: number) => {
    setIsLoading(abonnementId);
    // Rediriger vers la page de paiement avec l'ID de l'abonnement
    router.visit(`/proprietaire/subscription?abonnement_id=${abonnementId}`, {
      onFinish: () => setIsLoading(null)
    });
  };

  return (
    <LayoutProprietaire activeTab="Abonnements">
        <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mes abonnements</h1>
        <p className="text-muted-foreground">
          Gérez vos abonnements et souscrivez à de nouvelles offres
        </p>
      </div>

      {/* Abonnement actif */}
      {abonnements.length > 0 && abonnements.some(a => a.est_actif) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Votre abonnement actuel</CardTitle>
                <CardDescription>Détails de votre formule en cours</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Check className="mr-1 h-3 w-3" /> Actif
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {abonnements
              .filter(a => a.est_actif)
              .map((abonnement) => (
                <div key={abonnement.id} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Formule</p>
                      <p className="font-medium">{abonnement.nom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix</p>
                      <p className="font-medium">{abonnement.prix.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Début</p>
                      <p className="font-medium">{abonnement.date_debut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fin</p>
                      <p className="font-medium">{abonnement.date_fin}</p>
                    </div>
                  </div>
                  
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Historique des abonnements */}
      {abonnements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des abonnements</CardTitle>
            <CardDescription>Vos abonnements précédents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {abonnements
                .filter(a => !a.est_actif)
                .map((abonnement) => (
                  <div key={abonnement.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{abonnement.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        Du {abonnement.date_debut} au {abonnement.date_fin}
                      </p>
                    </div>
                    <Badge className="bg-red-500 text-white hover:bg-red-800">
                      <X className="mr-1 h-3 w-3" /> Expiré
                  </Badge>
                    <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRenouveler(abonnement.id)}
                      disabled={isLoading === abonnement.id}
                    >
                        Renouveler mon abonnement
                    </Button>
                  </div>
                  </div>
                ))}
              {abonnements.every(a => a.est_actif) && (
                <p className="text-center text-sm text-muted-foreground">
                  Aucun historique d'abonnement précédent.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abonnements disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Nos formules d'abonnement</CardTitle>
          <CardDescription>
            Choisissez la formule qui correspond le mieux à vos besoins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {abonnementsDisponibles.map((abonnement) => (
              <Card key={abonnement.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-xl">{abonnement.name}</CardTitle>
                  <CardDescription>{abonnement.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{abonnement.price.toLocaleString()}</span>
                    <span className="text-muted-foreground"> FCFA</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pour {abonnement.duration_months} mois
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </LayoutProprietaire>
  );
}



