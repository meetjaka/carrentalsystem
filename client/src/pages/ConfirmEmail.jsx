import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Confirming...");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/user/confirm/${token}`)
      .then((res) => {
        setMessage(res.data.message || "Email confirmed. You can now log in.");
      })
      .catch(() => {
        setMessage("Invalid or expired confirmation link.");
      });
  }, [token]);

  return (
    <div className="flex flex-col gap-4 m-auto items-center p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white mt-20">
      <p className="text-2xl font-medium text-primary">{message}</p>
      <button
        className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
};

export default ConfirmEmail;
