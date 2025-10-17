import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PaymentForm } from '@/components/subscription/PaymentForm';

interface Subscription {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_months: number;
}

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    message?: string;
    status?: 'error' | 'success' | 'warning' | 'info';
}

interface PaymentFormData {
    subscriptionId: number;
    paymentMethod: string;
    phoneNumber: string;
}

interface SubscriptionProps {
    subscriptions?: Subscription[];
    flash?: Flash;
}

export default function SubscriptionPage({ subscriptions = [] }: SubscriptionProps) {
    const [processing, setProcessing] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const { flash } = usePage<{ flash?: Flash }>().props;

    const handleSubscribe = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setShowPaymentForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSubmit = (data: PaymentFormData) => {
        console.log('Payment data:', data);
        setProcessing(true);

        router.post(
            route('proprietaire.subscribe'),
            {
                subscription_id: data.subscriptionId,
                payment_method: data.paymentMethod,
                phone_number: data.phoneNumber
            },
            {
                onSuccess: () => {
                    console.log('Subscription successful');
                    // The server will handle the redirection
                },
                onError: (errors) => {
                    console.error('Subscription failed:', errors);
                    if (errors?.message) {
                        toast.error(errors.message, {
                            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                        });
                    }
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            },
        );
    };

    const handlePaymentCancel = () => {
        setShowPaymentForm(false);
        setSelectedSubscription(null);
    };

    const getFeatures = (subscription: Subscription) => {
        const features = [];

        if (subscription.name === "Plan Basique") {
            features.push("Publier jusqu'à 5 biens");
            features.push("Durée : " + subscription.duration_months + " mois");
            features.push('Sans assistance');
            features.push('Statistiques détaillées');
            features.push('Mise à jour en temps réel');
        } else if(subscription.name ==="Plan Standard") {
            features.push('Publier jusqu\'à 15 biens');
            features.push('Durée : ' + subscription.duration_months + ' mois');
            features.push('Assistance prioritaire incluse');
            features.push('Statistiques détaillées');
            features.push('Mise à jour en temps réel');
        } else if(subscription.name ==="Plan Premium") {
            features.push('Publier un nombre illimité de biens');
            features.push('Durée : ' + subscription.duration_months + ' mois');
            features.push('Assistance prioritaire incluse');
            features.push('Statistiques détaillées');
            features.push('Mise en avant de vos biens');
            features.push('Mise à jour en temps réel');
        }

        return features;
    };

    // Show flash messages
    useEffect(() => {
        if (!flash) return;
        
        // Handle flash message with status
        if ('status' in flash && flash.status && 'message' in flash && flash.message) {
            const { message, status } = flash;
            
            if (status === 'error') {
                toast.error(message, {
                    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                });
            } else if (status === 'success') {
                toast.success(message);
            } else if (status === 'warning') {
                toast.warning(message);
            } else if (status === 'info') {
                toast.info(message);
            } else {
                toast(flash.message);
            }
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {showPaymentForm && selectedSubscription ? (
                    <div className="mb-8">
                        <Button 
                            variant="ghost" 
                            onClick={handlePaymentCancel}
                            className="mb-4 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 19-7-7 7-7"/>
                                <path d="M19 12H5"/>
                            </svg>
                            Retour aux abonnements
                        </Button>
                        <PaymentForm
                            subscription={selectedSubscription}
                            onSubmit={handlePaymentSubmit}
                            onCancel={handlePaymentCancel}
                            isLoading={processing}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-12 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Choisissez votre abonnement</h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Sélectionnez un plan pour activer votre compte propriétaire et commencer à publier vos biens
                            </p>
                        </div>

                {subscriptions.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-600">Aucun abonnement disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3">
                        {subscriptions.map((subscription) => {
                            const features = getFeatures(subscription);
                            return (
                                <Card key={subscription.id} className="relative">
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl">{subscription.name}</CardTitle>
                                        <CardDescription>{subscription.description}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold text-green-600">{subscription.price.toLocaleString()}</span>
                                            <span className="text-gray-500"> FCFA</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Pour {subscription.duration_months} mois</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ul className="space-y-3">
                                            {features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-3">
                                                    <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => handleSubscribe(subscription)}
                                            disabled={processing}
                                            className="mt-6 w-full"
                                        >
                                            Choisir ce plan
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                        <div className="mt-12 text-center">
                            <p className="text-gray-600">
                                En souscrivant à un abonnement, vous acceptez nos conditions d'utilisation.
                                <br />
                                Votre compte sera activé immédiatement après le paiement.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
