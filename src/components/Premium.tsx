import React, { useState, useEffect } from 'react';
import PremiumFeatures from '../components/premium/PremiumFeatures';
import PricingCard from '../components/premium/PricingCard';
import { Crown, Clock, Calendar, Bell, Users, Palette } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';

export default function Premium() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user?.id) {
        try {
          const status = await userService.getUserPremiumStatus(user.id);
          setIsPremium(status);
        } catch (error) {
          console.error('Eroare la verificarea statusului premium:', error);
        }
      }
    };

    checkPremiumStatus();
  }, [user?.id]);

  const features = [
    {
      icon: Clock,
      title: 'Istoric nelimitat',
      description: 'Accesează întregul istoric al sarcinilor tale oricând dorești'
    },
    {
      icon: Calendar,
      title: 'Calendar avansat',
      description: 'Funcții avansate de calendar și vizualizări multiple'
    },
    {
      icon: Bell,
      title: 'Notificări personalizate',
      description: 'Configurează notificări personalizate pentru evenimentele importante'
    },
    {
      icon: Users,
      title: 'Colaborare în echipă',
      description: 'Împărtășește și colaborează cu membrii echipei tale'
    },
    {
      icon: Palette,
      title: 'Teme personalizate',
      description: 'Accesează teme și customizări exclusive'
    }
  ];

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ești utilizator Premium, iată avantajele pe care le ai:
            </h1>
          </div>
          <PremiumFeatures features={features} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade la Premium
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deblocați funcționalități avansate și îmbunătățiți-vă productivitatea cu contul Premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <PricingCard
            title="Lunar"
            price="2.99"
            period="lună"
            features={[
              'Toate funcțiile premium',
              'Suport prioritar',
              'Fără reclame',
              'Actualizări în avans'
            ]}
            buttonText="Începe perioada de probă"
            recommended={false}
            type="monthly"
            priceId="price_1QXNj6DyYfQccp15QwZRfmuv"
          />
          <PricingCard
            title="Anual"
            price="26.99"
            period="an"
            features={[
              'Toate funcțiile premium',
              'Suport prioritar',
              'Fără reclame',
              'Actualizări în avans',
              '2 luni gratuite'
            ]}
            buttonText="Economisește 25%"
            recommended={true}
            type="yearly"
            priceId="price_1QXNmGDyYfQccp15DPK8aG8D"
          />
        </div>

        <PremiumFeatures features={features} />
      </div>
    </div>
  );
}