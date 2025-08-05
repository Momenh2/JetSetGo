import React, { useEffect,useRef } from 'react';
import './Filter.css'; // Assuming you create a Filter-specific CSS file or import the same styles

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Wishlist = ({ isFilterOpen, toggleFilter, children }) => {
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
      <div className="heartboxwishlist"   onClick={() => toggleFilter(!isFilterOpen)}>
        <i className="fas fa-heart"  ></i>
        
      </div>

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

export default Wishlist;