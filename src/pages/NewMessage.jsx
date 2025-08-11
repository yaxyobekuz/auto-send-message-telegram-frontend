import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import api from "../api/config";
import useStore from "../hooks/useStore";

const NewMessage = () => {
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: userMessagesData, updateData: updateUserMessagesData } =
    useStore("userMessages");

  const handleMessageChange = (value, index) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = value;
      return updatedMessages;
    });
  };

  const handleAddMessages = () => {
    if (isLoading || !time || !name) return;
    setIsLoading(true);

    const filteredMessages = messages.filter(Boolean);
    api
      .post("/api/messages/new", { name, time, messages: filteredMessages })
      .then(({ ok, message }) => {
        if (!ok) throw new Error();
        setName("");
        setTime("");
        setMessages([""]);
        alert("Xabar muvaffaqiyatli qo'shildi");
        if (!userMessagesData?.messages) return;

        // Save message to store
        const messages = [...userMessagesData?.messages, message];
        updateUserMessagesData({ messages });
      })
      .catch(({ error }) => alert(error || "Xabarni qo'shib bo'lmadi"))
      .finally(() => setIsLoading(false));
  };

  const addNewMessageField = () => {
    setMessages((prevMessages) => [...prevMessages, ""]);
  };

  return (
    <div className="min-h-screen container pt-5 pb-28">
      <div className="flex flex-col gap-3.5 h-full">
        {/* Header */}
        <PageHeader title="Yangi xabar qo'shish" to="/messages" />

        {/* Description */}
        <p className="text-gray-400">
          Yangi to'ldirish maydonlarini yaratib, xabarlarni kiriting. Siz
          kiritgan xabarlar kelajakda tasodifiy ravishda tanlanadi.
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
          onClick={addNewMessageField}
          className="btn-primary bg-blue-100 text-blue-500 hover:bg-blue-200 disabled:hover:bg-blue-100"
        >
          + Yangi maydon qo'shish
        </button>

        {/* Action btn */}
        <div className="fixed inset-x-0 bottom-0 container bg-white py-5">
          <button
            disabled={isLoading}
            className="btn-primary"
            onClick={handleAddMessages}
          >
            Qo'shish{isLoading && "..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessage;
