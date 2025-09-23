import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      confirmPassword,
      phone,
      role,
      password,
    } = await request.json();

    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json({
        message: "All fields are required !",
      });
    }

    const user = await prisma.pe_users.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        role,
        department,
        password: await bcrypt.hash(password, 10),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(JSON.parse(error));
  }
}
