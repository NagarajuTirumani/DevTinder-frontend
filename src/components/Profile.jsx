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
      className="bg-base-100 flex justify-center items-start p-4 md:p-6 lg:p-8"
    >
      <div className="w-full md:w-[80%] lg:w-[50%] mx-auto bg-base-300 rounded-lg shadow-md p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content">Profile</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 text-primary-content rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-8">
            <img
              src={profile.imgUrl}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            />
            {isEditing && (
              <input
                type="text"
                name="imgUrl"
                value={profile.imgUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full mt-1 px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-base-content/80">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content"
                />
              ) : (
                <p className="mt-1 text-lg text-base-content">
                  {profile.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content"
                />
              ) : (
                <p className="mt-1 text-lg text-base-content">{profile.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content/80">
              Email
            </label>
            <p className="mt-1 text-lg text-base-content break-all">{profile.email}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-base-content/80">
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
                  className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content"
                />
              ) : (
                <p className="mt-1 text-lg text-base-content">{profile.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80">
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-lg text-base-content">{profile.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content/80">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-base-content resize-none"
              />
            ) : (
              <p className="mt-1 text-lg text-base-content whitespace-pre-wrap">{profile.about}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 pb-8">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-content rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
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
