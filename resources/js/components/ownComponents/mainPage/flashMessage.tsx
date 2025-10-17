'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FlashMessageProps {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export default function FlashMessage({ success, error, warning, info }: FlashMessageProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (success || error || warning || info) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000); // Auto-hide after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [success, error, warning, info]);

    if (!isVisible || (!success && !error && !warning && !info)) {
        return null;
    }

    const getMessageData = () => {
        if (success) return { message: success, type: 'success', icon: CheckCircle, className: 'border-green-200 bg-green-50 text-green-800' };
        if (error) return { message: error, type: 'error', icon: XCircle, className: 'border-red-200 bg-red-50 text-red-800' };
        if (warning) return { message: warning, type: 'warning', icon: AlertTriangle, className: 'border-yellow-200 bg-yellow-50 text-yellow-800' };
        if (info) return { message: info, type: 'info', icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-800' };
        return null;
    };

    const messageData = getMessageData();
    if (!messageData) return null;

    const IconComponent = messageData.icon;

    return (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform">
            <Alert className={`${messageData.className} shadow-lg`}>
                <IconComponent className="h-4 w-4" />
                <AlertDescription className="ml-2">{messageData.message}</AlertDescription>
                <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    ×
                </button>
            </Alert>
        </div>
    );
}
