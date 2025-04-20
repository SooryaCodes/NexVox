import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning';
type Toast = { id: string; message: string; type: ToastType };

export function useRoomToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return { toasts, addToast, removeToast };
} 