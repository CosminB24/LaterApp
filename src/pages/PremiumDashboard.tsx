import React from 'react';
import { Crown } from 'lucide-react';

export default function PremiumDashboard() {
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
            Contul tău Premium
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bucură-te de toate beneficiile premium și îmbunătățește-ți productivitatea
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Aici poți adăuga statistici sau funcționalități exclusive pentru utilizatorii premium */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Statistici avansate</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vizualizează statistici detaliate despre activitatea ta
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Teme personalizate</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Accesează teme exclusive pentru interfața ta
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Suport prioritar</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Beneficiezi de suport tehnic prioritar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 