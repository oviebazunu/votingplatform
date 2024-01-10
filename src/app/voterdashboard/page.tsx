import React from "react";

const VoterDashboard = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-medium text-black">
              Candidate Party List
            </h2>
            <p className="text-gray-500 text-center">
              Choose who you want to win? <br /> You only get one vote!
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-500 text-white rounded-md">
                Blue Party
              </div>
              <div className="p-4 bg-red-500 text-white rounded-md">
                Red Party
              </div>
              <div className="p-4 bg-yellow-500 text-black rounded-md">
                Yellow Party
              </div>
              <div className="p-4 bg-gray-400 text-black rounded-md">
                Independent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
