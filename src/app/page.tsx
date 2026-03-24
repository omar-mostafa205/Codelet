import React from 'react'

import NavBar from '@/components/main/NavBar'
import AIFeaturesGrid from '@/components/main/AiFeaturesGrid'
import TestimonialsSection from '@/components/main/Testmonials'
import ThreeStepProcess from '@/components/main/HowItWorks'
import Footer from '@/components/main/Footer'
import ShowCase from '@/components/main/ShowCase'
import ShowCaseAi from '@/components/main/ShowCaseAi'
import { HeroSection } from '@/components/main/HeroSection'


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <NavBar />
    
    <HeroSection />
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