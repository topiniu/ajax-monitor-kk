import React, { useState, useEffect, useCallback } from 'react';
import FloatingButton from './FloatingButton';
import FloatingPanel from './FloatingPanel';
import RestoreHint from './RestoreHint';

const FloatingUI = ({
  interceptedUrls = [],
  requestDetails = [],
  shouldShow = true,
  onVisibilityChange,
  onClearRequests,
  onDeleteItem
}) => {
  const [isButtonVisible, setIsButtonVisible] = useState(shouldShow);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isButtonHidden, setIsButtonHidden] = useState(false);

  // Check if button was previously hidden
  useEffect(() => {
    const isHidden = localStorage.getItem('kk-button-hidden') === 'true';
    setIsButtonHidden(isHidden);
  }, []);

  // Update button visibility based on shouldShow prop
  useEffect(() => {
    setIsButtonVisible(shouldShow);
    onVisibilityChange && onVisibilityChange(shouldShow);
  }, [shouldShow, onVisibilityChange]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelVisible(!isPanelVisible);
  }, [isPanelVisible]);

  const handleHideButton = useCallback(() => {
    setIsButtonVisible(false);
    setIsButtonHidden(true);
    setIsPanelVisible(false);
  }, []);

  const handleRestoreButton = useCallback(() => {
    setIsButtonVisible(true);
    setIsButtonHidden(false);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelVisible(false);
  }, []);

  const handleMinimizePanel = useCallback((isMinimized) => {
    // Panel handles its own minimize state
    console.log('Panel minimized:', isMinimized);
  }, []);

  // Get unique URLs from intercepted data
  const uniqueUrls = [...new Set(interceptedUrls)];

  return (
    <>
      {/* Show button if it should be visible and not hidden by user */}
      {isButtonVisible && !isButtonHidden && (
        <FloatingButton
          onTogglePanel={handleTogglePanel}
          isPanelVisible={isPanelVisible}
          interceptedCount={uniqueUrls.length}
          onHide={handleHideButton}
        />
      )}

      {/* Show panel when button is clicked */}
      <FloatingPanel
        isVisible={isPanelVisible}
        matchedUrls={uniqueUrls}
        requestDetails={requestDetails}
        onClose={handleClosePanel}
        onMinimize={handleMinimizePanel}
        onClear={onClearRequests}
        onDeleteItem={onDeleteItem}
      />

      {/* Show restore hint when button is hidden but should be visible */}
      {isButtonHidden && shouldShow && (
        <RestoreHint onRestore={handleRestoreButton} />
      )}
    </>
  );
};

export default FloatingUI;