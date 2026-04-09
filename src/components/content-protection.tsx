"use client";

import { useEffect } from 'react';

/**
 * Component to prevent content copying via right-click and keyboard shortcuts.
 */
export function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable copy-related keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Safety check to prevent errors if e.key is undefined
      if (!e.key) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (
        (isCtrl && (key === 'c' || key === 'u' || key === 's' || key === 'a' || key === 'p')) ||
        (isCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        key === 'f12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag and drop of content
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
