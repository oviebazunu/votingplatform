import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    //Checking if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    //create token data
    const tokenData = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      voted: user.voted,
      constituency: user.constituency,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login Sucessful",
      success: true,
      isAdmin: user.isAdmin,
    });

    if (user.isAdmin) {
      response.cookies.set("isAdmin", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    }

    // Set token cookie
    response.cookies.set("token", token, { httpOnly: true });

    // Set email cookie
    response.cookies.set("email", user.email, {
      secure: true,
      sameSite: "strict",
    });

    //Set constituency cookie
    response.cookies.set("constituency", user.constituency, {
      secure: true,
      sameSite: "strict",
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
