"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    fullname: "",
    dateOfBirth: null,
    password: "",
    confirmPassword: "",
    constituency: "",
    uvc: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(true);
  const [validPassword, setValidPassword] = React.useState(true);

  //To check that the password, email and user length are the greater then 0 so the submit button works
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.fullname.length > 0 &&
      validEmail &&
      validPassword
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, validEmail, validPassword]);

  //Validates email having @, .com, .co.uk
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Checks password for at least one lowercase letter, uppercase letter, at least one number and minimum of 6 characters.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const calculateAge = (birthdate: Date) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const onRegister = async () => {
    try {
      if (
        user.password === user.confirmPassword &&
        validateEmail(user.email) &&
        validatePassword(user.password)
      ) {
        //check if user is over 18
        const age = calculateAge(user.dateOfBirth);
        if (age < 18) {
          toast.error("You must be at least 18 years old to register.");
          return;
        }

        const response = await axios.post("/api/users/register", user);

        //Added delay to the router push so notification would popup
        toast.success("Registration Successful", {
          onClose: () => {
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          },
        });

        console.log("Register success", response.data);
      } else {
        if (!validateEmail(user.email)) {
          setValidEmail(false);
        }

        if (!validatePassword(user.password)) {
          setValidPassword(false);
        }

        if (user.password !== user.confirmPassword) {
          setPasswordsMatch(false);
        }
      }
    } catch (error: any) {
      console.log("Failed to Register", error.response);
      toast.error("Failed to register. Please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md md:w-[500px] mt-[10px] py-[50px] px-10 ">
        <div
          className="font-semibold text-white text-[35px] md:py-2 text-center leading-normal"
          style={{
            WebkitTextStroke: "1px #000000",
            fontFamily: "Kanit-Semibold, Helvetica",
          }}
        ></div>
        <h2 className="text-2xl text-center font-bold mb-6">Register</h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="fullname" className="mb-2">
            Full Name:
          </label>
          <input
            className="border-2 p-2"
            id="fullname"
            type="text"
            value={user.fullname}
            onChange={(e) => setUser({ ...user, fullname: e.target.value })}
            placeholder="Please enter your fullname"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="mb-2">
            Email:
          </label>
          <input
            className="border-2 p-2"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
              setValidEmail(true); // Reset the error state on change
            }}
            placeholder="Please enter your email"
          />
          {!validEmail && (
            <p className="text-red-500">
              Email is invalid. Please check again.
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="DoB" className="mb-2">
            Date of Birth:
          </label>
          <DatePicker
            className="border-2 p-2"
            selected={user.dateOfBirth}
            onChange={(date: any) => setUser({ ...user, dateOfBirth: date })}
            placeholderText="Select your date of birth"
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="constituency" className="mb-2">
            Constituency:
          </label>
          <select
            className="border-2 p-2"
            id="constituency"
            value={user.constituency}
            onChange={(e) => {
              setUser({ ...user, constituency: e.target.value });
            }}
          >
            <option value="">Select Constituency</option>
            <option value="Shangri-la-Town">Shangri-la-Town</option>
            <option value="Northern-Kunlun-Mountain">
              Northern-Kunlun-Mountain
            </option>
            <option value="Western-Shangri-la">Western-Shangri-la</option>
            <option value="Naboo-Vallery">Naboo-Vallery</option>
            <option value="New-Felucia">New-Felucia</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="mb-2">
            Password:
          </label>
          <input
            className="border-2 p-2"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
              setValidPassword(true); // Reset the error state on change
            }}
            placeholder="Please enter your password"
          />
          {!validPassword && (
            <p className="text-red-500">
              Password must have at least one capital letter, one lowercase
              letter, one number, and a minimum of 6 characters.
            </p>
          )}
        </div>
        <div className="flex flex-col mb-4 w-full">
          <label htmlFor="confirmPassword" className="mb-2">
            Confirm Password:
          </label>
          <input
            className={`border-2 p-2 ${passwordsMatch ? "" : "border-red-500"}`}
            id="confirmPassword"
            type="password"
            value={user.confirmPassword}
            onChange={(e) => {
              setUser({ ...user, confirmPassword: e.target.value });
              setPasswordsMatch(true); // Reset the error state on change
            }}
            placeholder="Please confirm your password"
          />
          {!passwordsMatch && (
            <p className="text-red-500">Passwords do not match</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={onRegister}
            className={`md:w-[120px] md:h-[60px] w-[200px] h-[50px] bg-button rounded-[20px] shadow-lg mb-3 transition-colors duration-200 ease-in-out ${
              buttonDisabled
                ? "hover:bg-red-500 cursor-not-allowed"
                : "hover:bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
            disabled={buttonDisabled}
          >
            Submit
          </button>
        </div>
        <div className="border-b-[2px] border-gray-500 mt-4 mb-4"></div>
        <div className="text-center text-[#465362] hover:underline hover:text-opacity-70 transition-all transition-[0.3s] ease-in-out">
          <Link href="/login">Have an account? Login</Link>
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

export default Register;
