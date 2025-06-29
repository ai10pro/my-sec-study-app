import { SignJWT, jwtVerify } from "jose";
import type { UserProfile } from "@/app/_types/UserProfile";
import { userProfileSchema } from "@/app/_types/UserProfile";

/**
 * JWTトークンを生成するヘルパー関数
 * @param userProfile - ユーザープロファイル情報
 * @param tokenMaxAgeSeconds - トークンの有効期限（秒単位）
 * @returns - JWTトークン
 */

export const createJwt = async (
  userProfile: UserProfile,
  tokenMaxAgeSeconds: number,
): Promise<string> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!); // JWTのシークレットキーをエンコード
  const expireAt = new Date(Date.now() + tokenMaxAgeSeconds * 1000); // トークンの有効期限を計算

  const payload = userProfileSchema.parse(userProfile); // ユーザープロファイル情報をバリデーション
  // console.log("Creating JWT with payload:", payload);

  try {
    const jwt = await new SignJWT({ ...payload }) // JWTを生成
      .setProtectedHeader({ alg: "HS256" }) // アルゴリズムを指定
      .setExpirationTime(expireAt) // 有効期限を設定
      .sign(secret); // シークレットキーで署名
    return jwt; // 生成したJWTを返す
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT creation error:", error.message);
    }
    console.error("JWT creation error");
  }
  return "";
};
