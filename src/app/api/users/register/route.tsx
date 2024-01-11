import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, fullname, dateOfBirth, password, constituency, uvc } =
      reqBody;

    console.log(reqBody);

    //Check if email or uvc already exists

    const userEmail = await User.findOne({ email });
    const userUVC = await User.findOne({ uvc });

    if (userEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    } else if (userUVC) {
      return NextResponse.json(
        { error: "UVC already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const isAdmin = email === "election@shangrila.gov.sr";

    // Create a new user instance with hashed password
    const newUser = new User({
      email,
      fullname,
      dateOfBirth,
      password: hashedPassword,
      constituency,
      uvc,
      isAdmin,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // Return a JSON response indicating success
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    //Return a JSON response for any error that occurs
    return NextResponse.json({ error: error.messsage }, { status: 500 });
  }
}
