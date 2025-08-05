import React from 'react';

const SearchBar = ({ label, value, onChange }) => {
    return (
        <div>
            <label>{label}:</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)} // Update parent state on change
                placeholder={`Search by ${label}`}
            />
        </div>
    );
};

export default SearchBar;
