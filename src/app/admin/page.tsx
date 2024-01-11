"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const [candidate, setCandidate] = useState({
    name: "",
    party: "",
    votes: 0,
    constituency: "",
  });

  const [candidatesList, setCandidates] = useState([]); // State for candidates list
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null);

  // Function to update candidate details
  const updateCandidateDetails = (key: any, value: any) => {
    setCandidate({ ...candidate, [key]: value });
  };

  const registerCandidate = async () => {
    try {
      const response = await axios.post("/api/users/candidateParty", candidate);
      // Handle successful candidate registration
      toast.success("Candidate is registered");
      console.log("Candidate Registered:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Registration Error:", error.response.data);
        toast.error("Error when adding candidate");
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("/api/users/candidateParty");
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(); // Initial fetch
    const interval = setInterval(fetchCandidates, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-wrap justify-between space-x-4">
        <div className="flex-grow min-w-[300px] bg-white rounded-lg shadow-md p-10">
          <h2 className="text-2xl text-center font-bold mb-6">
            Current Candidates
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <ul>
              {candidatesList.map((cand, index) => (
                <li key={index} className="mb-2 border-b-2 pb-2">
                  <span className="font-semibold">{cand.name}</span> -
                  <span> {cand.party}</span> - <span>{cand.votes}</span> -{" "}
                  <span>{cand.constituency}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md md:w-[500px] md:h-[450px] w-full mt-[10px] py-[50px] px-10">
          <h2 className="text-2xl text-center font-bold mb-6">
            Candidate Registration
          </h2>
          {/* Candidate Name */}
          <div className="flex flex-col mb-4">
            <label htmlFor="candidateName" className="mb-2">
              Candidate Name:
            </label>
            <input
              className="border-2 p-2"
              id="candidateName"
              type="text"
              value={candidate.name}
              onChange={(e) => updateCandidateDetails("name", e.target.value)}
              placeholder="Enter candidate's name"
            />
          </div>
          {/* Candidate Party */}
          <div className="flex flex-col mb-4">
            <label htmlFor="candidateParty" className="mb-2">
              Party:
            </label>
            <select
              className="border-2 p-2"
              id="candidateParty"
              value={candidate.party}
              onChange={(e) => updateCandidateDetails("party", e.target.value)}
            >
              <option value="">Select Party</option>
              <option value="Red Party">Red Party</option>
              <option value="Blue Party">Blue Party</option>
              <option value="Yellow Party">Yellow Party</option>
              <option value="Independent">Independent</option>
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="candidateParty" className="mb-2">
              Constituency:
            </label>
            <select
              className="border-2 p-2"
              id="candidateParty"
              value={candidate.constituency}
              onChange={(e) =>
                updateCandidateDetails("constituency", e.target.value)
              }
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
          <div className="flex items-center justify-center">
            <button
              onClick={registerCandidate}
              className="md:w-[200px] md:h-[70px] w-[200px] h-[50px] bg-button rounded-[20px] shadow-lg mb-3 transition-colors duration-200 ease-in-out hover:bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              Register Candidate
            </button>
          </div>
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

export default AdminPage;
