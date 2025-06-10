import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addConnections } from "../store/slice";

const ConnectionCard = ({ connection }) => {
  const { firstName, lastName, imgUrl, about, skills } = connection;
  return (
    <div className="card bg-base-100 w-72 shadow-lg hover:shadow-xl transition-shadow">
      <figure className="px-4 pt-4">
        <img
          src={
            imgUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
          }
          alt="profile"
          className="rounded-xl h-48 w-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">{about}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {skills?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              +{skills.length - 3} more
            </span>
          )}
        </div>
        {/* <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">Message</button>
          <button className="btn btn-outline btn-sm">View Profile</button>
        </div> */}
      </div>
    </div>
  );
};

const Connections = () => {
  const { connections } = useSelector((state) => state.appData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getConnections = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/connections`);
      dispatch(addConnections(response.data?.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div
      className="bg-gray-50 p-6 pt-20"
      style={{ minHeight: "calc(100vh - 128px)" }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">My Connections</h1>
      <div className="flex justify-center items-center">
        {connections?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No connections yet</p>
            <p className="text-gray-400">
              Start connecting with other developers!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
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
