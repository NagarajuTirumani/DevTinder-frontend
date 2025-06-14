import React, { createContext, useContext, useState, useCallback } from "react";
import CustomToast from "./CustomToast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const show = useCallback((message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2000);
  }, []);

  const close = useCallback(() => setToast((t) => ({ ...t, open: false })), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <CustomToast open={toast.open} message={toast.message} type={toast.type} onClose={close} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}; 