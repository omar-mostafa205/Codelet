"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Rocket } from 'lucide-react'

import NavBar from '@/components/main/NavBar'
import Link from 'next/link'
import { ShineBorder } from '@/components/ShineBorder'
import AIFeaturesGrid from '@/components/main/AiFeaturesGrid'
import TestimonialsSection from '@/components/main/Testmonials'
import ThreeStepProcess from '@/components/main/HowItWorks'
import Footer from '@/components/main/Footer'
import ShowCase from '@/components/main/ShowCase'
import ShowCaseAi from '@/components/main/ShowCaseAi'
import { useUser } from '@clerk/nextjs'


const HomePage = () => {
  const {user} = useUser()
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar user={user} />
      
      <section id="home" 
        className="
        relative w-[98vw] mx-auto mt-24 mb-8
        flex items-center justify-center
        rounded-2xl z-10 bg-white overflow-hidden
        min-h-[50vh] sm:min-h-[100vh] lg:min-h-[140vh]
        pb-20 sm:pb-32 lg:pb-48
      "
      >
        <Image
          src="/bg.png"
          alt="Hero Background"
          fill
          className="rounded-2xl object-cover "
          priority
        />

        <div className="absolute inset-0 flex rounded-xl flex-col items-center gap-1">
          <h1 className="text-black text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[100px] font-bold drop-shadow-2xl text-center p-4 mt-8 md:mt-12">
            The AI Codebases Guide
          </h1>
          <p className="text-black text-lg sm:text-xl md:text-2xl drop-shadow-2xl text-center px-4 sm:px-2">
            The fastest way to understand any codebase, built to ramp devs in days, not months.
          </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mt-7 px-4 w-full sm:w-auto max-w-md sm:max-w-none">
            <Link href="/repo-upload" className="pointer w-full sm:w-auto">
              <div className="relative w-full sm:w-fit rounded-full">
                <Button className="group relative z-10 text-white bg-black cursor-pointer hover:bg-gray-900 w-full sm:w-fit py-6 sm:py-7 px-8 sm:px-10 text-lg sm:text-xl rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-colors duration-200"> 
                  <Rocket 
                    width={30} 
                    height={30} 
                    className="!w-5 !h-5 sm:!w-6 sm:!h-6 transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1" 
                  />
                  Accelerate My Learning
                </Button>

                <ShineBorder
                  shineColor={["#FF6FD8", "#3813C2", "#FF6FD8"]}
                  borderWidth={30}
                  duration={8}
                  className="rounded-full hidden sm:block"
                  />
              </div>
            </Link>

            <Link href="/" className="pointer w-full sm:w-auto">
              <Button className="text-black backdrop-blur-md bg-white/20 border-1 border-white w-full sm:w-fit py-6 sm:py-7 px-8 sm:px-10 text-lg sm:text-xl hover:bg-gray-40 rounded-full cursor-pointer transition-colors duration-200">
                <Play className="!w-5 !h-5 sm:!w-6 sm:!h-6 mr-1" />
                Watch a Demo
              </Button>
            </Link> 
          </div>

          <div className="hidden md:block h-[300px] md:h-[100px] lg:h-[200px] w-[90%] overflow-hidden absolute z-0 left-1/2 -translate-x-1/2 max-w-7xl bottom-[2px] bg-gray-50 rounded-2xl pt-10 md:pt-120 lg:pt-180 shadow-purple-400 shadow-[0_0px_30px_rgba(0,0,0,0.4)]">
            <Image
              src="/dashboard2.png"
              alt="Product Demo"
              fill
              className="rounded-5xl"
              draggable={false}
            />
          </div>
        </div>
      </section>

      <section id="features">
        <AIFeaturesGrid /> 
      </section>

      <section id="showcase">
        <ShowCase />
      </section>

      <section id="ai">
        <ShowCaseAi /> 
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <section id="how-it-works">
        <ThreeStepProcess />
      </section>

      <Footer /> 
    </div>
  )
}

export default HomePage