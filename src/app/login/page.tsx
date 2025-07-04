"use client";

import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { decodeJwt } from "jose";
import { mutate } from "swr";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faRightToBracket,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReCaptchaV2 } from "@/app/_components/ReCaptchaV2";

import { Button } from "@/app/_components/Button";
import { LoginRequest, loginRequestSchema } from "@/app/_types/LoginRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { UserProfile, userProfileSchema } from "../_types/UserProfile";
import { ApiResponse } from "../_types/ApiResponse";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();
  const [isLoginCompleted, setIsLoginCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false); // ログイン処理中の状態を管理
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // ユーザープロフィールの状態を管理
  const [showPassword, setShowPassword] = useState(true); // パスワードの表示/非表示を管理
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY!;
  // フォームの処理関連の準備と設定
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 初期設定
  useEffect(() => {
    // クエリパラメータからメールアドレスの初期値をセット
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    formMethods.setValue(c_Email, email || "");
  }, [formMethods]);

  // ルートエラーメッセージの解消に関する設定
  useEffect(() => {
    const subscription = formMethods.watch((value, { name }) => {
      // ルートエラーがある場合、メールアドレスまたはパスワードの入力があればエラーをクリア
      if (name === c_Email || name === c_Password) {
        formMethods.clearErrors("root");
      }
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  // ログイン完了後の処理
  useEffect(() => {
    if (isLoginCompleted) {
      router.replace("/"); // ログイン完了後、トップページへリダイレクト
      router.refresh(); // ページをリフレッシュ
    }
  }, [isLoginCompleted, router]);

  // フォームの送信処理
  const onSubmit = async (formValues: LoginRequest) => {
    const endPoint = "/api/login"; // APIエンドポイントのURL
    console.log(JSON.stringify(formValues));
    try {
      setIsPending(true); // ログイン処理中の状態に設定
      setRootError(""); // ルートエラーをクリア

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        cache: "no-store", // キャッシュを無効化
      });
      setIsPending(false); // ログイン処理完了後、状態をリセット

      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as ApiResponse<unknown>;
      console.log(body);
      if (!body.success) {
        // ログイン失敗時の処理
        setRootError(body.message);
        return;
      }

      const jwt = body.payload as string;
      // JWTトークンをローカルストレージに保存
      localStorage.setItem("jwt", jwt);
      setUserProfile(userProfileSchema.parse(decodeJwt(jwt))); // JWTからユーザープロフィールを取得して状態にセット

      mutate("/api/auth", body); // 認証情報を更新するためにSWRのキャッシュを更新
      setIsLoginCompleted(true); // ログイン完了状態に設定
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "予期せぬエラーが発生しました。";
      setRootError(errorMsg); // エラーメッセージをルートエラーとして設定
    }
  };

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faRightToBracket} className="mr-1.5" />
        ログインページ
      </div>
      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)} // フォームの送信時にonSubmitを呼び出す
        className={twMerge("mt-4 flex flex-col gap-y-4")}
      >
        <div>
          <label htmlFor={c_Email} className="mb-2 block font-bold">
            メールアドレス
          </label>
          <TextInputField
            {...formMethods.register(c_Email)}
            id={c_Email}
            placeholder="name@example.com"
            type="email"
            disabled={isPending || isLoginCompleted} // ログイン処理中またはログイン完了後は入力不可
            error={!fieldErrors.email}
            autoComplete="email"
          />
          <ErrorMsgField msg={fieldErrors.email?.message} />
        </div>
        <div>
          <label htmlFor={c_Password} className="mb-2 block font-bold">
            パスワード
          </label>
          <div className="relative">
            <TextInputField
              {...formMethods.register(c_Password)}
              id={c_Password}
              placeholder="*********"
              type={showPassword ? "text" : "password"}
              disabled={isPending || isLoginCompleted} // ログイン処理中またはログイン完了後は入力不可
              error={!fieldErrors.password}
              autoComplete="off"
              className="pr-10" // 右側にアイコン用のスペースを確保
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isPending || isLoginCompleted}
              className={twMerge(
                "absolute top-1/2 right-3 -translate-y-1/2",
                "text-gray-500 hover:text-gray-700",
                "focus:text-gray-700 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              aria-label={
                showPassword ? "パスワードを非表示" : "パスワードを表示"
              }
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="h-4 w-4"
              />
            </button>
          </div>
        </div>

        <div style={{ margin: "1rem 0" }}>
          <ReCaptchaV2
            siteKey={siteKey}
            onVerify={setRecaptchaToken} // トークンを受け取ってstateを更新
          />
        </div>

        <Button
          variant="indigo"
          width="stretch"
          className={twMerge("tracking-widest")}
          isBusy={isPending} // ログイン処理中はボタンを無効化
          disabled={
            !formMethods.formState.isValid ||
            isPending ||
            isLoginCompleted ||
            !recaptchaToken
          } // フォームが無効な場合、またはログイン処理中、ログイン完了後はボタンを無効化
        >
          ログイン
        </Button>
      </form>
      {/* ログイン完了後 */}
      {isLoginCompleted && (
        <div>
          <div className="mt-4 flex items-center gap-x-2">
            <FontAwesomeIcon icon={faSpinner} spin />
            <div>ようこそ、{userProfile?.name}テストネーム さん。</div>
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
