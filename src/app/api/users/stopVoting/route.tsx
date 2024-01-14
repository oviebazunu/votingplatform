import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import VotingStatus from "@/models/votingStatusModel"; // A model to store the voting status

connect();

export async function POST(request: NextRequest) {
  try {
    const currentStatus = await VotingStatus.findOne({});
    const isVotingEnabled = currentStatus ? currentStatus.votingEnabled : true;

    // Toggle the voting status
    await VotingStatus.updateOne(
      {},
      { $set: { votingEnabled: !isVotingEnabled } },
      { upsert: true }
    );

    return NextResponse.json(
      {
        message: isVotingEnabled
          ? "Voting has been stopped"
          : "Voting has been started",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error toggling voting status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
