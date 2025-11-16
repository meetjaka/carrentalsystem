import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [confirmationMsg, setConfirmationMsg] = React.useState("");
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!email || !password || (state === "register" && !name)) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        if (state === "register") {
          setConfirmationMsg(
            data.message || "Confirmation email sent. Please check your inbox."
          );
        } else {
          setToken(data.token);
          setShowLogin(false);
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center text-sm bg-[#0A0F14]/95 backdrop-blur-sm"
    >
      {confirmationMsg ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-6 m-auto items-center p-8 py-12 w-80 sm:w-[420px] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.04)] bg-[#121A22]"
        >
          <div className="flex items-center gap-3 mb-2">
            <img src={assets.logo} alt="NextDrive" className="h-8" />
            <h2 className="text-xl font-semibold text-[#DCE7F5]">NextDrive</h2>
          </div>
          <p className="text-lg font-medium text-[#DCE7F5] text-center">{confirmationMsg}</p>
          <button
            className="bg-[#0A4D9F] hover:bg-[#083A78] transition-all text-white w-full py-3 rounded-xl cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
            onClick={() => {
              setConfirmationMsg("");
              setState("login");
            }}
          >
            Back to Login
          </button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 m-auto items-start p-8 py-10 w-80 sm:w-[420px] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.04)] bg-[#121A22]"
        >
          <div className="w-full flex flex-col items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <img src={assets.logo} alt="NextDrive" className="h-8" />
              <h2 className="text-2xl font-semibold text-[#DCE7F5]">NextDrive</h2>
            </div>
            <p className="text-lg font-medium text-[#8DA0BF]">
              {state === "login" ? "Welcome Back" : "Create Account"}
            </p>
          </div>

          {state === "register" && (
            <div className="w-full">
              <label className="block text-sm font-medium text-[#DCE7F5] mb-2">
                Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
                className="border border-[rgba(255,255,255,0.04)] bg-[#0F161C] rounded-xl w-full px-4 py-3 mt-1 text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-transparent transition-all"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <label className="block text-sm font-medium text-[#DCE7F5] mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email"
              className="border border-[rgba(255,255,255,0.04)] bg-[#0F161C] rounded-xl w-full px-4 py-3 mt-1 text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-transparent transition-all"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#DCE7F5] mb-2">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              className="border border-[rgba(255,255,255,0.04)] bg-[#0F161C] rounded-xl w-full px-4 py-3 mt-1 text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-transparent transition-all"
              type="password"
              required
            />
          </div>

          <div className="w-full text-center pt-2">
            <p className="text-sm text-[#8DA0BF]">
              {state === "register" ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setState("login")}
                    className="text-[#0A4D9F] cursor-pointer hover:text-[#083A78] transition-colors font-medium"
                  >
                    Sign In
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setState("register")}
                    className="text-[#0A4D9F] cursor-pointer hover:text-[#083A78] transition-colors font-medium"
                  >
                    Sign Up
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0A4D9F] hover:bg-[#083A78] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white w-full py-3 rounded-xl cursor-pointer mt-2 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
          >
            {loading
              ? "Please wait..."
              : state === "register"
              ? "Create Account"
              : "Sign In"}
          </button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default Login;
