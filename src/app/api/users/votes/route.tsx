import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, voted } = reqBody;

    console.log("Received Request Body:", reqBody);
    if (!reqBody.email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user has already voted
    if (user.voted) {
      return NextResponse.json(
        { message: "User has already voted" },
        { status: 403 }
      );
    }

    // Update the user's 'voted' status
    user.voted = true;
    await user.save();

    return NextResponse.json(
      { message: "User's vote status updated" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
