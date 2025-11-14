import React from 'react'
import Image from 'next/image'

const ShowCaseAi = () => {
  return (
    <div className='min-h-screen w-full relative py-30 mb-0 sm:pb-40 bg-[#f8fafc]' id='showcaseai'>
      <div className='relative w-full h-full'>
        <img 
          src="/footerPng.png" 
          alt="bg" 
          className='absolute inset-0 w-full min-h-screen h-full object-cover'
        />
        
        <div className='relative z-10 w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20'>
          <div className='flex flex-col items-start gap-8 sm:gap-10 md:gap-12 max-w-[70rem] mx-auto'>
            <div className='flex flex-col items-start space-y-4'>
            <div className="inline-block mb-4">
            <span className="text-sm font-medium text-white border border-purple-700 rounded-full px-4 py-1 shadow-xl">
              AI FEATURE
            </span>
          </div>
              
              <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white flex flex-row items-center justify-center gap-2 sm:gap-3'>
                <span>Discover Codelet AI</span>
                <Image src="/stars.png" alt="ai work" width={60} height={50} className="w-10 h-10" />
              </h1>
            </div>
            
            <div className='w-full rounded-2xl border-purple-500'>
              <div className='relative h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[90vh] rounded-2xl overflow-hidden shadow-2xl max-w-8xl mx-auto outline-1 outline-purple-500 z-49'>
                <video 
                  className='absolute inset-0 w-full h-full object-cover mx-auto'
                  style={{
                    outline: 'none',
                    border: 'none',
                    display: 'block'
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/ai.mov" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowCaseAi