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
      style={{ top: y, left: x }}
      className="shadow-lg absolute z-50 w-20 rounded-md border border-gray-200 bg-gray-400"
    >
      <ul className="py-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer px-4 py-2 text-center text-sm text-white-100 hover:bg-gray-100"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
