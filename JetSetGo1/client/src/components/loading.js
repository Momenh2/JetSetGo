import React from 'react'

export default function LoadingScreen() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #60A5FA, #FDE68A)',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1E3A8A',
      marginBottom: '2rem',
      animation: 'pulse 2s infinite'
    },
    plane: {
      fontSize: '4rem',
      color: '#EAB308',
      marginBottom: '2rem',
      animation: 'bounce 1s infinite'
    },
    emojiContainer: {
      display: 'flex',
      gap: '1rem',
      fontSize: '2rem'
    },
    message: {
      marginTop: '2rem',
      fontSize: '1.25rem',
      color: '#1E40AF'
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    },
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-20px)' }
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    '@keyframes ping': {
      '75%, 100%': { transform: 'scale(2)', opacity: 0 }
    }
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        `}
      </style>
      <div style={styles.title} aria-live="polite">
        Packing your adventure...
      </div>
      <div style={styles.plane} aria-hidden="true">
        ✈️
      </div>
      <div style={styles.emojiContainer} aria-hidden="true">
        <span style={{ animation: 'spin 2s linear infinite' }}>🌍</span>
        <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}>🏖️</span>
        <span style={{ animation: 'bounce 1s infinite' }}>🗺️</span>
        <span style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>🧳</span>
      </div>
      <p style={styles.message} aria-live="polite">
        Get ready for an amazing journey!
      </p>
    </div>
  )
}