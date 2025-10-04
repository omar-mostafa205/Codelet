"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Rocket } from 'lucide-react'

import NavBar from '@/components/NavBar'
import Link from 'next/link'
import { ShineBorder } from '@/components/ShineBorder'
import AIFeaturesGrid from '@/components/AiFeaturesGrid'
import TestimonialsSection from '@/components/Testmonials'
import ThreeStepProcess from '@/components/HowItWorks'
import Footer from '@/components/Footer'
import ShowCase from '@/components/ShowCase'
import ShowCaseAi from '@/components/ShowCaseAi'

const tech = [
  { name: "JavaScript", logo: "/js.png" },
  { name: "Next.js", logo: "/nextjs.png" },
  { name: "TypeScript", logo: "/typescript.png" },
  { name: "Python", logo: "/python.png" },
  { name: "React", logo: "/react.png" },
  { name: "Node.js", logo: "/nodejs.png" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <div className="relative w-[98vw] h-[150vh] mx-auto mt-24 mb-8 flex items-center justify-center rounded-2xl z-10 bg-white overflow-hidden">
        <Image
          src="/bg.png"
          alt="Hero Background"
          fill
          className="rounded-2xl object-cover"
          priority
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex rounded-xl flex-col items-center gap-1">
          <h1 className="text-black text-4xl md:text-6xl lg:text-8xl xl:text-[100px] font-bold drop-shadow-2xl text-center p-4 mt-17">
            The AI Codebases Guide
          </h1>
          <p className="text-black text-2xl md:text-2xl lg:text-2xl xl:text-2xl drop-shadow-2xl text-center px-2">
            The fastest way to understand any codebase, built to ramp devs in days, not months.
          </p>
          <div className="flex flex-row gap-7 mt-7">
            <Link href="/repo-upload" className="pointer">
              <div className="relative w-fit rounded-full">
                <Button className="group relative z-10 text-white bg-black cursor-pointer hover:bg-gray-900 w-fit py-7 px-10 text-xl rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-colors duration-200"> 
                  <Rocket 
                    width={30} 
                    height={30} 
                    className="!w-6 !h-6 transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1" 
                  />
                  Accelerate My Learning
                </Button>

                <ShineBorder
                  shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]}
                  borderWidth={30}
                  duration={8}
                  className="rounded-full"
                />
              </div>
            </Link>

            <Link href="/demo" className='pointer'>
              <Button className="text-black backdrop-blur-md  bg-white/20 border-1 border-white  w-fit py-7 px-10 text-xl hover:bg-gray-40 rounded-full cursor-pointer transition-colors duration-200">
                <Play className="!w-6 !h-6 mr-1" />
                Watch a Demo
              </Button>
            </Link> 

            <div className="h-[400px] md:h-[520px] lg:h-[500px] w-[90%] overflow-hidden absolute z-10 left-1/2 -translate-x-1/2 bottom-[-5px] bg-gray-50 rounded-2xl pt-180 shadow-purple-400 shadow-[0_0px_30px_rgba(0,0,0,0.4)]">

              <Image
                src="/dash.png"
                alt="Product Demo"
                fill
                className="object-contain p-0.5 rounded-5xl"
                draggable={false}
              />
            </div>
          </div>
          
        </div>
      </div>
      <AIFeaturesGrid /> 
      <ShowCase />

      <TestimonialsSection />
      <ShowCaseAi /> 
    <ThreeStepProcess />
    <Footer /> 

    </div>
  )
}

export default HomePage