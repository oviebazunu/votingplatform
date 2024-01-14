"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const VoterDashboard = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votedFor, setVotedFor] = useState(() =>
    localStorage.getItem("votedFor")
  );

  const userConstituency = Cookies.get("constituency"); // Assuming user's constituency is stored in cookies

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const response = await axios.get("/api/users/getVotingStatus");
        if (!response.data.votingEnabled && !isAdmin) {
          router.push("/result");
        }
      } catch (error) {
        console.error("Error fetching voting status:", error);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/api/users/candidateParty");
        const filteredCandidates = response.data.filter(
          (candidate: { constituency: string | undefined }) =>
            candidate.constituency === userConstituency
        );
        setCandidates(filteredCandidates);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCandidates();
    checkVotingStatus();
  }, [router, userConstituency, isAdmin]);

  // Function to handle button click
  const handleButtonClick = (party: React.SetStateAction<string>) => {
    setSelectedParty(party);
    setShowPopup(true);
  };

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) {
      alert("No candidate selected!");
      return;
    }

    try {
      const userEmail = Cookies.get("email");
      console.log("Sending Email:", userEmail);

      if (!userEmail) {
        toast.error("User email not found.");
        return;
      }

      // Attempt to update the user's 'voted' status
      await axios.post("/api/users/votes", { email: userEmail });

      // If the user hasn't voted before, increment the candidate's vote count
      await axios.post("/api/users/candidateParty", {
        candidateId: selectedCandidate._id,
      });

      setVotedFor(selectedCandidate.name);

      if (selectedCandidate) {
        localStorage.setItem("votedFor", selectedCandidate.name);
        setVotedFor(selectedCandidate.name);
      }

      setShowPopup(false);
      toast.success("Your vote has been registered!");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle the scenario when the user has already voted
        toast.error("You have already voted.");
      } else {
        // Handle other errors
        setError(error.message);
        toast.error("Error when voting");
      }
    }
  };

  const logout = async () => {
    try {
      axios.get("/api/users/logout");
      localStorage.removeItem("votedFor");
      toast.success("Logout successful", {
        onClose: () => {
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error("Error. Failed to logout.");
    }
  };

  // Popup component
  const CandidatePopup = () => {
    if (!showPopup) return null;

    const partyCandidates = candidates.filter(
      (candidate: any) => candidate.party === selectedParty
    );

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white text-center">
          <h3 className="text-lg font-bold">
            Select a Candidate from {selectedParty}
          </h3>
          <ul>
            {partyCandidates.map((candidate: any, index: any) => (
              <li key={index} className="my-2">
                <button
                  className={`p-2 border rounded hover:bg-gray-200 ${
                    selectedCandidate === candidate ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handleCandidateSelect(candidate)}
                >
                  {candidate.name}
                </button>
              </li>
            ))}
          </ul>
          {selectedCandidate && (
            <button
              className="bg-blue-500 text-white p-2 rounded mt-4 mr-2"
              onClick={handleConfirmVote}
            >
              Confirm Vote
            </button>
          )}
          <button className="text-center" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Logout Button */}
      <div className="fixed top-4 right-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-medium text-black">
                Candidate Party List
              </h2>
              <p className="text-gray-500">
                Choose who you want to win? You only get one vote!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <button
                onClick={() => handleButtonClick("Blue Party")}
                className="p-6 bg-blue-500 text-white rounded-md text-xl"
              >
                Blue Party
              </button>
              <button
                onClick={() => handleButtonClick("Red Party")}
                className="p-6 bg-red-500 text-white rounded-md text-xl"
              >
                Red Party
              </button>
              <button
                onClick={() => handleButtonClick("Yellow Party")}
                className="p-6 bg-yellow-500 text-black rounded-md text-xl"
              >
                Yellow Party
              </button>
              <button
                onClick={() => handleButtonClick("Independent")}
                className="p-6 bg-gray-400 text-black rounded-md text-xl"
              >
                Independent
              </button>
            </div>
            {/* Display the voted candidate */}
            {votedFor && (
              <div className="voted-info">
                <p>
                  You have voted for: <strong>{votedFor}</strong>
                </p>
              </div>
            )}
          </div>
          <CandidatePopup />
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
    </div>
  );
};

export default VoterDashboard;
