import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ShowCase = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
        <div className='max-w-[85rem] mx-auto p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                <div className='lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-6'>
                    <div className='inline-block'>
                        <span className='px-4 py-2 bg-white text-black border-1 border-purple-700 rounded-full text-sm font-medium shadow-xl'>

                        PRODUCT OVERVIEW

</span>
                    </div>
                    
                    <h1 className='text-5xl lg:text-6xl font-bold leading-tight'>
                        Compoerhinsve Tutorial workflow
                    </h1>
                    
                    <p className='text-lg text-gray-600 leading-relaxed'>
                        Work together in real time — edit tasks, leave comments, and see updates instantly. Stay aligned without switching tools or waiting on status updates.
                    </p>
                    
                    <Link
                    href='repo-upload'
                     className='w-fit flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full hover:bg-gray-800 transition-colors font-medium'>
                       Start for free
                        <ArrowRight className='w-5 h-5' />
                    </Link>
                </div>

                {/* Right Video Section - 60% */}
                <div className='lg:col-span-7 xl:col-span-7'>
                    <div className='w-full h-[80vh] bg-gradient-to-tl from-yellow-300 via-blue-200 to-blue-100 rounded-3xl shadow-2xl p-8 relative overflow-hidden'>

                        <div className='w-full h-full rounded-2xl overflow-hidden'>
                            <video 
                                className='w-full h-full object-cover'
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/chapter.mov" type="video/mp4" />
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

export default ShowCase