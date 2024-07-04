function Button({ title, onClick, difficulty, className, disabled }) {
  const handleClick = () => {
    onClick(difficulty);
  };

  return (
    <>
      <button className={`buttonNext ${className}`} onClick={handleClick} disabled={disabled}>
        {title}
      </button>
    </>
  );
}

export default Button;
