import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { setRequests, removeRequest } from "../store/slice";
import { FaUserPlus } from "react-icons/fa";

const Requests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.appData.requests || []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/requests/pending`);
      dispatch(setRequests(response.data.data || []));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.post(`${API_URL}/request/review/${status}/${requestId}`);
      // Remove the request from the store
      dispatch(removeRequest(requestId));
      toast.success(
        `Request ${
          status === "accepted" ? "accepted" : "rejected"
        } successfully!`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${status} request`
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-gray-900 p-4 sm:p-6 pt-20" style={{ height: "calc(100vh - 64px)" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Connection Requests
        </h1>
        
        <div className="flex justify-center items-center">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <div className="p-4 rounded-full bg-gray-700/50 mb-6">
                <FaUserPlus className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No Pending Requests</h3>
              <p className="text-gray-400 text-center">
                You'll see connection requests here when someone wants to connect with you!
              </p>
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
