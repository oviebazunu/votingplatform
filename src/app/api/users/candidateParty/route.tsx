import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Candidate from "@/models/candidatePartyModels";
import User from "@/models/userModels";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Received Request Body:", reqBody);

    // Check if the request is for voting
    if (reqBody.candidateId) {
      const { candidateId, userEmail } = reqBody;

      const user = await User.findOne({ email: userEmail });
      if (user && user.voted) {
        return NextResponse.json(
          { error: "User has already voted" },
          { status: 403 }
        );
      }

      // Find and update the candidate
      const updateResult = await Candidate.updateOne(
        { _id: candidateId },
        { $inc: { votes: 1 } } // Increment the votes by 1
      );

      if (updateResult.matchedCount === 0) {
        // No document was found with the provided ID
        return NextResponse.json(
          { error: "Candidate not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Vote successfully registered" },
        { status: 200 }
      );
    }

    // Logic to create a new candidate
    const { name, party, votes, constituency } = reqBody;
    const existingCandidate = await Candidate.findOne({ name });
    if (existingCandidate) {
      return NextResponse.json(
        { error: "Candidate already exists" },
        { status: 400 }
      );
    }
    const newCandidate = new Candidate({ name, party, votes, constituency });
    const savedCandidate = await newCandidate.save();
    return NextResponse.json(savedCandidate, { status: 201 });
  } catch (error: any) {
    console.error("Error in candidateParty POST:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const candidates = await Candidate.find({});
    return NextResponse.json(candidates, { status: 200 });
  } catch (error: any) {
    console.error("Error in candidateParty GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
