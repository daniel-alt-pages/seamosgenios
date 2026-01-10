// Sistema de notificaciones Toast profesional
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        bar: 'bg-green-500'
    },
    error: {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        bar: 'bg-red-500'
    },
    warning: {
        icon: AlertCircle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        bar: 'bg-yellow-500'
    },
    info: {
        icon: Info,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        bar: 'bg-blue-500'
    },
    loading: {
        icon: Loader2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        bar: 'bg-blue-500'
    }
};

const Toast = ({ id, type = 'info', message, duration = 4000, onClose }) => {
    const config = TOAST_TYPES[type];
    const Icon = config.icon;
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (type === 'loading') return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                onClose(id);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [id, duration, onClose, type]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`relative overflow-hidden rounded-xl ${config.bg} ${config.border} border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-[400px]`}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon className={`w-5 h-5 mt-0.5 ${config.color} ${type === 'loading' ? 'animate-spin' : ''}`} />
                <p className="text-sm text-white font-medium flex-1 leading-relaxed">{message}</p>
                {type !== 'loading' && (
                    <button
                        onClick={() => onClose(id)}
                        className="text-gray-400 hover:text-white transition-colors p-1 -m-1"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            {type !== 'loading' && (
                <div className="h-1 bg-white/5">
                    <motion.div
                        className={`h-full ${config.bar}`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const updateToast = useCallback((id, type, message) => {
        setToasts(prev => prev.map(t =>
            t.id === id ? { ...t, type, message } : t
        ));
    }, []);

    const toast = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        warning: (message, duration) => addToast('warning', message, duration),
        info: (message, duration) => addToast('info', message, duration),
        loading: (message) => addToast('loading', message, Infinity),
        dismiss: removeToast,
        update: updateToast
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <Toast
                            key={t.id}
                            {...t}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default Toast;
