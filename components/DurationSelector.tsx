import React, { useState, useEffect } from 'react';

type Unit = 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

interface DurationSelectorProps {
    onChange: (dateString: string) => void;
}

const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const RANGES: Record<Unit, number[]> = {
    minutes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    hours: Array.from({ length: 23 }, (_, i) => i + 1),
    days: Array.from({ length: 7 }, (_, i) => i + 1),
    weeks: Array.from({ length: 4 }, (_, i) => i + 1),
    months: Array.from({ length: 12 }, (_, i) => i + 1),
};

const UNIT_LABELS: Record<Unit, string> = {
    minutes: 'دقائق',
    hours: 'ساعات',
    days: 'أيام',
    weeks: 'أسابيع',
    months: 'أشهر',
};


const DurationSelector: React.FC<DurationSelectorProps> = ({ onChange }) => {
    const [unit, setUnit] = useState<Unit>('hours');
    const [value, setValue] = useState<number>(1);
    
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '1rem',
        backgroundColor: 'var(--bg-color)',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        minHeight: '250px',
    };

    const unitContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flexBasis: '100px',
        flexShrink: 0,
    };

    const getUnitButtonStyle = (u: Unit): React.CSSProperties => ({
        background: unit === u ? 'var(--primary-color)' : 'var(--surface-color)',
        color: unit === u ? 'white' : 'var(--text-color)',
        border: unit === u ? 'none' : '1px solid var(--border-color)',
        cursor: 'pointer',
        padding: '0.75rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        textAlign: 'center',
        transition: 'background-color 0.2s, color 0.2s',
    });

    const valueScrollerStyle: React.CSSProperties = {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        overflowY: 'auto',
        padding: '0.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        maxHeight: '220px',
    };
    
    const getValueButtonStyle = (v: number): React.CSSProperties => ({
        background: value === v ? 'var(--primary-color)' : 'var(--surface-color)',
        color: value === v ? 'white' : 'var(--text-color)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontSize: '1rem',
        textAlign: 'center',
        flexShrink: 0,
        transition: 'background-color 0.2s, color 0.2s',
    });


    useEffect(() => {
        const now = new Date();
        switch (unit) {
            case 'minutes': now.setMinutes(now.getMinutes() + value); break;
            case 'hours': now.setHours(now.getHours() + value); break;
            case 'days': now.setDate(now.getDate() + value); break;
            case 'weeks': now.setDate(now.getDate() + value * 7); break;
            case 'months': now.setMonth(now.getMonth() + value); break;
        }
        onChange(formatDateTimeLocal(now));
    }, [unit, value, onChange]);
    
    const handleUnitChange = (newUnit: Unit) => {
        setUnit(newUnit);
        setValue(RANGES[newUnit][0]);
    };

    return (
        <div style={containerStyle}>
             <div style={unitContainerStyle}>
                {(Object.keys(UNIT_LABELS) as Unit[]).map(u => (
                    <button key={u} type="button" onClick={() => handleUnitChange(u)} style={getUnitButtonStyle(u)}>
                        {UNIT_LABELS[u]}
                    </button>
                ))}
            </div>
            <div style={valueScrollerStyle}>
                {RANGES[unit].map(v => (
                    <button key={v} type="button" onClick={() => setValue(v)} style={getValueButtonStyle(v)}>
                        {v}
                    </button>
                ))}
            </div>
        </div>
    )
};

export default DurationSelector;