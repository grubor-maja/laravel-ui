// Button.jsx
import React from 'react';

function Button2({ title, onClick, difficulty, className, disabled }) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);  
    }
  };

  return (
    <>
      <button className={`buttonNext ${className}`} onClick={handleClick} disabled={disabled}>
        {title}
      </button>
    </>
  );
}

export default Button2;
