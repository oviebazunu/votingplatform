"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const login = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async () => {
    try {
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      //Added delay to the router push so notification would popup
      toast.success("Login Successful", {
        onClose: () => {
          setTimeout(() => {
            router.push("/voterdashboard");
          }, 1500);
        },
      });
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error("Login failed please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md md:w-[500px] mt-[10px] py-[50px] px-10 ">
        <h2 className="text-2xl text-center font-bold mb-6">Login</h2>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="mb-2">
            Email:
          </label>
          <input
            className="border-2 p-2"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Please enter your email"
          />
        </div>

        <div className="flex flex-col mb-4 relative">
          <label htmlFor="password" className="mb-2">
            Password:
          </label>
          <input
            className="border-2 p-2"
            id="password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Please enter your password"
          />
          <button
            className="absolute top-1/2 right-2 text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={onLogin}
            className={`md:w-[120px] md:h-[60px] w-[200px] h-[50px] bg-button rounded-[20px] shadow-lg mb-3 transition-colors duration-200 ease-in-out ${
              buttonDisabled
                ? "hover:bg-red-500 cursor-not-allowed"
                : "hover:bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
            disabled={buttonDisabled}
          >
            Login
          </button>
        </div>
        <div className="border-b-[2px] border-gray-500 mt-4 mb-4"></div>
        <div className="text-center text-[#465362] hover:underline hover:text-opacity-70 transition-all transition-[0.3s] ease-in-out">
          Forgotten Password?
        </div>
        <div className="text-center">or</div>
        <div className="text-center text-[#465362] hover:underline hover:text-opacity-70 transition-all transition-[0.3s] ease-in-out">
          <Link href="/register">Don't have an account? Register</Link>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default login;
