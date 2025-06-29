"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import NextLink from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faPenNib,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ReCaptchaV2 } from "@/app/_components/ReCaptchaV2";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignupRequest, signupRequestSchema } from "@/app/_types/SignupRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { signupServerAction } from "@/app/_actions/signup";

const Page: React.FC = () => {
  const c_Name = "name";
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(true); // パスワードの表示/非表示を管理
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY!;

  // フォームの処理関連の準備と設定
  const formMethods = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;

  // ルートエラー（サーバサイドで発生した認証エラー）の表示設定の関数
  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  // パスワードの表示/非表示を切り替える関数
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ルートエラーメッセージのクリアに関する設定
  useEffect(() => {
    const subscription = formMethods.watch((value, { name }) => {
      if (name === c_Name || name === c_Email || name === c_Password) {
        formMethods.clearErrors("root");
      }
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  // ログイン完了後のリダイレクト処理
  useEffect(() => {
    if (isSignUpCompleted) {
      router.replace(`/login?${c_Email}=${formMethods.getValues(c_Email)}`);
      router.refresh();
      console.log("サインアップ完了");
    }
  }, [formMethods, isSignUpCompleted, router]);

  // フォームの送信処理
  const onSubmit = async (signupRequest: SignupRequest) => {
    try {
      startTransition(async () => {
        // ServerAction (Custom Invocation) の利用
        const res = await signupServerAction(signupRequest);
        if (!res.success) {
          setRootError(res.message);
          return;
        }
        setIsSignUpCompleted(true);
      });
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
    }
  };

  return (
    <main>
      <div className="text-2xl font-bold">
        <FontAwesomeIcon icon={faPenNib} className="mr-1.5" />
        Signup
      </div>
      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={twMerge("mt-4 flex flex-col gap-y-4")}
      >
        <div>
          <label htmlFor={c_Name} className="mb-2 block font-bold">
            表示名
          </label>
          <TextInputField
            {...formMethods.register(c_Name)}
            id={c_Name}
            placeholder="寝屋川 タヌキ"
            type="text"
            disabled={isPending || isSignUpCompleted}
            error={!fieldErrors.name}
            autoComplete="name"
          />
          <ErrorMsgField msg={fieldErrors.name?.message} />
        </div>

        <div>
          <label htmlFor={c_Email} className="mb-2 block font-bold">
            メールアドレス（ログインID）
          </label>
          <TextInputField
            {...formMethods.register(c_Email)}
            id={c_Email}
            placeholder="name@example.com"
            type="email"
            disabled={isPending || isSignUpCompleted}
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
              disabled={isPending || isSignUpCompleted} // ログイン処理中またはログイン完了後は入力不可
              error={!fieldErrors.password}
              autoComplete="off"
              className="pr-10" // 右側にアイコン用のスペースを確保
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isPending || isSignUpCompleted}
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
          <ErrorMsgField msg={fieldErrors.password?.message} />
          <ErrorMsgField msg={fieldErrors.root?.message} />
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
          className="tracking-widest"
          disabled={
            !formMethods.formState.isValid ||
            formMethods.formState.isSubmitting ||
            isSignUpCompleted ||
            !recaptchaToken // reCAPTCHAのトークンが未取得の場合は無効化
          }
        >
          登録
        </Button>
      </form>

      {isSignUpCompleted && (
        <div>
          <div className="mt-4 flex items-center gap-x-2">
            <FontAwesomeIcon icon={faSpinner} spin />
            <div>サインアップが完了しました。ログインページに移動します。</div>
          </div>
          <NextLink
            href={`/login?${c_Email}=${formMethods.getValues(c_Email)}`}
            className="text-blue-500 hover:underline"
          >
            自動的に画面が切り替わらないときはこちらをクリックしてください。
          </NextLink>
        </div>
      )}
    </main>
  );
};

export default Page;
