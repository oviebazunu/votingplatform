import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import UVCCode from "@/models/uvcCodeModels";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { uvcCode } = reqBody;
    console.log(reqBody);

    // Check if the provided UVC code exists in the database
    const existingUVC = await UVCCode.findOne({ uvcCode });

    if (existingUVC) {
      // If the UVC code exists, return a success response
      return NextResponse.json({
        message: "UVC Code exists",
        success: true,
      });
    } else {
      // If the UVC code doesn't exist, return an error response
      return NextResponse.json(
        { error: "UVC code does not exist" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
