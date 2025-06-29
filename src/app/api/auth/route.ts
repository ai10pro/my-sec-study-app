import { prisma } from "@/libs/prisma";
import { verifyJwt } from "@/app/api/_helper/verifyJwt";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/_types/ApiResponse";
import { UserProfile } from "@/app/_types/UserProfile";

export const dynamic = "force-dynamic"; // 動的ルーティングを強制
export const fetchCache = "no-store"; // キャッシュを無効化
export const revaildate = 0; // キャッシュの有効期限を0に設定

export const GET = async (req: NextRequest) => {
  try {
    let userId: string | null = "";
    userId = await verifyJwt(req);
    if (!userId) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "認証情報が無効です。再度ログインしてください。",
      };
      return NextResponse.json(res);
    }

    // ユーザープロファイルを取得
    const user = (await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })) as UserProfile | null;

    if (!user) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "ユーザープロファイルが見つかりません。",
      };
      return NextResponse.json(res);
    }

    // ユーザープロファイルを返す
    const res: ApiResponse<UserProfile> = {
      success: true,
      payload: user,
      message: "ユーザープロファイルを取得しました。",
      metadata: JSON.stringify({ publishedAt: new Date().toISOString() }),
    };
    return NextResponse.json(res);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "認証の確認中にエラーが発生しました";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "認証のに関するバックエンド処理に失敗しました",
    };
    return NextResponse.json(res);
  }
};
