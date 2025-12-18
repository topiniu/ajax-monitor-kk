import React, { useState, useEffect, useRef, useCallback } from 'react';

const UrlItem = ({ requestDetail, onCopy, onDelete }) => {
  const [copyStatus, setCopyStatus] = useState('copy');

  const handleCopy = async (e) => {
    console.log('[KK Ajax Monitor] Copy event:', e, typeof e);
    try {
      // Check if we have an event object with stopPropagation
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      } else {
        console.warn('[KK Ajax Monitor] Copy event object missing stopPropagation:', e);
      }

      await navigator.clipboard.writeText(requestDetail.match);
      setCopyStatus('copied');
      onCopy && onCopy(requestDetail.match);
      setTimeout(() => setCopyStatus('copy'), 1500);
    } catch (err) {
      console.warn('[KK Ajax Monitor] Failed to copy:', err);
    }
  };

  const handleDelete = (e) => {
    console.log('[KK Ajax Monitor] Delete event:', e, typeof e);
    try {
      // Check if we have an event object with stopPropagation
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      } else {
        console.warn('[KK Ajax Monitor] Event object missing stopPropagation:', e);
      }

      if (onDelete && requestDetail && requestDetail.match) {
        onDelete(requestDetail.match);
      }
    } catch (error) {
      console.error('[KK Ajax Monitor] Delete handler error:', error.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.background = '#e9ecef';
      e.target.style.borderColor = '#667eea';
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#f8f9fa';
      e.target.style.borderColor = '#e9ecef';
    }}>
      <div style={{
        fontWeight: '600',
        color: '#495057',
        fontSize: '13px',
        marginBottom: '4px',
        wordBreak: 'break-all'
      }}>
        {requestDetail.match}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#6c757d',
        marginBottom: '6px'
      }}>
        <span>Method: {requestDetail.method || 'Unknown'}</span>
        {requestDetail.count > 1 && <span> • Count: {requestDetail.count}</span>}
        <span> • {formatTimestamp(requestDetail.timestamp)}</span>
      </div>
      {requestDetail.url && requestDetail.url !== requestDetail.match && (
        <div style={{
          fontSize: '11px',
          color: '#6c757d',
          marginBottom: '6px',
          fontFamily: 'monospace',
          wordBreak: 'break-all'
        }}>
          {requestDetail.url}
        </div>
      )}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '8px'
      }}>
        <button
          onClick={(e) => handleCopy(e)}
          style={{
            background: copyStatus === 'copied' ? '#28a745' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (copyStatus === 'copy') {
              e.target.style.background = '#5a67d8';
            }
          }}
          onMouseLeave={(e) => {
            if (copyStatus === 'copy') {
              e.target.style.background = '#667eea';
            }
          }}
        >
          {copyStatus === 'copied' ? '✅ Copied!' : '📋 Copy'}
        </button>
        <button
          onClick={(e) => handleDelete(e)}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#c82333';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#dc3545';
          }}
          title="Delete this entry"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

const FloatingPanel = ({
  isVisible,
  matchedUrls = [],
  requestDetails = [],
  onClose,
  onMinimize,
  onClear,
  onDeleteItem,
  initialPosition = { top: 80, right: 20 }
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef(null);

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('kk-panel-position');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition({
          top: parseInt(parsed.top) || 80,
          right: parseInt(parsed.right) || 20
        });
      } catch (e) {
        console.warn('Failed to parse saved panel position:', e);
      }
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('kk-panel-position', JSON.stringify({
      top: position.top + 'px',
      right: position.right + 'px'
    }));
  }, [position]);

  const handleMouseDown = useCallback((e) => {
    // Don't start drag if clicking on controls
    if (e.target.closest('.panel-controls')) return;

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
    if (!isDragging || !panelRef.current) return;

    const deltaX = dragStart.x - e.clientX;
    const deltaY = e.clientY - dragStart.y;

    const panelWidth = panelRef.current.offsetWidth;
    const panelHeight = panelRef.current.offsetHeight;

    const newRight = Math.max(10, Math.min(window.innerWidth - panelWidth - 10, dragStart.initialRight + deltaX));
    const newTop = Math.max(10, Math.min(window.innerHeight - panelHeight - 10, dragStart.initialTop + deltaY));

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

  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
    onMinimize && onMinimize(!isMinimized);
  };

  const handleCloseClick = () => {
    onClose && onClose();
  };

  if (!isVisible) return null;

  const panelStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    right: `${position.right}px`,
    width: '320px',
    maxHeight: isMinimized ? '48px' : '400px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    zIndex: 9998,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    transition: isDragging ? 'none' : 'all 0.3s ease',
    cursor: isDragging ? 'grabbing' : 'default'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'move'
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '14px'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '4px'
  };

  const controlButtonStyle = {
    width: '20px',
    height: '20px',
    border: 'none',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background 0.2s ease'
  };

  const bodyStyle = {
    padding: isMinimized ? '0' : '16px',
    maxHeight: isMinimized ? '0' : '320px',
    overflow: 'auto',
    display: isMinimized ? 'none' : 'block'
  };

  return (
    <div ref={panelRef} style={panelStyle}>
      <div
        style={headerStyle}
        onMouseDown={handleMouseDown}
      >
        <div style={titleStyle}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M8.5,8.5L11,11L8.5,13.5L7,12L8.5,10.5L7,9L8.5,8.5M13.5,8.5L15,9L13.5,10.5L15,12L13.5,13.5L11,11L13.5,8.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
          </svg>
          <span>KK Ajax Monitor ({matchedUrls.length})</span>
        </div>
        <div className="panel-controls" style={controlsStyle}>
          {requestDetails.length > 0 && (
            <button
              onClick={() => onClear && onClear()}
              style={controlButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 193, 7, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              title="Clear all intercepted requests"
            >
              🗑️
            </button>
          )}
          <button
            onClick={handleMinimizeClick}
            style={controlButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? '+' : '−'}
          </button>
          <button
            onClick={handleCloseClick}
            style={controlButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div style={bodyStyle}>
        {requestDetails.length === 0 ? (
          <div style={{
            color: '#888',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '20px'
          }}>
            No intercepted requests yet
          </div>
        ) : (
          requestDetails.map((detail, index) => (
            <UrlItem
              key={detail.id || index}
              requestDetail={detail}
              onCopy={(url) => console.log('Copied:', url)}
              onDelete={(match) => onDeleteItem && onDeleteItem(match)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FloatingPanel;