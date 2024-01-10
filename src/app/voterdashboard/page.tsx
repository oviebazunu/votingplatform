import React from "react";

const VoterDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="flex flex-col items-center text-lg">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Candidate Party List
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Choose who you want to win? <br /> You only get one vote!
          </p>
          <div className="grid grid-cols-2 gap-6 text-center">
            <button className="p-6 bg-blue-500 text-white text-xl rounded-lg">
              Blue Party
            </button>
            <button className="p-6 bg-red-500 text-white text-xl rounded-lg">
              Red Party
            </button>
            <button className="p-6 bg-yellow-500 text-black text-xl rounded-lg">
              Yellow Party
            </button>
            <button className="p-6 bg-gray-400 text-black text-xl rounded-lg">
              Independent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
