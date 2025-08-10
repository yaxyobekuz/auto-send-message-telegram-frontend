import { useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";

// Api
import api from "../api/config";

// Lottie
import Lottie from "lottie-react";

// Hooks
import useStore from "../hooks/useStore";
import useTelegram from "../hooks/useTelegram";

// Components
import ArrowIcon from "../components/ArrowIcon";

// Icons
import homeIcon from "../assets/icons/home.svg";
import groupsIcon from "../assets/icons/groups.svg";

// Animated stickers
import duckHeart from "../assets/animated/duck-heart.json";

const Groups = () => {
  const auth = localStorage.getItem("auth");
  if (auth) return <Content />;
  return <Navigate to="/auth" />;
};

const Content = () => {
  const { setHeaderColor } = useTelegram();
  const { data: userData, updateData: updateUserData } = useStore("user");
  const {
    isLoading: isUpdatingGroups,
    updateLoading: updateUserGroupsUpdating,
  } = useStore("userGroups");

  const handleUpdateGroups = () => {
    if (isUpdatingGroups) return;
    updateUserGroupsUpdating(true);

    api
      .post("/api/groups/update")
      .then(({ ok, totalGroups }) => {
        if (!ok) throw new Error();
        updateUserData({ groupsCount: totalGroups });
      })
      .finally(() => updateUserGroupsUpdating(false));
  };

  useEffect(() => {
    setHeaderColor("#f2f5fc");
  }, []);

  const { groupsCount } = userData || {};

  return (
    <div className="flex flex-col items-center gap-3.5 container py-5">
      {/* Top */}
      <Lottie animationData={duckHeart} className="size-32" />
      <h1>Guruhlar</h1>

      {/* Total groups info */}
      <div className="w-full bg-white space-y-4 p-5 rounded-2xl">
        <div className="flex items-center gap-3.5">
          <img
            width={48}
            height={48}
            alt="Guruhlar"
            src={groupsIcon}
            className="size-12"
          />

          <p className="font-medium">
            Jami guruhlar soni: {groupsCount.toLocaleString()}ta
          </p>
        </div>

        {/* Update groups btn */}
        <button
          className="btn-primary"
          disabled={isUpdatingGroups}
          onClick={handleUpdateGroups}
        >
          Guruhlarni yangilash{isUpdatingGroups && "..."}
        </button>
      </div>

      {/* Homepage link */}
      <Link
        to="/"
        className="flex items-center gap-5 w-full bg-white p-5 rounded-xl"
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

      {/* Groups list */}
      <GroupsList userData={userData} />
    </div>
  );
};

const GroupsList = ({ userData }) => {
  const { data, hasError, isLoading, updateData, updateError, updateLoading } =
    useStore("groups");

  const fetchGroups = useCallback(async () => {
    if (isLoading || data?.finished) return;
    updateLoading(true);

    api
      .get(`/api/groups/user/${userData._id}`, {
        params: { page: data?.page, limit: 20 },
      })
      .then(({ ok, groups, pages }) => {
        if (!ok) throw new Error();
        updateData({ groups: [...(data?.groups || []), ...groups] });

        if (data?.page >= pages) {
          return updateData({ finished: true });
        }

        updateData({ page: (data?.page || 1) + 1 });
      })
      .catch(() => updateError(true))
      .finally(() => updateLoading(false));
  }, [data?.page, isLoading, data?.finished, userData?._id]);

  useEffect(() => {
    if (!data?.groups) fetchGroups();
  }, []);

  if (hasError) return <p>Nimadir xato ketdi...</p>;

  return (
    <div className="w-full">
      {/* List */}
      <ul className="bg-white rounded-2xl mb-5">
        {data?.groups?.map((group, index) => (
          <li
            key={index}
            className="flex items-center gap-3.5 border-b py-3.5 px-5 last:border-none"
          >
            <div className="flex items-center justify-center shrink-0 size-8 bg-[#f2f5fc] rounded-full">
              {index + 1}
            </div>

            <div className="">
              <h3 className="line-clamp-1 font-medium">{group.title}</h3>
              <p className="text-gray-500">
                {new Date(group.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Extra load */}
      {!data?.finished && !isLoading && (
        <div className="flex justify-center w-full">
          <button
            onClick={fetchGroups}
            className="bg-white px-8 py-3.5 rounded-full"
          >
            Yana yuklash
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <p className="text-center">Yuklanmoqda...</p>}
    </div>
  );
};

export default Groups;
