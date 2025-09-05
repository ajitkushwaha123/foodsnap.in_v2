import "./globals.css";
import { Poppins } from "next/font/google";
import AppShell from "@/components/global/app-shell";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "FoodSnap 🍴",
  description:
    "Stunning food images library for chefs, bloggers, and creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
