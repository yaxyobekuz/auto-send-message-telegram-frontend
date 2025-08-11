import ArrowIcon from "./ArrowIcon";
import { Link } from "react-router-dom";

const LinkBox = ({ to, className = "", icon, alt, label }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-5 justify-between bg-white w-full p-5 rounded-2xl ${className}`}
    >
      <div className="flex items-center gap-5">
        <img
          src={icon}
          width={48}
          height={48}
          className="size-12"
          alt={alt || label || "Ikonka"}
        />

        <span className="text-lg">{label}</span>
      </div>

      <ArrowIcon />
    </Link>
  );
};

export default LinkBox;
