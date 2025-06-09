import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="bg-gray-50 flex justify-center items-center" style={{ height: "calc(100vh - 128px)" }}>
      {feed && <UserCard user={feed[0]} />}
    </div>
  );
};

export default Feed;
