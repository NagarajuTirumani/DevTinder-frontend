import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./utils/Loader";

const socket = io(API_URL);

function Chat() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
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

    socket.emit("join-room", { fromUserId: user._id, toUserId: toUserId });

    socket.on("send-message", (msg) => {
      if (msg.fromUserId === user._id) return;
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(), // temporary ID
          fromUserId: msg.fromUserId,
          message: msg.message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, toUserId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/chat/`, {
        toUserId,
      });
      console.log(res.data.data.messages);
      if (res?.data && Array.isArray(res?.data?.data?.messages)) {
        setMessages(res.data.data.messages);
      }
      if (res?.data && Array.isArray(res?.data?.data?.participants)) {
        const currentUser = res.data.data.participants.find(
          (participant) => participant._id !== toUserId
        );
        const otherUser = res.data.data.participants.find(
          (participant) => participant._id === toUserId
        );
        setUsers({ self: currentUser, other: otherUser });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUserId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("send-message", {
      message: input,
      fromUserId: user._id,
      toUserId: toUserId,
    });
    setMessages((msgs) => [
      ...msgs,
      {
        _id: Date.now().toString(), // temporary ID
        fromUserId: user._id,
        message: input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setInput("");
  };

  if (loading || !users?.other || !users?.self) {
    return <Loader message="Loading chat..." />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-128px)] max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 p-0 sm:p-4 relative overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <img
          src={users?.other?.imgUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
        />
        <div>
          <div className="font-bold text-white text-lg">
            {users?.other?.firstName + " " + users?.other?.lastName}
          </div>
          <div className="text-xs text-gray-400">Online</div>
        </div>
      </div>
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => {
          const isSelf = msg.fromUserId === user._id;
          const displayUser = isSelf ? users?.self : users?.other;
          const formatTime = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return (
            <div
              key={msg._id}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              {!isSelf && (
                <img
                  src={displayUser?.imgUrl}
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
                <div>{msg.message}</div>
                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
              {isSelf && (
                <img
                  src={displayUser?.imgUrl}
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
