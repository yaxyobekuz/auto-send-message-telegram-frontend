import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Api
import api from "../api/config";

// Hooks
import useStore from "../hooks/useStore";

// Components
import PageHeader from "../components/PageHeader";

const Message = () => {
  const { messageId } = useParams();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [messages, setMessages] = useState([""]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userMessagesData, updateData: updateUserMessagesData } =
    useStore("userMessages");

  const loadMessage = () => {
    api
      .get(`/api/messages/message/${messageId}`)
      .then(({ ok, message }) => {
        if (!ok) throw new Error();
        setName(message.name);
        setTime(message.time);
        setOldName(message.name);
        setMessages(message.messages);
      })
      .catch(({ error }) => setHasError(error || "Nimadir xato ketdi"))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateMessage = () => {
    if (isLoading || !time || !name) return;
    setIsLoading(true);

    const filteredMessages = messages.filter((m) => m?.trim() !== "");
    const formData = { name, time, messages: filteredMessages };

    api
      .put(`/api/messages/message/${messageId}`, formData)
      .then(({ ok, message }) => {
        if (!ok) throw new Error();
        alert("Xabar muvaffaqiyatli yangilandi");
        if (!userMessagesData?.messages) return;

        // Update message from store
        const messagesFromStore = (userMessagesData?.messages).map((m) =>
          m._id === messageId ? message : m
        );

        updateUserMessagesData({ messages: messagesFromStore });
      })
      .catch(({ error }) => alert(error || "Xabarni yangilab bo'lmadi"))
      .finally(() => setIsLoading(false));
  };

  const addMessageField = () => {
    setMessages((prevMessages) => [...prevMessages, ""]);
  };

  const handleMessageChange = (value, index) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = value;
      return updatedMessages;
    });
  };

  useEffect(loadMessage, []);

  if (hasError) return <ErrorContent />;

  if (isLoading) return <LoadingContent />;

  return (
    <div className="min-h-screen container pt-5 pb-28">
      <div className="flex flex-col gap-3.5 h-full">
        {/* Header */}
        <PageHeader title="Xabarni yangilash" to="/messages" />

        {/* Description */}
        <p className="text-gray-400">
          Siz ayni damda{" "}
          <strong className="font-medium text-[#333]">{oldName}</strong> nomli
          xabarni yangilamoqdasiz.
        </p>

        {/* Name */}
        <input
          type="text"
          value={name}
          placeholder="Xabarlar sarlavhasi"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Time */}
        <input
          type="time"
          value={time}
          placeholder="Xabarlar sarlavhasi"
          onChange={(e) => setTime(e.target.value)}
        />

        <b className="font-medium leading-none">Tasodifiy xabarlar</b>

        {/* Message inputs */}
        {messages.map((message, index) => (
          <input
            key={index}
            type="text"
            value={message}
            placeholder={`Xabar ${index + 1}`}
            onChange={(e) => handleMessageChange(e.target.value, index)}
          />
        ))}

        {/* Add field */}
        <button
          onClick={addMessageField}
          className="btn-primary bg-blue-100 text-blue-500 hover:bg-blue-200 disabled:hover:bg-blue-100"
        >
          + Yangi maydon qo'shish
        </button>

        {/* Action btn */}
        <div className="fixed inset-x-0 bottom-0 container bg-white py-5">
          <button
            disabled={isLoading}
            className="btn-primary"
            onClick={handleUpdateMessage}
          >
            Yangilash{isLoading && "..."}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingContent = () => {
  return (
    <div className="flex flex-col min-h-screen gap-3.5 h-full container py-5">
      {/* Header */}
      <PageHeader title="Xabarni yangilash" to="/messages" />

      <Skeleton className="w-full h-6" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-40 h-6" />
      <Skeleton />
      <Skeleton className="w-full h-12 mt-auto" />
    </div>
  );
};

const ErrorContent = () => {
  return (
    <div className="flex flex-col min-h-screen gap-3.5 h-full container py-5">
      {/* Header */}
      <PageHeader title="Xabarni yangilash" to="/messages" />

      <Skeleton className="w-full h-6" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-40 h-6" />
      <Skeleton />
      <Skeleton className="w-full h-12 mt-auto" />
    </div>
  );
};

const Skeleton = ({ className = "w-full h-12" }) => {
  return <div className={`animate-pulse bg-white rounded-md ${className}`} />;
};

export default Message;
