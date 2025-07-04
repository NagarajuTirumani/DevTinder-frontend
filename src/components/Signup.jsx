import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import { API_URL, skillOptions, genderOptions } from "../utils/constants";
import { useToast } from "./utils/ToastContext";
import { addUser } from "../store/slice";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    age: "",
    gender: "",
    skills: [],
    about: "",
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { show } = useToast();

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errs.email = "Invalid email address";
    }
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.otp.trim()) errs.otp = "OTP is required";
    if (!formData.password.trim()) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!formData.age.trim()) {
      errs.age = "Age is required";
    } else if (
      isNaN(formData.age) ||
      +formData.age < 16 ||
      +formData.age > 100
    ) {
      errs.age = "Enter a valid age (16-100)";
    }
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.skills.length) errs.skills = "Select at least one skill";
    if (!formData.about.trim()) errs.about = "About is required";
    if (!formData.profilePhoto) errs.profilePhoto = "Profile photo is required";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSkillsChange = (selected) => {
    // Handle both predefined and custom skills
    const skills = selected ? selected.map(option => ({
      value: option.value,
      label: option.label
    })) : [];
    setFormData({ ...formData, skills });
    setErrors((prev) => ({ ...prev, skills: undefined }));
  };

  const handleGenderChange = (selected) => {
    setFormData({ ...formData, gender: selected ? selected.value : "" });
    setErrors((prev) => ({ ...prev, gender: undefined }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      show("Please fill all the fields", "error");
      return;
    }
    setLoading(true);
    try {
      // Call API to send OTP
      await axios.post(`${API_URL}/send-otp`, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      show("OTP sent to your email!", "success");
      setStep(2);
    } catch (error) {
      show(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('otp', formData.otp);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('skills', JSON.stringify(formData.skills.map((s) => s.value)));
      formDataToSend.append('about', formData.about);
      
      if (formData.profilePhoto) {
        // Convert base64 to blob
        const response = await fetch(formData.profilePhoto);
        const blob = await response.blob();
        formDataToSend.append('profilePhoto', blob, 'profile-photo.jpg');
      }
      const response = await axios.post(`${API_URL}/signup`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.data) {
        dispatch(addUser(response.data.data));
        show("Account created successfully!", "success");
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      }
    } catch (error) {
      show(error.response?.data?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#364152",
      borderColor: state.isFocused
        ? "#615FFF"
        : errors.gender
        ? "#f87171"
        : "#4b5563",
      borderWidth: state.isFocused ? "2px" : "1px",
      boxShadow: "none",
      outline: "none",
      outlineColor: "transparent",
      "&:hover": {
        borderColor: state.isFocused ? "#615FFF" : "#4b5563",
      },
      minHeight: "50px",
      borderRadius: 8,
    }),
    singleValue: (base) => ({ ...base, color: "white" }),
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
      "&:hover": {
        backgroundColor: state.isSelected ? "#6366f1" : "#4b5563",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#6366f1",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      "&:hover": {
        backgroundColor: "#4f46e5",
        color: "white",
      },
    }),
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-900 min-h-screen overflow-y-auto pb-20"
      style={{ minHeight: '100vh' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-6 p-4 sm:p-6 md:p-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl mx-4"
      >
        <div className="text-center">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
          >
            {step === 1 ? "Create your account" : "Complete your profile"}
          </motion.h2>
          <p className="text-sm sm:text-base text-gray-400">
            {step === 1
              ? "Join our community today"
              : "Enter OTP and more details"}
          </p>
        </div>

        {step === 1 && (
          <form
            className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
            onSubmit={handleSendOtp}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`pl-9 sm:pl-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                    errors.firstName
                      ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                      : "border border-gray-600 text-white placeholder-gray-400"
                  } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="First Name"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`pl-9 sm:pl-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                    errors.lastName
                      ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                      : "border border-gray-600 text-white placeholder-gray-400"
                  } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-9 sm:pl-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                  errors.email
                    ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                    : "border border-gray-600 text-white placeholder-gray-400"
                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer flex justify-center py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send OTP"
              )}
            </button>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200 relative group"
                >
                  Sign in
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <input
                type="text"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                  errors.otp
                    ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                    : "border border-gray-600 text-white placeholder-gray-400"
                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Enter OTP"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-9 sm:pl-10 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                  errors.password
                    ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                    : "border border-gray-600 text-white placeholder-gray-400"
                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200" />
                ) : (
                  <FaEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                  errors.age
                    ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                    : "border border-gray-600 text-white placeholder-gray-400"
                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Age"
                min="16"
                max="100"
              />
            </div>
            <div className="relative">
              <Select
                options={genderOptions}
                value={
                  genderOptions.find((g) => g.value === formData.gender) || null
                }
                onChange={handleGenderChange}
                placeholder="Select Gender"
                classNamePrefix="react-select"
                className="text-left react-select-container bg-transparent"
                styles={{
                  ...customSelectStyles,
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#364152",
                    borderColor: errors.gender ? "#ef4444" : state.isFocused ? "#615FFF" : "#4b5563",
                    borderWidth: errors.gender ? "1px" : state.isFocused ? "2px" : "1px",
                    boxShadow: "none",
                    outline: "none",
                    outlineColor: "transparent",
                    "&:hover": {
                      borderColor: state.isFocused ? "#615FFF" : errors.gender ? "#ef4444" : "#4b5563",
                    },
                    minHeight: "50px",
                    borderRadius: 8,
                  }),
                }}
              />
            </div>
            <div className="relative">
              <CreatableSelect
                isMulti
                options={skillOptions}
                value={formData.skills}
                onChange={handleSkillsChange}
                placeholder="Select or create skills"
                classNamePrefix="react-select"
                className="text-left bg-transparent"
                styles={{
                  ...customSelectStyles,
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#364152",
                    borderColor: errors.skills ? "#ef4444" : state.isFocused ? "#615FFF" : "#4b5563",
                    borderWidth: errors.skills ? "1px" : state.isFocused ? "2px" : "1px",
                    boxShadow: "none",
                    outline: "none",
                    outlineColor: "transparent",
                    "&:hover": {
                      borderColor: state.isFocused ? "#615FFF" : errors.skills ? "#ef4444" : "#4b5563",
                    },
                    minHeight: "50px",
                    borderRadius: 8,
                  }),
                }}
                formatCreateLabel={(inputValue) => `Create skill "${inputValue}"`}
                isValidNewOption={(inputValue) => inputValue.length >= 2}
                createOptionPosition="first"
              />
            </div>
            <div className="relative">
              <textarea
                name="about"
                id="about"
                value={formData.about}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
                  errors.about
                    ? "border-[1px] border-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.1)]"
                    : "border border-gray-600 text-white placeholder-gray-400"
                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div className="relative">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full bg-gray-700 border-2 border-dashed flex items-center justify-center ${
                      errors.profilePhoto ? "border-2 border-[#ef4444]" : "border-gray-500"
                    }`}>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="profilePhoto"
                    className={`flex flex-col items-center w-full max-w-lg mx-auto cursor-pointer bg-gray-700 border-2 border-dashed rounded-lg hover:bg-gray-600 hover:border-indigo-500 transition-colors duration-200 ${
                      errors.profilePhoto ? "border-2 border-[#ef4444]" : "border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB <span className="text-red-400">*</span></p>
                    </div>
                    <input
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            show("File size should be less than 10MB", "error");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, profilePhoto: reader.result });
                            setErrors((prev) => ({ ...prev, profilePhoto: undefined }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, profilePhoto: null });
                      setErrors((prev) => ({ ...prev, profilePhoto: undefined }));
                    }}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer flex justify-center py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign up"
              )}
            </button>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200 relative group"
                >
                  Sign in
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
