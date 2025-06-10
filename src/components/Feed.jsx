import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { addFeed } from "../store/slice";
import { API_URL } from "../utils/constants";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { feed } = useSelector((state) => state.appData);

  const getFeed = async () => {
    try {
      if (feed) return;
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
    } catch (error) {
      if (error.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  const handleInterested = async (userId) => {
    try {
      await axios.post(`${API_URL}/request/send/${userId}`);
      toast.success("Request sent successfully!");
      // Refresh feed after sending request
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const handleIgnore = async (userId) => {
    try {
      await axios.post(`${API_URL}/user/ignore/${userId}`);
      // Refresh feed after ignoring
      const response = await axios.get(`${API_URL}/user/feed`);
      if (response.data.data) {
        dispatch(addFeed(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to ignore user");
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

  return (
    <div
      className="bg-gray-50 flex justify-center items-center"
      style={{ height: "calc(100vh - 128px)" }}
    >
      {feed && <UserCard user={feed[0]} buttons={feedButtons} />}
    </div>
  );
};

export default Feed;
