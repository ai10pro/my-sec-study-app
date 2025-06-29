"use server";
import { emailSchema } from "./../_types/CommonSchemas";
// signup.ts
// サインアップの動作全般

import { prisma } from "@/libs/prisma";
import { signupRequestSchema } from "@/app/_types/SignupRequest";
import { userProfileSchema } from "@/app/_types/UserProfile";
import type { SignupRequest } from "@/app/_types/SignupRequest";
import type { UserProfile } from "@/app/_types/UserProfile";
import type { ServerActionResponse } from "@/app/_types/ServerActionResponse";
import bcryptjs from "bcryptjs";

export const signupServerAction = async (
  signupRequest: SignupRequest,
): Promise<ServerActionResponse<UserProfile | null>> => {
  try {
    const payload = signupRequestSchema.parse(signupRequest);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // スパム対策のための遅延

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existingUser) {
      return {
        success: false,
        payload: null,
        message: "このメールアドレスはすでに登録されています。",
      };
    }

    const hashedPassword = await bcryptjs.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
      },
    });

    const res: ServerActionResponse<UserProfile> = {
      success: true,
      payload: userProfileSchema.parse(user),
      message: "ユーザー登録が完了しました。",
    };
    return res;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error(errorMsg);
    return {
      success: false,
      payload: null,
      message: errorMsg,
    };
  }
};
