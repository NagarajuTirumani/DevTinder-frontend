import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "./utils/ToastContext";

import { API_URL } from "../utils/constants";
import { addUser } from "../store/slice";
import Loader from "./utils/Loader";
import CreatableSelect from "react-select/creatable";
import { skillOptions } from "../utils/constants";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.appData);
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    if (user) {
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
      setLoading(false);
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // eslint-disable-next-line no-unused-vars
    const { email, ...restProfile } = profile;
    try {
      const response = await axios.patch(
        `${API_URL}/profile/edit`,
        restProfile
      );
      if (response.data.data) {
        setIsEditing(false);
        dispatch(addUser(response.data.data));
        show("Profile updated successfully!", "success");
      }
    } catch (error) {
      show(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillsChange = (selected) => {
    const skills = selected ? selected.map(option => option.value) : [];
    setProfile({ ...profile, skills });
  };

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  return (
    <div
      className="bg-gray-900 p-4 md:pt-20 pb-24 xs:pt-0 xs:pb-0 relative"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {saving && <Loader message="Updating Profile..." />}
      <div 
        className="w-full md:w-[80%] lg:w-[50%] mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-4 md:p-6 lg:p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          animation: 'profileEntrance 0.8s ease-out forwards'
        }}
      >
        <style>
          {`
            @keyframes profileEntrance {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Profile</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-2 border-gray-700/50"
            />
            {isEditing && (
              <input
                type="text"
                name="imgUrl"
                value={profile.imgUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-100">
                  {profile.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-100">{profile.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-100 break-all">{profile.email}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
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
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-100">{profile.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-lg text-gray-100">{profile.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100 resize-none"
              />
            ) : (
              <p className="mt-1 text-lg text-gray-100 whitespace-pre-wrap">{profile.about}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills
            </label>
            {isEditing ? (
              <CreatableSelect
                isMulti
                options={skillOptions}
                value={profile.skills.map(skill => ({ value: skill, label: skill }))}
                onChange={handleSkillsChange}
                placeholder="Select or create skills"
                classNamePrefix="react-select"
                className="text-left"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                    borderColor: "#4b5563",
                    minHeight: "44px",
                  }),
                  multiValue: (base) => ({ ...base, backgroundColor: "#6366f1" }),
                  multiValueLabel: (base) => ({ ...base, color: "white" }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    ':hover': { backgroundColor: "#4f46e5", color: "white" },
                  }),
                  input: (base) => ({ ...base, color: "white" }),
                  placeholder: (base) => ({ ...base, color: "#98A1AE" }),
                  menu: (base) => ({ ...base, backgroundColor: "#374151" }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#6366f1"
                      : state.isFocused
                      ? "#4b5563"
                      : "#374151",
                    color: "white",
                  }),
                }}
                formatCreateLabel={(inputValue) => `Create skill "${inputValue}"`}
                isValidNewOption={(inputValue) => inputValue.length >= 2}
                createOptionPosition="first"
              />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
