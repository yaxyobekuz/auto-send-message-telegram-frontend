import { useEffect, useCallback, useState } from "react";
import { Link, Navigate } from "react-router-dom";

// Api
import api from "../api/config";

// Lottie
import Lottie from "lottie-react";

// Utils
import { extractNumbers } from "../lib/utils";

// Hooks
import useStore from "../hooks/useStore";
import useTelegram from "../hooks/useTelegram";

// Components
import ArrowIcon from "../components/ArrowIcon";

// Icons
import homeIcon from "../assets/icons/home.svg";
import trashIcon from "../assets/icons/trash.svg";

// Animated stickers
import ducks from "../assets/animated/ducks.json";

const Users = () => {
  const auth = localStorage.getItem("auth");
  if (auth) return <Content />;
  return <Navigate to="/auth" />;
};

const Content = () => {
  const [msg, setMsg] = useState("");
  const { setHeaderColor } = useTelegram();
  const [name, setName] = useState("Admin ");
  const { data: userData } = useStore("user");
  const [phone, setPhone] = useState("+998 ");
  const [isAdding, setIsAdding] = useState(false);
  const { data: usersData, updateData: updateUsersData } = useStore("users");

  if (userData?.role !== "owner") {
    window.location.href = "/";
    return <i>Foydalanuvchilarni olish uchun ega huquqi bo'lishi kerak!</i>;
  }

  const handleAddUser = () => {
    if (isAdding) return;
    const phoneString = extractNumbers(phone);

    if (phoneString.length !== 12) {
      return setMsg("Telefon raqam noto'g'ri kiritildi!");
    }

    if (!phoneString.startsWith("998")) {
      return setMsg("Telefon raqam o'zbekiston raqami emas!");
    }

    setMsg("");
    setIsAdding(true);

    api
      .post("/api/users/user/new", { name, phone: `+${phoneString}` })
      .then(({ ok, user }) => {
        if (!ok) throw new Error();

        setName("Admin ");
        setPhone("+998 ");
        setMsg("Foydalanuvchi qo'shildi");
        if (!usersData?.finished) return;
        updateUsersData({ users: [...usersData.users, user] });
      })
      .catch(({ error }) => setMsg(error || "Nimadir xato ketdi"))
      .finally(() => setIsAdding(false));
  };

  useEffect(() => {
    setHeaderColor("#f2f5fc");
  }, []);

  return (
    <div className="flex flex-col items-center gap-3.5 container py-5">
      {/* Top */}
      <Lottie animationData={ducks} className="size-32" />
      <h1>Foydalanuvchilar</h1>

      {/* Add user */}
      <div className="w-full bg-white space-y-4 p-5 rounded-2xl">
        <h2 className="font-medium">Foydalanuvchi qo'shish</h2>

        <input
          type="text"
          value={name}
          placeholder="Admin ..."
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          value={phone}
          placeholder="+998 ..."
          onChange={(e) => setPhone(e.target.value)}
        />

        {msg && <i className="inline-block text-sm text-gray-500">{msg}</i>}

        {/* Update groups btn */}
        <button
          disabled={isAdding}
          className="btn-primary"
          onClick={handleAddUser}
        >
          Qo'shish{isAdding && "..."}
        </button>
      </div>

      {/* Homepage link */}
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

      {/* users list */}
      <UsersList />
    </div>
  );
};

const UsersList = () => {
  const [deletableUsers, setDeletableUsers] = useState([]);
  const { data, hasError, isLoading, updateData, updateError, updateLoading } =
    useStore("users");

  const loadUsers = useCallback(async () => {
    if (isLoading || data?.finished) return;
    updateLoading(true);

    api
      .get(`/api/users/`, { params: { page: data?.page, limit: 15 } })
      .then(({ ok, users, pages }) => {
        if (!ok) throw new Error();
        updateData({ users: [...(data?.users || []), ...users] });

        if ((data?.page || 1) >= pages) return updateData({ finished: true });

        updateData({ page: (data?.page || 1) + 1 });
      })
      .catch(() => updateError(true))
      .finally(() => updateLoading(false));
  }, [data?.page, isLoading, data?.finished]);

  const handleDeleteuser = (id) => {
    if (deletableUsers.includes(id)) return;
    setDeletableUsers((prev) => [...prev, id]);

    api
      .delete(`/api/users/user/${id}`)
      .then(({ ok }) => {
        if (!ok) throw new Error();
        updateData({ users: data.users?.filter((user) => user?._id !== id) });
      })
      .finally(() => {
        setDeletableUsers((prev) => prev?.filter((userId) => userId !== id));
      });
  };

  useEffect(() => {
    if (!data?.users) loadUsers();
  }, []);

  if (hasError) return <p>Nimadir xato ketdi...</p>;

  return (
    <div className="w-full">
      {/* List */}
      <ul className="bg-white rounded-2xl mb-5">
        {data?.users?.map((user, index) => {
          const isDeleting =
            deletableUsers?.length > 0
              ? deletableUsers?.includes(user?._id)
              : false;

          return (
            <li
              key={index}
              className="flex items-center gap-3.5 border-b py-3.5 px-5 last:border-none"
            >
              <div className="flex items-center justify-center shrink-0 size-8 bg-[#f2f5fc] rounded-full">
                {index + 1}
              </div>

              <div>
                <h3 className="line-clamp-1 font-medium">{user.name}</h3>
                <p className="text-gray-500">{user?.phone}</p>
              </div>

              {user?.role !== "owner" && (
                <button
                  disabled={isDeleting}
                  onClick={() => handleDeleteuser(user?._id)}
                  className="ml-auto shrink-0 disabled:opacity-50"
                >
                  <img src={trashIcon} alt="O'chirish" className="size-8" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Extra load */}
      {!data?.finished && !isLoading && (
        <div className="flex justify-center w-full">
          <button
            onClick={loadUsers}
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

export default Users;
