'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
}

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to show notification
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string, duration: number = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = { id, message, type, title, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after specified duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Make showNotification globally available
  useEffect(() => {
    (window as any).showNotification = showNotification;
    
    return () => {
      delete (window as any).showNotification;
    };
  }, [showNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-start justify-between animate-fade-in ${
            notification.type === 'success'
              ? 'bg-green-100 border border-green-200 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-100 border border-red-200 text-red-800'
              : notification.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
              : 'bg-blue-100 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-start">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            ) : notification.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div>
              {notification.title && (
                <h4 className="font-medium mb-1">
                  {notification.title}
                </h4>
              )}
              <p>{notification.message}</p>
            </div>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}