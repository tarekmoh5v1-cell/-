import React from 'react';
import ChecklistIcon from './icons/ChecklistIcon';

const Header = () => {
    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        color: 'var(--primary-color)',
    };

    const h1Style: React.CSSProperties = {
        fontSize: '2.5rem',
        margin: 0,
    };

    return (
        <header style={headerStyle}>
            <ChecklistIcon style={{ width: '40px', height: '40px' }}/>
            <h1 style={h1Style}>TaskFlow</h1>
        </header>
    );
};

export default Header;
