import React from 'react'
import Image from 'next/image'

const ShowCaseAi = () => {
  return (
    <div className='min-h-screen w-full relative py-50 bg-[#f8fafc]' id='showcaseai'>
      <div className='relative w-full h-full'>
        <img 
          src="/footerPng.png" 
          alt="bg" 
          className='absolute inset-0 w-full min-h-screen h-full object-cover'
        />
        
        <div className='relative z-10 w-full px-8 py-20'>
          <div className='flex flex-col items-start gap-12 max-w-[70rem] mx-auto'>
            <div className='flex flex-col items-start space-y-4'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                <span className='w-2 h-2 bg-purple-500 rounded-full'></span>
                <span className='text-white text-sm font-medium'>AI FEATURE</span>
              </div>
              
              <h1 className='text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white flex items-center justify-center gap-3'>
                Discover 
                Codelet AI
                <Image src="/stars.png" alt="ai work" width={60} height={50} className="" />
              </h1>
            </div>
            
            <div className='w-full rounded-2xl  border-purple-500'>
              <div className='relative w-full h-[90vh] rounded-2xl overflow-hidden shadow-2xl  outline-1 outline-purple-500 z-49'>
                <video 
                  className='absolute inset-0 w-full h-full object-cover'
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