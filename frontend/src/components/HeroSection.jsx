import React from 'react'

const HeroSection = () => {
  return (
    <div id="heroSection" className='flex flex-col items-center mt-6 lg:mt-20 '>
      <h1 className='text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide lg:leading-[1.25] '>Create Stunning eBooks in 
        <span className='bg-gradient-to-r from-yellow-500 to-yellow-900 text-transparent bg-clip-text'>{" "}Minutes with AI!</span>
      </h1>
      <p className='mt-5 text-lg text-center max-w-4xl text-neutral-300'>
      Turn your ideas into professional eBooks instantly with our AI-powered platform.<br/>No writing or designing skills required. 
      Just input your content, and let our AI do the rest.
      </p>
      <div className='flex justify-center my-10'>
        <a href="#" className='bg-gradient-to-r from-yellow-500 to-yellow-900 rounded-md border border-neutral-400 py-3 px-4 mx-3'>Start Now</a>
        <a href ="#" className='rounded-md border border-neutral-400 py-3 px-4 mx-3'>How it works?</a>
      </div>
      
    </div>
  )
}

export default HeroSection
