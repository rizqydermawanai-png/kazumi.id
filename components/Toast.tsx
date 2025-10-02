// components/Toast.tsx

import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AppContext } from '../App';
import { Toast } from '../types';

const ToastMessage: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 4000); // Auto-remove after 4 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [toast, onRemove]);

    const icon = toast.type === 'success' ? 'fa-check-circle' : 'fa-times-circle';

    return (
        <div className={`toast ${toast.type}`}>
            <i className={`fas ${icon}`}></i>
            <span>{toast.message}</span>
        </div>
    );
};


const ToastContainer: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return null;
    
    const { toasts, removeToast } = context;

    const toastRoot = document.getElementById('toast-root');
    if (!toastRoot) return null;

    return ReactDOM.createPortal(
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>,
        toastRoot
    );
};

export default ToastContainer;