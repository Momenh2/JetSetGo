import React, { useState } from 'react';

const MyComponent = () => {
  const [error, setError] = useState(null);

  const showError = () => {
    setError("Failed to delete the event. Please try again.");
  };

  return (
    <div>
      <button onClick={showError}>Trigger Error</button>
      {error && (
        <div className="custom-modal">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
  