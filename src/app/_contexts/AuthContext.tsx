"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import type { UserProfile } from "@/app/_types/UserProfile";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { User } from "@prisma/client";
import { jwtFetcher } from "@/app/_contexts/jwtFetcher";

interface AuthContextProps {
  userProfile: UserProfile | null;
  logout: () => Promise<boolean>; // ログアウト関数の型定義
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { data: session } = useSWR<ApiResponse<UserProfile | null>>(
    "/api/auth",
    jwtFetcher,
  );

  useEffect(() => {
    if (session && session.success) {
      setUserProfile(session.payload); // ユーザープロファイルを設定
      return;
    }
    setUserProfile(null); // セッションがない場合はnullに設定
  }, [session]);

  const logout = async () => {
    // ログアウト処理
    // JWTトークンを削除
    localStorage.removeItem("jwt");

    // SWRのキャッシュを無効化
    mutate(() => true, undefined, { revalidate: false });
    setUserProfile(null); // ユーザープロファイルをnullに設定
    return true;
  };

  return (
    <AuthContext.Provider value={{ userProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
