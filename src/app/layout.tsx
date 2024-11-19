'use client'
import { RecoilRoot } from "recoil";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 p-4">
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
