import React from 'react';

const CurrencyChanger = ({ currencies, currency, handleCurrencyChange }) => {
    return (
        <div style={styles.currency}>
            <button style={styles.currencyButton}>
                {currencies[0]}
            </button>
            <select
                value={currency}
                onChange={handleCurrencyChange}
                style={styles.currencySelect}
            >
                <option value="EGP">EGP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                {/* Add other currencies as needed */}
            </select>
        </div>
    );
};

const styles = {
    currency: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    currencyButton: {
        padding: '10px',
        backgroundColor: '#008DDA',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    currencySelect: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
};

export default CurrencyChanger;
