import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';
import PricingCard from '../components/premium/PricingCard';
import { Crown } from 'lucide-react';

// Definește ID-urile produselor din Stripe ca constante
const MONTHLY_PRICE_ID = 'price_1OxpQyDyYfQccp15Kuk4Pv3a';
const YEARLY_PRICE_ID = 'price_1OxpQyDyYfQccp15vxQN60kT';

console.log('Price IDs:', { MONTHLY_PRICE_ID, YEARLY_PRICE_ID });

export default function Premium() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user?.id) {
        const status = await userService.getUserPremiumStatus(user.id);
        setIsPremium(status);
      }
    };

    checkPremiumStatus();
  }, [user?.id]);

  if (isPremium) {
    return (
      // ... codul pentru utilizatori premium ...
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <PricingCard
            title="Lunar"
            price="9.99"
            period="lună"
            features={[
              'Toate funcțiile premium',
              'Suport prioritar',
              'Fără reclame',
              'Actualizări în avans'
            ]}
            type="monthly"
            priceId={MONTHLY_PRICE_ID}
          />
          <PricingCard
            title="Anual"
            price="89.99"
            period="an"
            features={[
              'Toate funcțiile premium',
              'Suport prioritar',
              'Fără reclame',
              'Actualizări în avans',
              '2 luni gratuite'
            ]}
            type="yearly"
            priceId={YEARLY_PRICE_ID}
            recommended={true}
          />
        </div>
      </div>
    </div>
  );
} 