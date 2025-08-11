import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Api
import api from "../api/config";

// Hooks
import useStore from "../hooks/useStore";

// Icons
import reloadIcon from "../assets/icons/reload.svg";

const MainLayout = () => {
  const location = useLocation();
  const auth = localStorage.getItem("auth");
  const { data, hasError, isLoading, updateData, updateLoading, updateError } =
    useStore("user");

  const loadUser = () => {
    updateError(false);
    updateLoading(true);

    api
      .get("/api/users/user/me")
      .then(({ ok, user }) => {
        if (!ok) throw new Error();
        updateData(user);
      })
      .catch(() => updateError(true))
      .finally(() => updateLoading(false));
  };

  useEffect(() => {
    const token = JSON.parse(auth);
    if (token && !data) loadUser();
    if (!token) updateLoading(false);
  }, [location.pathname]);

  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent loadUser={loadUser} />;
  return <Content />;
};

const ErrorContent = ({ loadUser }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <button
        onClick={loadUser}
        className="flex items-center justify-center size-12 bg-white rounded-full"
      >
        <img
          width={28}
          height={28}
          alt="Yangilash"
          src={reloadIcon}
          className="size-7"
        />
      </button>
    </div>
  );
};

const LoadingContent = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex items-center justify-center size-12 bg-white rounded-full">
        <div className="animate-spin size-7 rounded-full border-x-blue-500 border-y-white border-2" />
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
