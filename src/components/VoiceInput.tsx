import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { convertToDateFormat, convertToTimeFormat } from '../utils/dateUtils';

interface VoiceInputProps {
  onVoiceInput: (data: {
    date: string;
    time: string;
    title: string;
  }) => void;
}

export default function VoiceInput({ onVoiceInput }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');

  const processVoiceInput = (transcript: string) => {
    // Expresii regulate pentru a găsi data, ora și titlul
    const datePattern = /(?:pe|pentru|în|la data de)\s+(\d{1,2}(?:\s+)?(?:ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie))/i;
    const timePattern = /(?:la ora|la)\s+(\d{1,2}(?::\d{2})?)/i;
    
    try {
      // Extrage data
      const dateMatch = transcript.match(datePattern);
      if (!dateMatch) throw new Error('Nu am putut identifica data');
      
      // Convertește data în format yyyy-MM-dd
      const date = convertToDateFormat(dateMatch[1]);

      // Extrage ora
      const timeMatch = transcript.match(timePattern);
      if (!timeMatch) throw new Error('Nu am putut identifica ora');
      
      // Convertește ora în format HH:mm
      const time = convertToTimeFormat(timeMatch[1]);

      // Elimină data și ora din transcript pentru a obține titlul
      const title = transcript
        .replace(dateMatch[0], '')
        .replace(timeMatch[0], '')
        .trim()
        .replace(/^(un task|o sarcină|task|sarcină)/i, '')
        .trim();

      if (!title) throw new Error('Nu am putut identifica titlul task-ului');

      onVoiceInput({ date, time, title });
    } catch (err) {
      setError(err.message);
    }
  };

  const startListening = () => {
    setError('');
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ro-RO';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceInput(transcript);
    };

    recognition.onerror = (event) => {
      setError('Eroare la recunoașterea vocală');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative">
      <button
        onClick={startListening}
        className={`p-2 rounded-full ${
          isListening 
            ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' 
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        } hover:bg-opacity-80 transition-colors`}
        title="Adaugă task vocal"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {error && (
        <div className="absolute top-full mt-2 w-48 p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 