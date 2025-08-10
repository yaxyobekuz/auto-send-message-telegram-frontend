const ArrowIcon = ({
  size = 24,
  className = "",
  color = "#333",
  strokeWidth = 1.5,
  direction = "right",
}) => {
  // Get rotation angle based on direction
  const getRotation = () => {
    switch (direction) {
      case "up":
        return "270deg";
      case "down":
        return "90deg";
      case "left":
        return "180deg";
      case "right":
      default:
        return "0deg";
    }
  };

  return (
    <svg
      fill="none"
      width={size}
      height={size}
      stroke={color}
      viewBox="0 0 24 24"
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${getRotation()})`,
        transition: "transform 0.2s ease",
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export default ArrowIcon;
