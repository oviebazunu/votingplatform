import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import VotingStatus from "@/models/votingStatusModel"; // A model to store the voting status

connect();

export async function GET(request: NextRequest) {
  try {
    const votingStatus = await VotingStatus.findOne({});
    if (!votingStatus) {
      // If there's no document found, assume voting is enabled by default
      return NextResponse.json({ votingEnabled: true }, { status: 200 });
    }
    return NextResponse.json(
      { votingEnabled: votingStatus.votingEnabled },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching voting status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
