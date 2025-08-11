import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Lottie
import Lottie from "lottie-react";

// Components
import LinkBox from "../components/LinkBox";

// Hooks
import useStore from "../hooks/useStore";
import useTelegram from "../hooks/useTelegram";

// Icons
import usersIcon from "../assets/icons/users.svg";
import logoutIcon from "../assets/icons/logout.svg";
import groupsIcon from "../assets/icons/groups.svg";
import messagesIcon from "../assets/icons/messages.svg";

// Animated stickers
import duckShrugging from "../assets/animated/duck-shrugging.json";

const Home = () => {
  const token = localStorage.getItem("auth");
  if (token) return <AuthenticatedUser />;
  return <UnauthenticatedUser />;
};

const AuthenticatedUser = () => {
  const navigate = useNavigate();
  const { data, clearData } = useStore("user");
  const { user, setHeaderColor } = useTelegram();
  const { first_name: firstName, photo_url: photoUrl, username } = user || {};

  useEffect(() => {
    setHeaderColor("#2563eb");
  }, []);

  const handleLogout = () => {
    clearData();
    navigate("/auth");
    localStorage.removeItem("auth");
  };

  return (
    <div className="flex flex-col min-h-screen">
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
      <div className="relative z-10 bg-[#f2f5fc] pt-4 pb-5 rounded-t-3xl">
        <div className="flex items-center gap-5 container">
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

            <div className="flex items-center gap-2 line-clamp-1">
              <p className="text-blue-500">@{username || "username"}</p>
              <span>|</span>
              <p className="text-gray-500">{data?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages link */}
      <div className="container space-y-5">
        {/* Users */}
        {data?.role === "owner" && (
          <LinkBox
            to="/users"
            icon={usersIcon}
            alt="Foydalanuvchilar"
            label="Foydalanuvchilar"
          />
        )}

        {/* Messages */}
        <LinkBox
          alt="Xabar"
          to="/messages"
          label="Xabarlar"
          icon={messagesIcon}
        />

        {/* Groups */}
        <LinkBox
          to="/groups"
          alt="Guruhlar"
          label="Guruhlar"
          icon={groupsIcon}
        />
      </div>

      {/* Logout */}
      <div className="container mt-auto py-5">
        <details className="bg-white p-5 rounded-2xl">
          <summary className="flex items-center justify-between">
            <img
              width={48}
              height={48}
              alt="Chiqish"
              src={logoutIcon}
              className="size-12"
            />

            <span className="text-lg">Hisobdan chiqish</span>
          </summary>
          <div className="pt-5">
            <button
              onClick={handleLogout}
              className="btn-primary bg-red-100 text-red-500 hover:bg-red-200"
            >
              Chiqish
            </button>
          </div>
        </details>
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
