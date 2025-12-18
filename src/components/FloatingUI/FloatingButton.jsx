import React, { useState, useEffect, useRef, useCallback } from 'react';

const FloatingButton = ({
  onTogglePanel,
  isPanelVisible,
  interceptedCount = 0,
  onHide,
  initialPosition = { top: 20, right: 20 }
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showClose, setShowClose] = useState(false);
  const buttonRef = useRef(null);

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('kk-button-position');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition({
          top: parseInt(parsed.top) || 20,
          right: parseInt(parsed.right) || 20
        });
      } catch (e) {
        console.warn('Failed to parse saved position:', e);
      }
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('kk-button-position', JSON.stringify({
      top: position.top + 'px',
      right: position.right + 'px'
    }));
  }, [position]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.close-button')) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialTop: position.top,
      initialRight: position.right
    });
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const deltaX = dragStart.x - e.clientX;
    const deltaY = e.clientY - dragStart.y;

    const newRight = Math.max(10, Math.min(window.innerWidth - 58, dragStart.initialRight + deltaX));
    const newTop = Math.max(10, Math.min(window.innerHeight - 58, dragStart.initialTop + deltaY));

    setPosition({ top: newTop, right: newRight });
    e.preventDefault();
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = (e) => {
    if (isDragging || e.target.closest('.close-button')) return;
    onTogglePanel();
  };

  const handleHide = (e) => {
    e.stopPropagation();
    localStorage.setItem('kk-button-hidden', 'true');
    onHide();
  };

  const buttonStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    right: `${position.right}px`,
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    cursor: isDragging ? 'grabbing' : 'move',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: isDragging ? 'none' : 'all 0.3s ease',
    userSelect: 'none',
    overflow: 'hidden',
    transform: showClose ? 'scale(1.05)' : 'scale(1)'
  };

  return (
    <>
      <div
        ref={buttonRef}
        style={buttonStyle}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseEnter={() => setShowClose(true)}
        onMouseLeave={() => setShowClose(false)}
        title={`KK Ajax Monitor ${interceptedCount > 0 ? `(${interceptedCount})` : ''}`}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: 'all 0.3s ease'
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span style={{
            fontSize: '10px',
            fontWeight: '600',
            marginTop: '2px'
          }}>
            {interceptedCount > 0 ? interceptedCount : 'KK'}
          </span>
        </div>

        {showClose && (
          <div
            className="close-button"
            onClick={handleHide}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '2px',
              width: '16px',
              height: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 0, 0, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ×
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingButton;