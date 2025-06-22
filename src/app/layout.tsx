import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/_components/Header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

export const metadata: Metadata = {
  title: "My-Sec-Study-app",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="mx-4 mt-2 max-w-3xl md:mx-auto">{props.children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
