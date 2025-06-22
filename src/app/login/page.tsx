"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

import { Button } from "@/app/_components/Button";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();
  const [isLoginCompleted, setIsLoginCompleted] = useState(false);

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
