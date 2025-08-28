import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React 精通教程 - 掌握8个核心模式",
  description: "一个专为学习React核心概念而设计的教程项目，涵盖useState、useEffect、Props、条件渲染、列表渲染、事件处理、Context API和自定义Hooks等8个核心模式，帮助开发者掌握95%的React使用场景。",
  keywords: ["React", "教程", "useState", "useEffect", "Props", "Context API", "自定义Hooks", "Next.js"],
  authors: [{ name: "React 教程团队" }],
  openGraph: {
    title: "React 精通教程 - 掌握8个核心模式",
    description: "通过实际示例学习React的8个核心模式，专为使用AI工具的开发者设计",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
