import React from 'react'
import { ArrowRight } from 'lucide-react'
import SparkIcon from './SparkIcon'

const ShowCaseAi = () => {
  return (
    <div className='min-h-screen w-full relative py-50'>
      <div className='relative w-full min-h-screen'>
        <img 
          src="/footerPng.png" 
          alt="bg" 
          className='absolute inset-0 w-full h-full object-cover'
        />
        
        <div className='relative z-10 w-full px-8 py-20'>
          <div className='flex flex-col items-start gap-12 max-w-[70rem] mx-auto'>
            <div className='flex flex-col items-start space-y-4'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                <span className='text-white text-sm font-medium'>AI Feature</span>
              </div>
              
              <h1 className='text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white flex items-center justify-center gap-3'>
                Discover 
                Codelet AI
                <SparkIcon className='w-16 h-16 text-white text-center'/>  
              </h1>
            </div>
            <div className='w-full'>
              <div className='relative w-full h-[80vh]'>
                
                <img 
                  src="/aiWork.png" 
                  alt="ai work" 
                  className='absolute inset-0 w-full h-full object-cover rounded-2xl'
                />
                
                                <div className='relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl'>
                  <video 
                    className='w-full h-full object-cover'
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/aivideo.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowCaseAi