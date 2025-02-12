import React, { useCallback, useEffect, useRef, useState } from "react";

export interface ContextMenuItem {
  icon: React.ReactNode;
  action: () => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  menuItems: ContextMenuItem[];
  isOpen: boolean;
}

export const useContextMenu = () => {
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    menuItems: [],
    isOpen: false,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback(
    (event: MouseEvent, menuItems: ContextMenuItem[]) => {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;

      const adjustedX = Math.min(clickX, window.innerWidth - 160);
      const adjustedY = Math.min(
        clickY,
        window.innerHeight - menuItems.length * 40,
      );

      setContextMenuState({
        x: adjustedX,
        y: adjustedY,
        menuItems: menuItems,
        isOpen: true,
      });
    },
    [],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuState((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  }, []);

  const handleMenuItemClick = useCallback(
    (action: () => void) => {
      action();
      handleCloseContextMenu();
    },
    [handleCloseContextMenu],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        event.target instanceof Node &&
        !contextMenuRef.current.contains(event.target)
      ) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCloseContextMenu]);

  return {
    contextMenuState,
    handleContextMenu,
    handleMenuItemClick,
    handleCloseContextMenu,
    contextMenuRef,
  };
};
