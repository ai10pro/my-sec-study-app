import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";

import type { ApiResponse } from "@/app/_types/ApiResponse";
import { loginRequestSchema } from "@/app/_types/LoginRequest";
import { createJwt } from "@/app/api/_helper/createJwt";

export const POST = async (req: NextRequest) => {
  try {
    // リクエストボディを取得
    const result = loginRequestSchema.safeParse(await req.json());
    if (!result.success) {
      // バリデーションエラー ⇒ 400 Bad Request
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "リクエストボディの形式が不正です。",
      };
      return NextResponse.json(res, { status: 400 });
    }

    // ログイン処理の実行
    const loginRequest = result.data;

    // ユーザ情報の取得
    // ここではメールアドレスでユーザを検索し、存在するかどうかを確認
    const user = await prisma.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });
    if (!user) {
      // ユーザが存在しない ⇒ 401 Unauthorized
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "メールアドレスまたはパスワードが正しくありません。", // メールアドレスが存在しない場合でもセキュリティ上、このように出力する
      };
      return NextResponse.json(res, { status: 401 });
    }

    // パスワードの検証
    const isValidPassword = user.password === loginRequest.password;
    if (!isValidPassword) {
      // パスワードが不正 ⇒ 401 Unauthorized
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "メールアドレスまたはパスワードが正しくありません。",
      };
      return NextResponse.json(res, { status: 401 });
    }

    const tokenMaxAgeSeconds = 60 * 60 * 1; // トークンの有効期限を1時間に設定

    const jwt = await createJwt(user, tokenMaxAgeSeconds); // JWTトークンを生成
    const res: ApiResponse<string> = {
      // レスポンスの生成
      success: true, // 成功フラグ
      payload: jwt, // 生成したJWTトークンをペイロードに設定
      message: "", // メッセージは空
    };
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Login error:", errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "ログイン処理中にエラーが発生しました。",
    };
    return NextResponse.json(res, { status: 500 });
  }
};
