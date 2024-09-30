import React from 'react'

const Footer = () => {
  return (
    <footer className='mt-20  border-t  py-10 border-neutral-700'>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
                <h3 className='text-md font-semibold mb-4'>Company Information</h3>
                <ul>
                    <li><a className='text-neutral-300 hover:text-white'>About Us</a></li>
                    
                </ul>
            </div>
            <div>
                <h3 className='text-md font-semibold mb-4'>Resources</h3>
                <ul>
                    <li><a className='text-neutral-300 hover:text-white'>Getting Started</a></li>
                    <li><a className='text-neutral-300 hover:text-white'>Documentation</a></li>
                    <li><a className='text-neutral-300 hover:text-white'>Tutorials</a></li>
                    <li><a className='text-neutral-300 hover:text-white'>Help Center</a></li>
                </ul>
            </div>
            <div>
                <h3 className='text-md font-semibold mb-4'>Contact</h3>
                <ul>
                    <li><a className='text-neutral-300 hover:text-white'> Contact Us</a></li>
                    <li><a className='text-neutral-300 hover:text-white'>Support</a></li>
                    <li><a className='text-neutral-300 hover:text-white'>Sales Inquiry</a></li>
                </ul>
            </div>

        </div>
      
    </footer>
  )
}

export default Footer
