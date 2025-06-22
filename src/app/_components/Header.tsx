"use client";

import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

import { twMerge } from "tailwind-merge";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-3xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white",
          )}
        >
          <div>
            <NextLink href="/">
              <FontAwesomeIcon icon={faChalkboardUser} className="mr-1.5" />
              WebSecStudy
            </NextLink>
          </div>
          <div
            className={twMerge(
              "ml-2 text-sm text-slate-400",
              "cursor-pointer hover:text-white",
            )}
            onClick={() => {
              router.push("/login");
            }}
          >
            ログイン
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
