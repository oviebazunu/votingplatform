import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Candidate from "@/models/candidatePartyModels";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Check if the request is for voting
    if (reqBody.candidateId) {
      const { candidateId } = reqBody;
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return NextResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }

      candidate.votes += 1; // Increment the vote count
      const updatedCandidate = await candidate.save();
      return NextResponse.json(updatedCandidate, { status: 200 });
    }

    const { name, party, votes, constituency } = reqBody;
    //Check if candidate exists
    const existingCandidate = await Candidate.findOne({ name });
    if (existingCandidate) {
      return NextResponse.json(
        { error: "Candidate with this name already exists" },
        { status: 400 }
      );
    }

    // If not voting, then create a new candidate
    const newCandidate = new Candidate({ name, party, votes, constituency });
    const savedCandidate = await newCandidate.save();
    return NextResponse.json(savedCandidate, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const candidates = await Candidate.find({});
    return NextResponse.json(candidates, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
