import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import duckShrugging from "../assets/animated/duck-shrugging.json";

const Home = () => {
  const token = localStorage.getItem("auth");
  if (token) return <AuthenticatedUser />;
  return <UnauthenticatedUser />;
};

const AuthenticatedUser = () => {
  return <div className="">User logged in content</div>;
};

const UnauthenticatedUser = () => {
  return (
    <div className="h-screen container">
      <div className="flex flex-col items-center justify-between gap-3.5 size-full py-5">
        <div className="flex flex-col items-center gap-5">
          <Lottie
            width={128}
            height={128}
            className="size-32"
            animationData={duckShrugging}
          />

          <h1 className="text-xl font-medium">Hisobingizga kirmagansiz</h1>

          <p className="text-gray-400 text-center">
            Botdan foydalanishdan oldin iltimos <br /> hisobingizga kiring.
          </p>
        </div>

        <Link to="/auth" className="btn-primary">
          Hisobga kirish
        </Link>
      </div>
    </div>
  );
};

export default Home;
