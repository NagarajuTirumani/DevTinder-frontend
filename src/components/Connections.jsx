import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addConnections } from "../store/slice";
import Loader from "./utils/Loader";
import { FaRegPaperPlane } from "react-icons/fa";

const ConnectionCard = ({ connection }) => {
  const { firstName, lastName, imgUrl, about, skills, _id } = connection;
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 w-full sm:w-80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700/50 hover:border-blue-500/50">
      {/* Subtle hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <figure className="relative px-4 pt-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10"></div>
        <img
          src={imgUrl || "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"}
          alt="profile"
          className="rounded-xl h-48 w-full object-cover transform group-hover:scale-102 transition-transform duration-300"
        />
      </figure>
      
      <div className="card-body relative z-20">
        <h2 className="card-title text-gray-100 group-hover:text-blue-300 transition-colors duration-300">
          {firstName} {lastName}
        </h2>
        <p className="text-sm text-gray-300/90 line-clamp-2 min-h-[2.5rem]">{about}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-content rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {skill}
            </span>
          ))}
          {skills?.length > 3 && (
            <span className="px-3 py-1 bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-content rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-200">
              +{skills.length - 3} more
            </span>
          )}
        </div>
        <button
          className="mt-4 w-[120px] flex items-center gap-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
          onClick={() => navigate(`/chat/${_id}`)}
        >
          <FaRegPaperPlane className="text-lg" />
          Message
        </button>
      </div>
    </div>
  );
};

const Connections = () => {
  const { connections = [] } = useSelector((state) => state.appData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getConnections = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/connections`);
      dispatch(addConnections(response.data?.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div
      className="bg-gray-900 p-4 sm:p-6 pt-20 pb-24 relative"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {loading && <Loader message="Loading Connections..." />}
      {connections?.length > 0 && (
        <h1 className="text-4xl font-extrabold mb-8 text-center select-none">
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-transparent bg-clip-text inline-flex items-center gap-3 select-none">
            <span className="transform transition-transform duration-200 select-none">🔗</span>
            My Connections
            <span className="transform transition-transform duration-200 select-none">🤝</span>
          </span>
        </h1>
      )}
      <div className="container mx-auto max-w-7xl mb-16">
        {connections?.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-12 border border-gray-700/50 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
              No Connections Yet
            </h3>
            <p className="text-gray-400 text-center max-w-sm mb-6">
              Your professional network is waiting to be built! Start connecting with amazing developers and expand your circle.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
            >
              Find Developers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {connections?.map((connection) => (
              <ConnectionCard key={connection._id} connection={connection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
