import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

// Api
import api from "../api/config";

// Lottie
import Lottie from "lottie-react";

// Hooks
import useStore from "../hooks/useStore";
import useTelegram from "../hooks/useTelegram";

// Components
import LinkBox from "../components/LinkBox";
import HomepageLink from "../components/HomepageLink";

// Icons
import trashIcon from "../assets/icons/trash.svg";
import messageIcon from "../assets/icons/message.svg";
import userMessageIcon from "../assets/icons/user-message.svg";

// Animated stickers
import duckSendMessage from "../assets/animated/duck-send-message.json";

const Messages = () => {
  const auth = localStorage.getItem("auth");
  if (auth) return <Content />;
  return <Navigate to="/auth" />;
};

const Content = () => {
  const { setHeaderColor } = useTelegram();
  const { data: userData } = useStore("user");

  useEffect(() => {
    setHeaderColor("#f2f5fc");
  }, []);

  return (
    <div className="flex flex-col items-center gap-3.5 container py-5">
      {/* Top */}
      <Lottie animationData={duckSendMessage} className="size-32" />
      <h1>Xabarlar</h1>

      {/* Homepage link */}
      <HomepageLink />

      {/* New message */}
      <LinkBox
        alt="Xabar"
        to="/messages/new"
        icon={messageIcon}
        label="Yangi xabar qo'shish"
      />

      {/* All messages */}
      {/* <LinkBox
        alt="Xabar"
        to="/messages/all"
        icon={userMessageIcon}
        label="Barcha xabarlar"
      /> */}

      {/* User messages list */}
      <UserMessagesList userId={userData?._id} />
    </div>
  );
};

const UserMessagesList = ({ userId }) => {
  const [deletableMessages, setDeletableMessages] = useState([]);
  const { data, hasError, isLoading, updateData, updateError, updateLoading } =
    useStore("userMessages");

  const loadMessages = () => {
    if (isLoading || data?.finished) return;
    updateLoading(true);

    api
      .get(`/api/messages/user/${userId}`)
      .then(({ ok, messages }) => {
        if (!ok) throw new Error();
        updateData({ messages });
      })
      .catch(() => updateError(true))
      .finally(() => updateLoading(false));
  };

  const handleDeleteMessage = (id) => {
    if (deletableMessages.includes(id)) return;
    setDeletableMessages((p) => [...p, id]);

    api
      .delete(`/api/messages/message/${id}`)
      .then(({ ok }) => {
        if (!ok) throw new Error();
        updateData({
          messages: data.messages?.filter(({ _id }) => _id !== id),
        });
      })
      .finally(() => {
        setDeletableMessages((p) => p?.filter((msgId) => msgId !== id));
      });
  };

  useEffect(() => {
    if (!data?.messages) loadMessages();
  }, []);

  if (hasError) return <p>Nimadir xato ketdi...</p>;

  return (
    <div className="w-full">
      {/* List */}
      <ul className="bg-white rounded-2xl mb-5">
        {data?.messages?.map((message, index) => {
          const isDeleting =
            deletableMessages?.length > 0
              ? deletableMessages?.includes(message?._id)
              : false;

          return (
            <li
              key={index}
              className="flex items-center gap-3.5 relative border-b py-3.5 px-5 last:border-none"
            >
              {/* Index */}
              <div className="flex items-center justify-center shrink-0 size-8 bg-[#f2f5fc] rounded-full">
                {index + 1}
              </div>

              {/* Details */}
              <div>
                <h3 className="line-clamp-1 font-medium">{message.name}</h3>
                <p className="text-gray-500">{message?.time}</p>
              </div>

              {/* Delete btn */}
              <button
                disabled={isDeleting}
                className="relative z-10 ml-auto shrink-0 disabled:opacity-50"
                onClick={() => handleDeleteMessage(message?._id)}
              >
                <img src={trashIcon} alt="O'chirish" className="size-8" />
              </button>

              {/* Link */}
              <Link
                to={`/messages/message/${message?._id}`}
                className="absolute size-full inset-0 rounded-2xl"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
