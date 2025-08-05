import React, { useState } from 'react';

function ShareLink() {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess('Link copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const shareViaLocalEmail = () => {
    const currentUrl = window.location.href;
    const subject = encodeURIComponent('Check out this activity!');
    const body = encodeURIComponent(`Hi, I thought you might find this interesting: ${currentUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Input to display current URL */}
      <input
        type="text"
        value={window.location.href}
        readOnly
        style={{
          width: '100%',
          padding: '10px',
          margin: '10px 0',
          fontSize: '16px',
          textAlign: 'center',
        }}
      />

      {/* Button to copy link */}
      <button
        onClick={copyToClipboard}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          margin: '0 10px',
        }}
      >
        Copy Link
      </button>

      {/* Button to share via local email */}
      <button
        onClick={shareViaLocalEmail}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          margin: '0 10px',
        }}
      >
        Share via Email
      </button>

      {/* Success message for copy action */}
      {copySuccess && <p style={{ color: 'green', marginTop: '10px' }}>{copySuccess}</p>}
    </div>
  );
}

export default ShareLink;
