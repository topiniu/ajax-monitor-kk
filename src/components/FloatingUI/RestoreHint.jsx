import React, { useState } from 'react';

const RestoreHint = ({ onRestore, position = { top: 10, right: 10 } }) => {
  const [opacity, setOpacity] = useState(0.7);

  const handleClick = () => {
    localStorage.removeItem('kk-button-hidden');
    onRestore && onRestore();
  };

  const hintStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    right: `${position.right}px`,
    width: '24px',
    height: '24px',
    background: 'rgba(102, 126, 234, 0.8)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    cursor: 'pointer',
    zIndex: 9999,
    opacity: opacity,
    transition: 'opacity 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  return (
    <div
      style={hintStyle}
      onClick={handleClick}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0.7)}
      title="Click to show KK Ajax Monitor button"
    >
      ↗️ KK
    </div>
  );
};

export default RestoreHint;