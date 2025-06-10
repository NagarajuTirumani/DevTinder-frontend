import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { setRequests, removeRequest } from "../store/slice";

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
    <div
      className="bg-gray-50 p-6 pt-20"
      style={{ minHeight: "calc(100vh - 128px)" }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Connection Requests
      </h1>
      <div className="flex justify-center items-center">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No pending requests</p>
            <p className="text-gray-400">
              You'll see connection requests here when someone wants to connect
              with you!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {requests.map((request) => (
              <div key={request._id} className="relative">
                <UserCard
                  user={request.fromUserId}
                  buttons={[
                    {
                      text: "Accept",
                      onClick: () =>
                        handleRequestAction(request._id, "accepted"),
                      className: "btn btn-primary",
                    },
                    {
                      text: "Reject",
                      onClick: () =>
                        handleRequestAction(request._id, "rejected"),
                      className: "btn btn-secondary",
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
