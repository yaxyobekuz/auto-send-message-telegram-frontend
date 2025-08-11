import { Link } from "react-router-dom";

// Components
import ArrowIcon from "./ArrowIcon";

const PageHeader = ({ title, to = "/" }) => {
  return (
    <header className="flex items-center">
      <Link to={to} className="flex items-center w-8 h-8">
        <ArrowIcon direction="left" className="-ml-1" />
      </Link>

      {/* Title */}
      <h1>{title}</h1>
    </header>
  );
};

export default PageHeader;
