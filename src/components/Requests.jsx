import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./utils/ToastContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { setRequests, removeRequest } from "../store/slice";
import { FaUserPlus } from "react-icons/fa";
import Loader from "./utils/Loader";

const Requests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.appData.requests || []);
  const { show } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/user/requests/pending`);
      dispatch(setRequests(response.data.data || []));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
      show(error.response?.data?.message || "Failed to fetch requests", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/request/review/${status}/${requestId}`);
      // Remove the request from the store
      dispatch(removeRequest(requestId));
      show(`Request ${status === "accepted" ? "accepted" : "rejected"} successfully!`, "success");
    } catch (error) {
      show(error.response?.data?.message || `Failed to ${status} request`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-gray-900 p-4 sm:p-6 pt-20" style={{ height: "calc(100vh - 64px)" }}>
      {isLoading && <Loader message="Loading requests..." />}
      <div className="max-w-7xl mx-auto">
        {requests.length > 0 && (
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Connection Requests
          </h1>
        )}
        
        <div className="flex justify-center items-center">
          {requests.length === 0 ? (
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
                No Pending Requests
              </h3>
              <p className="text-gray-400 text-center max-w-sm mb-6">
                You'll see connection requests here when someone wants to connect with you!
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
              >
                Find Developers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {requests.map((request) => (
                <div 
                  key={request._id} 
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <UserCard
                    user={request.fromUserId}
                    buttons={[
                      {
                        text: "Accept",
                        onClick: () => handleRequestAction(request._id, "accepted"),
                        className: "btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200",
                      },
                      {
                        text: "Reject",
                        onClick: () => handleRequestAction(request._id, "rejected"),
                        className: "btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200",
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
