import React, { useEffect, useRef } from 'react';
import './Filter.css'; // Assuming you create a Filter-specific CSS file or import the same styles
import filterIcon from '../assets/filter_3839020.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Filter = ({ isFilterOpen, toggleFilter, children, onSaveFilter }) => {
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        toggleFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleFilter]);

  return (
    <>
      <button className="filter-button" onClick={() => toggleFilter(!isFilterOpen)}>
        <FontAwesomeIcon icon={faFilter} style={{ height: '18px', width: '18px', color: 'white' }} />
        
      </button>

      <div
        ref={filterRef}
        className={`filter-panel ${isFilterOpen ? 'open' : ''}`}
      >
        {children} {/* Render the passed children content */}

        {/* Add Save Button */}
        <div className="filter-save-container">
          
        </div>
      </div>
    </>
  );
};

export default Filter;