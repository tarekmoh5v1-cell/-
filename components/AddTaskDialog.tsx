import React, { useState, useCallback } from 'react';
import DurationSelector from './DurationSelector';

interface AddTaskDialogProps {
    title: string;
    onSubmit: (name: string, dueDate?: string) => void;
    onClose: () => void;
    initialName?: string;
    mode: 'add' | 'edit-name';
    buttonText?: string;
    hideDurationSelector?: boolean;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ title, onSubmit, onClose, initialName = '', mode, buttonText = 'إضافة', hideDurationSelector = false }) => {
    const [taskName, setTaskName] = useState(initialName);
    const [taskDueDate, setTaskDueDate] = useState('');

    const handleDueDateChange = useCallback((dateString: string) => {
        setTaskDueDate(dateString);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskName.trim()) {
            if (mode === 'edit-name') {
                onSubmit(taskName.trim());
            } else if (hideDurationSelector) {
                 onSubmit(taskName.trim());
            } else { // 'add' with duration selector
                if (taskDueDate) {
                    onSubmit(taskName.trim(), taskDueDate);
                } else {
                    alert("يرجى تحديد مدة المهمة.");
                }
            }
        } else {
            alert("اسم المهمة لا يمكن أن يكون فارغاً.");
        }
    };


    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: 'var(--text-color)',
        fontSize: '1.5rem'
    };
    
    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'inherit',
        fontSize: '1rem',
        boxSizing: 'border-box',
    };
    
    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        marginTop: '1.5rem',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s, transform 0.1s',
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'var(--primary-color)',
        color: 'white',
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        color: 'var(--text-muted-color)',
        border: '1px solid var(--border-color)',
    };
    
    return (
        <div>
            <h2 style={titleStyle}>{title}</h2>
            <form onSubmit={handleSubmit}>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted-color)'}}>اسم المهمة</label>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="اكتب اسم المهمة هنا..."
                    style={inputStyle}
                    required
                    autoFocus
                />

                {mode === 'add' && !hideDurationSelector && (
                    <>
                        <label style={{display: 'block', marginBottom: '0.5rem', marginTop: '1rem', color: 'var(--text-muted-color)'}}>حدد المدة</label>
                        <DurationSelector onChange={handleDueDateChange} />
                    </>
                )}
                
                <div style={buttonContainerStyle}>
                    <button type="button" onClick={onClose} style={secondaryButtonStyle} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>إلغاء</button>
                    <button type="submit" style={primaryButtonStyle} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>{buttonText}</button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskDialog;