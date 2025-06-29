/* verifyJwt.ts
 * JWTの検証を行う
 * @param jwt - 検証するJWTトークン
 * @returns <userid | null> - 成功時はユーザーID、失敗時はnull
 */

import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { userProfileSchema } from "@/app/_types/UserProfile";

export const verifyJwt = async (req: NextRequest): Promise<string | null> => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", ""); // AuthorizationヘッダーからJWTを取得
  if (!jwt) {
    console.error("JWT not found in request headers");
    return null; // JWTが存在しない場合はnullを返す
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || ""); // JWTの秘密鍵を取得
  try {
    const { payload } = await jwtVerify(jwt, secret); // JWTを検証
    const userProfile = userProfileSchema.parse(payload); // ペイロードをユーザープロフィールとしてパース
    return userProfile.id; // ユーザーIDを返す
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification failed:", error.message); // エラーメッセージをログに出力
    } else {
      console.error("JWT verification failed:", error); // その他のエラーをログに出力
    }
    return null; // 検証に失敗した場合はnullを返す
  }
};
