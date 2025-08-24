import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) {
        return null;
    }

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '1rem',
        color: 'var(--text-color)',
        fontSize: '1.5rem',
    };

    const messageStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'var(--text-muted-color)',
        fontSize: '1rem',
        lineHeight: 1.5,
        wordWrap: 'break-word',
    };

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        minWidth: '100px',
        transition: 'background-color 0.2s, transform 0.1s',
    };

    const confirmButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'var(--danger-color)',
        color: 'white',
    };

    const cancelButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        color: 'var(--text-muted-color)',
        border: '1px solid var(--border-color)',
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(0.98)';
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(1)';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2 style={titleStyle}>{title}</h2>
                <p style={messageStyle}>{message}</p>
                <div style={buttonContainerStyle}>
                    <button 
                        onClick={onClose} 
                        style={cancelButtonStyle} 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp}
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={onConfirm} 
                        style={confirmButtonStyle} 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp}
                    >
                        حذف
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;