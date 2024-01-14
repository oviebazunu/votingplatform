import { NextRequest, NextResponse } from "next/server";
import Candidate from "@/models/candidatePartyModels";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const segments = pathname.split("/");
    // Assuming the constituency name is the last segment of the path
    const constituency = segments[segments.length - 1];

    if (!constituency) {
      return NextResponse.json(
        { error: "Constituency is required" },
        { status: 400 }
      );
    }

    const candidates = await Candidate.find({ constituency: constituency });

    const result = candidates.map((candidate) => ({
      name: candidate.name,
      party: candidate.party,
      vote: candidate.votes.toString(),
    }));

    return NextResponse.json(
      { constituency: constituency, result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
