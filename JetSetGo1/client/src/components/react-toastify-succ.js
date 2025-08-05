import React, { useState } from 'react';

const SuccessToast = () => {
  const [success, setSuccess] = useState(null);

  const showSuccess = () => {
    setSuccess("The event was successfully deleted.");
  };

  return (
    <div>
      <button onClick={showSuccess}>Trigger Success</button>
      {success && (
        <div className="custom-modal success-modal">
          <p>{success}</p>
          <button onClick={() => setSuccess(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SuccessToast;