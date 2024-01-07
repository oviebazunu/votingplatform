import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
  } catch (error: any) {
    //Return a JSON response for any error that occurs
    return NextResponse.json({ error: error.messsage }, { status: 500 });
  }
}
