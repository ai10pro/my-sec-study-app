import { userProfileSchema, type UserProfile } from "@/app/_types/UserProfile";
import { decodeJwt } from "jose";
import type { ApiResponse } from "../_types/ApiResponse";

// JWTトークンをデコードしてユーザープロファイルを取得する関数
export const jwtFetcher = (): ApiResponse<UserProfile | null> => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return { success: false, payload: null, message: "JWT not found" };
  }

  try {
    const payload = decodeJwt(jwt);
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwt");
      return {
        success: false,
        payload: null,
        message: "トークンの有効期限が切れています",
      };
    }

    return {
      success: true,
      payload: userProfileSchema.parse(payload),
      message: "",
      // message: "JWTトークンからユーザープロファイルを取得しました",
    };
  } catch (error) {
    localStorage.removeItem("jwt");
    return { success: false, payload: null, message: "Invalid token" };
  }
};
