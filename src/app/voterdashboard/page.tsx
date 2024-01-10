"use client";
import React, { useState } from "react";

const VoterDashboard = () => {
  // State to manage popup visibility and selected party
  const [showPopup, setShowPopup] = useState(false);
  const [selectedParty, setSelectedParty] = useState("");

  const candidates = {
    "Blue Party": ["Candidate A", "Candidate B", "Candidate C"],
    "Red Party": ["Candidate D", "Candidate E", "Candidate F"],
    "Yellow Party": ["Candidate G", "Candidate H", "Candidate I"],
    Independent: ["Candidate J", "Candidate K"],
  };

  // Function to handle button click
  const handleButtonClick = (party: React.SetStateAction<string>) => {
    setSelectedParty(party);
    setShowPopup(true);
  };

  // Popup component
  const CandidatePopup = () => {
    if (!showPopup) return null;

    const partyCandidates = candidates[selectedParty] || [];

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white text-center">
          <h3 className="text-lg font-bold">
            Select a Candidate from {selectedParty}
          </h3>
          <ul>
            {partyCandidates.map((candidate, index) => (
              <li key={index} className="my-2">
                <button className="p-2 border rounded hover:bg-gray-200 ">
                  {candidate}
                </button>
              </li>
            ))}
          </ul>
          <button className="text-center" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
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
      </div>
      <CandidatePopup />
    </div>
  );
};

export default VoterDashboard;
