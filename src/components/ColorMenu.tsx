import React, { useState } from "react";

interface MenuProps {
  onColorChange: (color: string) => void;
}

const ColorMenu: React.FC<MenuProps> = ({ onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setIsOpen(false);
  };

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="menu-container">
      <button onClick={handleMenuToggle} onContextMenu={handleMenuToggle}>
        {isOpen ? "Close Color Menu" : "Open Color Menu"}
      </button>
      {isOpen && (
        <div className="color-picker">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorMenu;
