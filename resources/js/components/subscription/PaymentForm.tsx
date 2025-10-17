import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Smartphone, AlertCircle, Check } from 'lucide-react';

type PaymentMethod = 'flooz' | 'mixx by yas';

interface Subscription {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  status?: 'actif' | 'inactif';
}

interface PaymentFormData {
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  subscriptionId: number;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface FormErrors {
  phoneNumber?: string;
  paymentMethod?: string;
  form?: string;
}

interface PaymentFormProps {
  subscription: Subscription;
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
}

type FloozPrefix = '78' | '79' | '96' | '97' | '98' | '99';
type MixxPrefix = '70' | '71' | '90' | '91' | '92' | '93';

const FLOOZ_PREFIXES: FloozPrefix[] = ['78', '79', '96', '97', '98', '99'];
const MIXX_PREFIXES: MixxPrefix[] = ['70', '71', '90', '91', '92', '93'];
const VALID_PHONE_PREFIXES = [...FLOOZ_PREFIXES, ...MIXX_PREFIXES];

export function PaymentForm({ 
  subscription, 
  onSubmit, 
  onCancel, 
  isLoading, 
  error: propError 
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('flooz');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState({
    phoneNumber: false,
    paymentMethod: false
  });

  const validatePhoneNumber = (number: string): ValidationResult => {
    if (!number.trim()) {
      return { isValid: false, message: 'Le numéro de téléphone est requis' };
    }
    
    if (!/^\d+$/.test(number)) {
      return { isValid: false, message: 'Le numéro ne doit contenir que des chiffres' };
    }
    
    if (number.length !== 8) {
      return { isValid: false, message: 'Le numéro doit contenir 8 chiffres' };
    }
    
    const prefix = number.substring(0, 2);
    
    if (paymentMethod === 'flooz' && !FLOOZ_PREFIXES.includes(prefix as FloozPrefix)) {
      return { 
        isValid: false, 
        message: `Pour Flooz, le numéro doit commencer par ${FLOOZ_PREFIXES.join(', ')}` 
      };
    }
    
    if (paymentMethod === 'mixx by yas' && !MIXX_PREFIXES.includes(prefix as MixxPrefix)) {
      return { 
        isValid: false, 
        message: `Pour Mixx by Yas, le numéro doit commencer par ${MIXX_PREFIXES.join(', ')}` 
      };
    }
    
    return { isValid: true };
  };

  const validateForm = (): boolean => {
    const phoneValidation = validatePhoneNumber(phoneNumber);
    const newErrors: FormErrors = {};

    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.message;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Veuillez sélectionner un moyen de paiement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Envoyer le numéro sans le préfixe 228, il sera ajouté côté serveur si nécessaire
    onSubmit({
      paymentMethod,
      phoneNumber: phoneNumber, // Envoyer uniquement le numéro sans le préfixe
      subscriptionId: subscription.id
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    
    if (isTouched.phoneNumber) {
      const validation = validatePhoneNumber(value);
      setErrors(prev => ({
        ...prev,
        phoneNumber: validation.isValid ? undefined : validation.message
      }));
    }
  };

  const handlePhoneBlur = () => {
    setIsTouched(prev => ({ ...prev, phoneNumber: true }));
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: validation.message
      }));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
    setErrors(prev => ({
      ...prev,
      paymentMethod: undefined
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Détails de l'abonnement</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Abonnement</p>
              <p className="font-medium">{subscription.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée</p>
              <p className="font-medium">{subscription.duration_months} mois</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prix</p>
              <p className="text-lg font-bold text-green-600">
                {subscription.price.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Moyen de paiement</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
              className="grid grid-cols-2 gap-4"
              aria-invalid={!!errors.paymentMethod}
              aria-describedby={errors.paymentMethod ? 'payment-method-error' : undefined}
            >
              <div className="relative">
                <RadioGroupItem 
                  value="flooz" 
                  id="flooz" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="flooz"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 transition-colors ${
                    paymentMethod === 'flooz' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="/assets/img/flooz-logo.png" 
                      alt="Flooz" 
                      className="h-8 w-8"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/32?text=FLOOZ';
                      }}
                    />
                    <span>Flooz</span>
                  </div>
                </Label>
                {paymentMethod === 'flooz' && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="relative">
                <RadioGroupItem 
                  value="mixx by yas" 
                  id="mixx by yas" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="mixx by yas"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 transition-colors ${
                    paymentMethod === 'mixx by yas' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="/assets/img/tmoney-logo.png" 
                      alt="TMoney" 
                      className="h-8 w-8"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/32?text=TMOBI';
                      }}
                    />
                    <span>Mixx by Yas</span>
                  </div>
                </Label>
                {paymentMethod === 'mixx by yas' && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Numéro de téléphone {paymentMethod === 'flooz' ? 'Flooz' : 'Mixx by Yas'}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Smartphone className={`h-5 w-5 ${errors.phoneNumber ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div className="absolute inset-y-0 left-8 flex items-center">
                <span className={`${errors.phoneNumber ? 'text-red-500' : 'text-gray-500'}`}>+228</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder={paymentMethod === 'flooz' ? '98 81 34 82' : '92 21 33 73'}
                className={`pl-20 ${errors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                maxLength={8}
                autoComplete="tel"
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
                disabled={isLoading}
              />
            </div>
            {errors.phoneNumber && (
              <p id="phone-error" className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{errors.phoneNumber}</span>
              </p>
            )}
            {!errors.phoneNumber && (
              <p className="text-xs text-muted-foreground mt-1">
                Format: 92 21 33 73 / 98 81 34 82 (8 chiffres, commençant par {Array.from(new Set(VALID_PHONE_PREFIXES)).join(', ')})
              </p>
            )}
          </div>
          
          {errors.paymentMethod && (
            <p id="payment-method-error" className="text-sm text-red-500 flex items-center mt-2">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{errors.paymentMethod}</span>
            </p>
          )}
          
          {(propError || errors.form) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{propError || errors.form}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !phoneNumber.trim() || !paymentMethod}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <span>Payer </span>
              <span className="ml-1 font-semibold">
                {subscription.price.toLocaleString()} FCFA
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
