import React from 'react';
import XIcon from './icons/XIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const contentStyle: React.CSSProperties = {
        backgroundColor: 'var(--surface-color)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        position: 'relative',
        width: '90%',
        maxWidth: '500px',
        zIndex: 1001,
        animation: 'fadeIn 0.3s ease-out'
    };

    const closeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '1rem',
        left: '1rem', // Adjusted for RTL
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted-color)',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    
    const keyframes = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }`;


    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>{keyframes}</style>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose} aria-label="إغلاق">
                    <XIcon />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;