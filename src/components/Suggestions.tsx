import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Lightbulb, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Suggestions() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("email", user?.primaryEmailAddress?.emailAddress || '');

    try {
      const response = await fetch('https://formspree.io/f/mpwzgbyg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitSuccess(true);
        form.reset();
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Eroare la trimiterea formularului:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sugestii pentru Later
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ajută-ne să îmbunătățim aplicația cu ideile tale, iar dacă implementăm ce ne propui, te vom răsplăti cu o lună de beneficii Premium
            </p>
          </div>

          {/* Formular */}
          {submitSuccess ? (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/50 rounded-xl">
              <p className="text-green-600 dark:text-green-400 font-medium">
                Mulțumim pentru sugestie! Vom analiza propunerea ta cu atenție.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nume
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrierea sugestiei
                </label>
                <textarea
                  name="suggestion"
                  required
                  rows={4}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link-uri / surse de inspirație (opțional)
                </label>
                <input
                  type="text"
                  name="links"
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Se trimite..." : "Trimite sugestia"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 