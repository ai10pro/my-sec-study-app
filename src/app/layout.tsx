import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/_components/Header";
import AuthProvider from "@/app/_contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useAuth } from "@/app/_hooks/useAuth";

// FontAwesome設定
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "My-Sec-Study-app",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          <main className="mx-4 mt-2 max-w-3xl md:mx-auto">
            {props.children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
