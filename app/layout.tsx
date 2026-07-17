import type { Metadata } from "next";
import "./globals.css";
import "./polish.css";
import EditorialMotion from "./EditorialMotion";

export const metadata: Metadata = {
  title: "歐德星｜內容策略、內容製作與創作者增長",
  description: "歐德星的個人履歷與代表案例：內容策略、原創IP、創作者孵化、影片製作與帳號增長。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <EditorialMotion />
        {children}
      </body>
    </html>
  );
}
