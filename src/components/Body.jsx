import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { API_URL } from "../utils/constants";
import { addUser } from "../store/slice";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.appData);

  const fetchUser = async () => {
    try {
      if (user) return;
      const response = await axios.get(`${API_URL}/profile/view`, {});
      if (response.data.data) {
        dispatch(addUser(response.data.data));
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="bg-base-100" style={{ height: "calc(100vh - 64px)" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
