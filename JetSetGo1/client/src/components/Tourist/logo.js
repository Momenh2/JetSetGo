import React from 'react';
import { Link } from 'react-router-dom';
import Alogo1 from './Alogo1.png';

const Logo = () => {
    return (
        <div className="logo1">
            <Link to="/tourist/home" className="logo-link">
                <img src={Alogo1} alt="Explore" className="logo-image" />
            </Link>

            <style jsx>{`
        .logo1 {
            // display: flex;
            position: absolute;
            // display: absolute;
            bottom: 904.5px; /* Corrected "buttom" to "bottom" */
            right: 2100px; /* Positioning from the right side */
            transform: scale(0.7); /* Scale down to 60% of its original size */
        }


        .logo-link {
          display: inline-block;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          cursor: pointer; /* Make it clear the logo is clickable */
        }
      `}</style>
        </div>
    );
};

export default Logo;