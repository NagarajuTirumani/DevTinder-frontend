import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const users = {
  self: {
    id: 1,
    name: "You",
    avatar: "/devtinder.png",
  },
  other: {
    id: 2,
    name: "Alex",
    avatar: "/vite.svg",
  },
};

const sampleMessages = [
  {
    id: 1,
    userId: 2,
    text: "Hey! 👋 Looking for a React partner?",
    time: "10:00 AM",
  },
  {
    id: 2,
    userId: 1,
    text: "Hi Alex! Yes, I love React. What are you working on?",
    time: "10:01 AM",
  },
  {
    id: 3,
    userId: 2,
    text: "Building a cool DevTinder clone. Want to join?",
    time: "10:02 AM",
  },
  {
    id: 4,
    userId: 1,
    text: "That sounds awesome! Count me in 🚀",
    time: "10:03 AM",
  },
];

const socket = io(API_URL);

function Chat() {
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.appData);
  const { toUserId } = useParams();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user || !toUserId) return;
    socket.on("connect", (socket) => {
      socket.join();
    });

    socket.emit("join-room", { currentUserId: user._id, toUserId: toUserId });

    socket.on("send-message", (msg) => {
      if (msg.currentUserId === user._id) return;
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          userId: msg.currentUserId,
          text: msg.message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, toUserId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("send-message", {
      message: input,
      currentUserId: user._id,
      toUserId: toUserId,
    });
    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        userId: users.self.id,
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-128px)] max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 p-0 sm:p-4 relative overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <img
          src={users.other.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
        />
        <div>
          <div className="font-bold text-white text-lg">{users.other.name}</div>
          <div className="text-xs text-gray-400">Online</div>
        </div>
      </div>
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => {
          const isSelf = msg.userId === users.self.id;
          const user = isSelf ? users.self : users.other;
          return (
            <div
              key={msg.id}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              {!isSelf && (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end border border-blue-400"
                />
              )}
              <div
                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm break-words ${
                  isSelf
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {msg.time}
                </div>
              </div>
              {isSelf && (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover ml-2 self-end border border-purple-400"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900"
      >
        <input
          type="text"
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
