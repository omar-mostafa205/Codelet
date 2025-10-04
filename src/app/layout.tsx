import "@/styles/globals.css";

import  { Toaster } from 'react-hot-toast';
import {
  ClerkProvider
} from '@clerk/nextjs'

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Codelet",
  description: "Onbaoring with Ai ",
  icons: [{ rel: "icon", url: "/final.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      
      <body className="bg-[#f6f6f6]">


        <ClerkProvider
          signInUrl="/sign-up"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        >
        <TRPCReactProvider>
          <Toaster/>

          {children}
          </TRPCReactProvider>
          </ClerkProvider>
      </body>
    </html>
  );
}
