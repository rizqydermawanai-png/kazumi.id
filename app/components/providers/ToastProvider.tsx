'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastProps } from '../ui/Toast';
import { ToastNotification } from '../../types';

interface ToastContextType {
    addToast: (toast: Omit<ToastNotification, 'id' | 'onDismiss'>) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<ToastNotification, 'id' | 'onDismiss'>) => {
        const id = Date.now();
        const onDismiss = () => removeToast(id);
        setToasts(prevToasts => [...prevToasts, { ...toast, id, onDismiss }]);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};
