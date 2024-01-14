"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const result = () => {
  const router = useRouter();
  const [constituencyWinners, setConstituencyWinners] = useState({});
  const [overallWinner, setOverallWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partyWins, setPartyWins] = useState({});
  const [winningParty, setWinningParty] = useState("");
  const [electionResult, setElectionResult] = useState("");

  useEffect(() => {
    const fetchElectionResults = async () => {
      try {
        const response = await axios.get("/api/users/candidateParty");
        processElectionResults(response.data);
      } catch (error) {
        console.error("Error fetching election results:", error);
      }
    };

    fetchElectionResults();
  }, []);

  const processElectionResults = (candidates: any[]) => {
    let winners = {};
    let maxVotes = 0;
    let overallWinnerCandidate = null;
    let partyWins = {};
    let totalConstituencies = new Set();

    candidates.forEach(
      (candidate: {
        votes: number;
        constituency: unknown;
        party: string | number;
      }) => {
        if (candidate.votes > maxVotes) {
          maxVotes = candidate.votes;
          overallWinnerCandidate = candidate;
        }

        if (
          !winners[candidate.constituency] ||
          winners[candidate.constituency].votes < candidate.votes
        ) {
          winners[candidate.constituency] = candidate;
        }

        totalConstituencies.add(candidate.constituency);
        partyWins[candidate.party] = (partyWins[candidate.party] || 0) + 1;
      }
    );

    let overallMajorityParty = null;
    for (const [party, wins] of Object.entries(partyWins)) {
      if (wins > totalConstituencies.size / 2) {
        overallMajorityParty = party;
        break;
      }
    }

    setConstituencyWinners(winners);
    setOverallWinner(overallWinnerCandidate);
    setPartyWins(partyWins);
    setLoading(false);

    if (overallMajorityParty) {
      setElectionResult(
        `Winner: ${overallMajorityParty} with an overall majority.`
      );
    } else {
      setElectionResult(
        "Hung Parliament: No party has secured an overall majority."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading results...</p>
      </div>
    );
  }

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful", {
        onClose: () => {
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
      });
    } catch (error) {
      console.log(error.message);
      toast.error("Error. Failed to logout.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 max-w-2xl mx-auto rounded-xl shadow-md text-center mb-2">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Election Results
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-center pb-2">
              The elections are now over. Below are the winners for each
              constituency
            </h3>
            <h3>
              Overall Winner: {overallWinner?.name} ({overallWinner?.party})
            </h3>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Constituency Winners:</h3>
            {Object.entries(constituencyWinners).map(
              ([constituency, winner]) => (
                <p key={constituency} className="mb-1">
                  <span className="font-semibold">{constituency}:</span>
                  {winner.name} ({winner.party})
                </p>
              )
            )}
          </div>
        </div>
        <div className="bg-white p-8 max-w-2xl mx-auto rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Detailed Election Results
          </h2>
          <h3 className="text-lg font-medium mb-4 ">{electionResult}</h3>
          <h4 className="text-md font-medium mb-2 text-xl">
            Each Parties wins:
          </h4>
          {Object.entries(partyWins).map(([party, wins]) => (
            <p key={party} className="mb-1">
              {party}: {wins} Wins
            </p>
          ))}
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

export default result;
