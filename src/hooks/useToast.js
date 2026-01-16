// src/hooks/useToast.js
import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const [position, setPosition] = useState('top-right');

    const addToast = useCallback(({ message, type = 'info', duration = 3000, showCloseButton = true, position: toastPosition }) => {
        const id = toastId++;
        const newToast = {
            id,
            message,
            type,
            duration,
            showCloseButton,
            position: toastPosition || position
        };

        setToasts((prev) => [...prev, newToast]);
        return id;
    }, [position]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message, options = {}) => {
        return addToast({ message, type: 'success', ...options });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ message, type: 'error', ...options });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ message, type: 'warning', ...options });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ message, type: 'info', ...options });
    }, [addToast]);

    const alert = useCallback((message, options = {}) => {
        return addToast({ message, type: 'alert', ...options });
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const setToastPosition = useCallback((newPosition) => {
        setPosition(newPosition);
    }, []);

    return {
        toasts,
        position,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        alert,
        clearAll,
        setToastPosition
    };
};