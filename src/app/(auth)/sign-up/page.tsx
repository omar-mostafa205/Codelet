"use client"
import React from 'react';
import Image from 'next/image';
import { SignUp as ClerkSignUp } from '@clerk/nextjs'
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex !overflow-hidden">
      
      <div className="w-full flex items-center justify-center p-8 overflow-hidden">
        <div className="w-full max-w-md">
        <Link href="/" className="-mt-1 mb-4 flex flex-row gap-2 items-center justify-center">
        <Image 
          src="/final.png" 
          alt="Logo" 
          width={30} 
          height={30} 
          className="rounded-[10px]"
        />
        <h1 className="text-2xl font-semibold text-gray-900">Codelet</h1>
      </Link>
                <div className="bg-white rounded-2xl shadow-lg p-8 flex justify-center items-center flex-col">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h1>
              <p className="text-gray-600">Create your account to get started</p>
            </div>
            <ClerkSignUp 
  appearance={{
    elements: {
      rootBox: "w-full",
      card: "rounded-2xl shadow-lg border border-gray-100 bg-white p-6",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
      formFieldInput: "border-gray-200 focus:border-[#B66DFF]",
      footerActionLink: "text-[#c5daff] hover:text-[#FF8DB4]"
    }
  }}
/>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;