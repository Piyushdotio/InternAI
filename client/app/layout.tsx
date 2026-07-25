import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/Authcontext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ai-Interviewer",
  description: "A platform for practicing interviews with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f1e4] text-[#2c2e2a]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
