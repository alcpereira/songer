import React, { useEffect, useState } from "react";

interface AlertProps {
  message: string;
  variant: "error" | "success";
}

const Alert: React.FC<AlertProps> = ({ message, variant }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-20 right-8 p-4 rounded-lg shadow-lg text-white ${
        variant === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Alert;
