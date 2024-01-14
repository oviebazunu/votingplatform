import { NextRequest, NextResponse } from "next/server";
import Candidate from "@/models/candidatePartyModels";
import VotingStatus from "@/models/votingStatusModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const votingStatus = await VotingStatus.findOne();
    const electionOngoing = votingStatus ? votingStatus.votingEnabled : false;

    let status = electionOngoing ? "Pending" : "Completed";
    let winner = "Pending";

    if (!electionOngoing) {
      const candidates = await Candidate.aggregate([
        {
          $group: {
            _id: "$party",
            seat: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            party: "$_id",
            seat: "$seat",
          },
        },
      ]).sort({ seat: -1 });

      const totalSeats = candidates.reduce((acc, c) => acc + c.seat, 0);
      const majoritySeats = totalSeats / 2;
      const topParty = candidates[0];

      winner =
        topParty && topParty.seat > majoritySeats
          ? topParty.party
          : "Hung Parliament";

      return NextResponse.json(
        {
          status,
          winner,
          seats: candidates.map((c) => ({
            party: c.party,
            seat: c.seat.toString(),
          })),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ status, winner }, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
