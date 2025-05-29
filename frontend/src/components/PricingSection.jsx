import React from 'react'

const PricingSection = () => {
  return (
    <div id="pricingSection" className='mt-20'>
        <h2 className='text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wider'>Pricing</h2>
      <div className='flex flex-wrap'>
        <div className='w-full sm:w-1/2 lg:w-1/3 p-2'>
            <div className='p-10 border border-neutral-700 rounded-xl text-center'>
                <p className='text-3xl mb-8'>10 Books</p>
                <p className='mb-8'>
                    <span className='text-5xl mt-6 mr-2'>8.99</span>
                    <span className='text-neutral-400 text-xl tracking-tight'>USD</span>
                </p>
            </div>
            
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/3 p-2'>
        <div className='p-10 border border-neutral-700 rounded-xl text-center'>
                <p className='text-3xl mb-8'>60 Books 
                    {" "}<span className='text-red-700 text-sm'>(Popular)</span>
                </p>
                <p className='mb-8'>
                    <span className='text-5xl mt-6 mr-2'>35.99</span>
                    <span className='text-neutral-400 text-xl tracking-tight'>USD</span>
                </p>
            </div>
            
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/3 p-2'>
        <div className='p-10 border border-neutral-700 rounded-xl text-center'>
                <p className='text-3xl mb-8'>100 Books</p>
                <p className='mb-8'>
                    <span className='text-5xl mt-6 mr-2'>59.99</span>
                    <span className='text-neutral-400 text-xl tracking-tight'>USD</span>
                </p>
            </div>
        </div>

      </div>
    </div>
  )
}

export default PricingSection
