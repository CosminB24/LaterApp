import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  recommended?: boolean;
}

export default function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  recommended = false
}: PricingCardProps) {
  return (
    <div className={`
      relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm 
      ${recommended ? 'border-2 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}
      flex flex-col justify-between
    `}>
      {recommended && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Recomandat
          </span>
        </div>
      )}

      <div className="p-8 flex-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-baseline mb-6">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">€/{period}</span>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8">
        <button className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
          ${recommended 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}
        `}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}