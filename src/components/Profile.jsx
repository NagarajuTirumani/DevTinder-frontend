import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { API_URL } from "../utils/constants";
import { addUser } from "../store/slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.appData);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    about: "",
    skills: [],
    age: "",
    gender: "",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
  });

  useEffect(() => {
    setProfile({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email,
      about: user?.about,
      skills: user?.skills || [],
      age: user?.age || "",
      gender: user?.gender || "",
      imgUrl:
        user?.imgUrl ||
        "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
    });
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    const { email, ...restProfile } = profile;
    try {
      const response = await axios.patch(
        `${API_URL}/profile/edit`,
        restProfile
      );
      if (response.data.data) {
        dispatch(addUser(response.data.data));
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="bg-gray-50 flex justify-center items-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="w-[50%] mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-8">
            <img
              src={profile.imgUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            {isEditing && (
              <input
                type="text"
                name="imgUrl"
                value={profile.imgUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900">
                  {profile.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900">{profile.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-900">{profile.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900">{profile.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-lg text-gray-900">{profile.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            ) : (
              <p className="mt-1 text-lg text-gray-900">{profile.about}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
