import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { signJwtAcessToken } from "../../../helpers/jwt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        message: "All fields are required !",
      });
    }

    const user = await prisma.pe_users.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password !",
        },
        { status: 500 }
      );
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password: hashedPassword, ...result } = user;
      const acessToken = signJwtAcessToken(result);
      return NextResponse.json(
        {
          result: { ...result, acessToken },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Invalid email or password !",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("Something went wrong !");

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
