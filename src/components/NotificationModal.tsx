import React, { useState } from 'react';

const NOTIFICATION_INTERVALS = [
  { value: '24h', label: '24 ore înainte' },
  { value: '12h', label: '12 ore înainte' },
  { value: '6h', label: '6 ore înainte' },
  { value: '1h', label: '1 oră înainte' },
  { value: '30m', label: '30 minute înainte' },
  { value: '15m', label: '15 minute înainte' },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notifications: TaskNotification) => void;
  currentNotifications?: TaskNotification;
}

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  onSave,
  currentNotifications 
}: NotificationModalProps) {
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>(
    currentNotifications?.intervals || []
  );

  const handleSave = () => {
    onSave({
      enabled: selectedIntervals.length > 0,
      intervals: selectedIntervals,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Configurare Notificări</h2>
        
        <div className="space-y-3">
          {NOTIFICATION_INTERVALS.map(interval => (
            <label key={interval.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedIntervals.includes(interval.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIntervals([...selectedIntervals, interval.value]);
                  } else {
                    setSelectedIntervals(
                      selectedIntervals.filter(i => i !== interval.value)
                    );
                  }
                }}
                className="mr-2"
              />
              <span>{interval.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
} 