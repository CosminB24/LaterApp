import React from 'react';
import PremiumFeatures from './premium/PremiumFeatures';
import { Crown } from 'lucide-react';

const features = [
  {
    icon: Crown,
    title: 'Istoric nelimitat',
    description: 'Accesează întregul istoric al sarcinilor tale oricând dorești'
  },
  {
    icon: Crown,
    title: 'Calendar avansat',
    description: 'Funcții avansate de calendar și vizualizări multiple'
  },
  {
    icon: Crown,
    title: 'Notificări personalizate',
    description: 'Configurează notificări personalizate pentru evenimentele importante'
  },
  {
    icon: Crown,
    title: 'Colaborare în echipă',
    description: 'Împărtășește și colaborează cu membrii echipei tale'
  },
  {
    icon: Crown,
    title: 'Teme personalizate',
    description: 'Accesează teme și customizări exclusive'
  }
];

const PremiumBenefits: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ești utilizator Premium, iată avantajele pe care le ai:
          </h1>
        </div>
        <PremiumFeatures features={features} />
      </div>
    </div>
  );
};

export default PremiumBenefits; 