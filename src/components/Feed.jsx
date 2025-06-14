import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "./utils/ToastContext";

import { addFeed } from "../store/slice";
import { API_URL } from "../utils/constants";
import UserCard from "./UserCard";
import Loader from "./utils/Loader";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { feed } = useSelector((state) => state.appData);
  const { show } = useToast();
  const [loading, setLoading] = useState(true);

  const getFeed = async () => {
    try {
      if (feed) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
    } catch (error) {
      if (error.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/request/send/interested/${userId}`);
      show("Request sent successfully!", "success");
      // Refresh feed after sending request
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
    } catch (error) {
      show(error.response?.data?.message || "Failed to send request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleIgnore = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/request/send/ignored/${userId}`);
      // Refresh feed after ignoring
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
      show("User ignored successfully!", "success");
    } catch (error) {
      show(error.response?.data?.message || "Failed to ignore user", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const feedButtons = feed?.[0]
    ? [
        {
          text: "Ignore",
          onClick: () => handleIgnore(feed[0]._id),
          className: "btn btn-primary",
        },
        {
          text: "Interested",
          onClick: () => handleInterested(feed[0]._id),
          className: "btn btn-secondary",
        },
      ]
    : [];

  if (loading) {
    return <Loader message="Loading feed..." />;
  }

  if (feed && feed.length === 0) {
    return (
      <div
        className="container mx-auto max-w-7xl px-4 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 128px)" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-12 border border-gray-700/50 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
          {/* Animated background elements */}
          <div className="absolute opacity-20">
            <div className="absolute top-8 left-8 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-700"></div>
          </div>

          {/* Connection animation icon */}
          <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-400 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
            No Developers Found
          </h3>
          <p className="text-gray-400 text-center max-w-sm mb-6">
            We're currently looking for developers that match your interests.
            Check back soon to discover potential coding partners!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-900 flex justify-center items-center"
      style={{ height: "calc(100vh - 116px)" }}
    >
      {feed && feed.length > 0 && (
        <UserCard user={feed[0]} buttons={feedButtons} />
      )}
    </div>
  );
};

export default Feed;
