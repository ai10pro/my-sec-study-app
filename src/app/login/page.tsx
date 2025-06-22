"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/_components/Button";
import { LoginRequest, loginRequestSchema } from "../_types/LoginRequest";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();
  const [isLoginCompleted, setIsLoginCompleted] = useState(false);

  const formMethods = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;

  // ルートエラー（サーバサイドで発生した認証エラー）の表示設定の関数
  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  // 初期設定
  useEffect(() => {
    // クエリパラメータからメールアドレスの初期値をセット
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    formMethods.setValue(c_Email, email || "");
  }, [formMethods]);

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faRightToBracket} className="mr-1.5" />
        ログインページ
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          console.log("ログイン処理");
          setIsLoginCompleted(true);
          // ここにログイン処理を実装
        }}
        className={twMerge("mt-4 flex flex-col gap-y-4")}
      >
        <div>
          <label htmlFor={c_Email} className="mb-2 block font-bold">
            メールアドレス
          </label>
          {/* <TextInputField	>を定義して使用 option=> formMethods(c_email), fieldErrors */}
          {/* <ErrorMsgField>を定義して使用 */}
        </div>
        <div>
          <label htmlFor={c_Password} className="mb-2 block font-bold">
            パスワード
          </label>
          {/* <TextInputField	>を定義して使用 option=> formMethods(c_Password), fieldErrors */}
          {/* <ErrorMsgField>を定義して使用 */}
        </div>
        <Button
          variant="indigo"
          width="stretch"
          className={twMerge("tracking-widest")}
          // isBusy
          disabled={false}
        >
          ログイン
        </Button>
      </form>
      {/* ログイン完了後 */}
      {isLoginCompleted && (
        <div>
          <div className="mt-4 flex items-center gap-x-2">
            <FontAwesomeIcon icon={faSpinner} spin />
            <div>ようこそ、{}テストネーム さん。</div>
          </div>
          <NextLink href="/" className="text-blue-500 hover:underline">
            自動的に画面が切り替わらないときはこちらをクリックしてください。
          </NextLink>
        </div>
      )}
    </main>
  );
};

export default Page;
