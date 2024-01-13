import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      sucess: true,
    });

    // Removes the 'token' cookie once logged out
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    // Also remove the 'isadmin' cookie
    response.cookies.set("isAdmin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    response.cookies.set("email", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    response.cookies.set("constituency", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
