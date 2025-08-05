import React, { useEffect, useRef } from 'react';
import '../../components/Filter.css'; // Assuming you create a Filter-specific CSS file or import the same styles
//import filterIcon from '../assets/filter_3839020.png';'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlus, faTrashAlt,faHeart } from '@fortawesome/free-solid-svg-icons';
import './filtersave.css'; // Assuming you create a Filter-specific CSS file or import the same styles

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
        {/* <img src={filterIcon} alt="Filter Icon" className="filter-icon" />
         */}
         <FontAwesomeIcon
                  icon={ faHeart}
                />    
      </button>

      <div
        ref={filterRef}
        className={`filter-panel ${isFilterOpen ? 'open' : ''}`}
      >
        {children} {/* Render the passed children content */}

        {/* Add Save Button */}
        <div className="filter-save-container">
          {/* <button className="save-filter-btn" onClick={onSaveFilter}>
            Save Filters
          </button> */}
        </div>
      </div>
    </>



  );
};

export default Filter;