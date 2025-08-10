import { useEffect } from "react";
import { Link } from "react-router-dom";

// Lottie
import Lottie from "lottie-react";

// Hooks
import useTelegram from "../hooks/useTelegram";

// Components
import ArrowIcon from "../components/ArrowIcon";

// Icons
import usersIcon from "../assets/icons/users.svg";
import messagesIcon from "../assets/icons/messages.svg";

// Animated stickers
import duckShrugging from "../assets/animated/duck-shrugging.json";

const Home = () => {
  const token = localStorage.getItem("auth");
  if (token) return <AuthenticatedUser />;
  return <UnauthenticatedUser />;
};

const AuthenticatedUser = () => {
  const { user, setHeaderColor } = useTelegram();
  const { first_name: firstName, photo_url: photoUrl, username } = user || {};

  useEffect(() => {
    setHeaderColor("#2563eb");
  }, []);

  return (
    <div className="">
      {/* Top */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-400 pt-5 pb-10 -mb-5 z-0">
        <div className="flex items-center justify-between gap-3.5 container">
          <b className="text-xl font-semibold text-white">
            Xabarlarni boshqarish.
          </b>

          <Link to="/messages" className="bg-white px-5 py-1.5 rounded-full">
            Xabarlar
          </Link>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-5 relative z-10 container bg-gradient-to-b from-white to-[#f2f5fc] pt-4 pb-8 rounded-t-3xl">
        {/* Photo */}
        <img
          width={56}
          height={56}
          src={photoUrl}
          alt={`${firstName} profil rasmi`}
          className="size-14 bg-gray-200 rounded-full"
        />

        <div className="space-y-1.5">
          <h1 className="line-clamp-1 text-xl font-medium text-[#333]">
            {firstName || "Foydalanuvchi"}
          </h1>

          <p className="text-blue-500">@{username || "username"}</p>
        </div>
      </div>

      {/* Sections link */}
      <div className="container space-y-5">
        {/* Users */}
        <Link
          to="/users"
          className="flex items-center gap-5 justify-between bg-white p-5 rounded-xl"
        >
          <div className="flex items-center gap-5">
            <img
              width={48}
              height={48}
              src={usersIcon}
              className="size-12"
              alt="Foydalanuvchilar"
            />

            <span className="text-lg">Foydalanuvchilar</span>
          </div>

          <ArrowIcon />
        </Link>

        {/* Messages */}
        <Link
          to="/messages"
          className="flex items-center gap-5 justify-between bg-white p-5 rounded-xl"
        >
          <div className="flex items-center gap-5">
            <img
              width={48}
              height={48}
              alt="Xabar"
              src={messagesIcon}
              className="size-12"
            />

            <span className="text-lg">Xabarlar</span>
          </div>

          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
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

          <h1>Hisobingizga kirmagansiz</h1>

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
