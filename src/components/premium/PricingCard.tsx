import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check } from 'lucide-react';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PK) {
  throw new Error('Stripe Publishable Key nu este setat în variabilele de mediu');
}

const stripePromise = loadStripe(STRIPE_PK);

type PricingCardProps = {
  title: string;
  price: string;
  period: string;
  features: string[];
  type: 'monthly' | 'yearly';
  priceId: string;
  recommended?: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  type,
  priceId,
  recommended = false
}) => {
  console.log('Props primite în PricingCard:', {
    title,
    price,
    period,
    features,
    type,
    priceId,
    recommended
  });

  const handleSubscribe = async () => {
    try {
      console.log('Inițializare checkout Stripe...');
      console.log('PriceId primit:', priceId);
      console.log('Tip:', type);
      
      if (!priceId || typeof priceId !== 'string') {
        console.error('Price ID invalid:', priceId);
        return;
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        console.error('Stripe nu a fost inițializat corect');
        return;
      }

      const checkoutOptions = {
        lineItems: [
          {
            price: priceId.trim(),
            quantity: 1
          }
        ],
        mode: 'subscription' as const,
        successUrl: `${window.location.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
        cancelUrl: `${window.location.origin}/premium`
      };

      console.log('Opțiuni checkout:', checkoutOptions);

      const { error } = await stripe.redirectToCheckout(checkoutOptions);

      if (error) {
        console.error('Eroare la redirectare către Stripe:', error);
      }
    } catch (err) {
      console.error('Eroare la procesarea plății:', err);
    }
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8
      ${recommended ? 'border-2 border-blue-500 relative' : ''}
      flex flex-col h-full
    `}>
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Recomandat
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
            €/{period}
          </span>
        </div>
      </div>

      <ul className="mt-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-blue-500 mr-3" />
            <span className="text-base text-gray-600 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={`
          mt-8 w-full py-3 px-6 rounded-lg font-medium text-center
          ${recommended 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          }
          transition-colors duration-200
        `}
      >
        {recommended ? 'Economisește 25%' : 'Începe perioada de probă'}
      </button>
    </div>
  );
};

export default PricingCard;