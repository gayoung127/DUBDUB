import { ContextMenuItem } from "@/app/_hooks/useContextMenu";
import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  menuItems: ContextMenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

const ContextMenu = ({
  x,
  y,
  menuItems,
  isOpen,
  onClose,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${y}px`,
        left: `${x}px`,
        zIndex: 999999,
      }}
      className="bg-white shadow-md p-4"
    >
      <div className="absolute left-0 top-0 flex flex-row items-center justify-start rounded-lg bg-gray-200 px-1 py-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex h-8 w-8 cursor-pointer flex-row items-center justify-center"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;
