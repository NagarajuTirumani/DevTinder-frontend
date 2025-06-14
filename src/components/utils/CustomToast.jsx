import React from "react";
import ReactDOM from "react-dom";

const ICONS = {
  success: (
    <svg
      className="h-6 w-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="12" fill="white" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-6 w-6 text-[#EB5D58]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="12" fill="white" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 9l-6 6m0-6l6 6"
      />
    </svg>
  ),
};

const CustomToast = ({ message, open, onClose, type = "success" }) => {
  if (!open) return null;
  const toast = (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100000] min-w-[250px] max-w-xs flex items-center rounded-xl shadow-lg text-white`}
      style={{
        background:
          type === "success" ? "rgb(75, 176, 82)" : "rgb(235, 93, 88)",
        transition: "all 0.3s",
        padding: "5px 10px",
      }}
    >
      <span className="mr-3 flex-shrink-0">{ICONS[type]}</span>
      <span className="flex-1 text-base text-[12px]">{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <svg
          className="h-5 w-5 text-white hover:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
  return ReactDOM.createPortal(toast, document.body);
};

export default CustomToast;
