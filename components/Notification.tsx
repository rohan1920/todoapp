import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 animate-slide-in-left">
      <div className={`${getBgColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-64`}>
        <span className="text-lg font-bold">{getIcon()}</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
