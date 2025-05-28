import React from 'react';

export default function NotFound() {
  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f4f4f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(6px)',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      animation: 'fadeIn 0.6s ease-out',
    },
    title: {
      fontSize: '72px',
      color: '#e53935',
      marginBottom: '16px',
      fontWeight: 'bold',
    },
    message: {
      fontSize: '20px',
      color: '#333',
      marginBottom: '24px',
    },
    button: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#e53935',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
          }
          a:hover {
            background-color: #c62828 !important;
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>404</h1>
          <p style={styles.message}>페이지를 찾을 수 없습니다</p>
          <a href="/" style={styles.button}>메인으로 돌아가기</a>
        </div>
      </div>
    </>
  );
}
