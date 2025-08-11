import { Link } from "react-router-dom";

// Components
import ArrowIcon from "./ArrowIcon";

// Icons
import homeIcon from "../assets/icons/home.svg";

const HomepageLink = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-5 w-full bg-white p-5 rounded-2xl"
    >
      <ArrowIcon direction="left" />

      <div className="flex items-center gap-5">
        <img
          alt="Uy"
          width={48}
          height={48}
          src={homeIcon}
          className="size-12"
        />

        <span className="text-lg">Bosh sahifa</span>
      </div>
    </Link>
  );
};

export default HomepageLink;
