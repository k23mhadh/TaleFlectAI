import React from 'react'
import { useState } from 'react';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'

const Navbar = () => {

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <nav className='sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80'>
            <div className='container px-4 mx-auto relative text-sm'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center flex-shrink-0'>
                        <img className='h-11 w-11 mr-2 rounded-2xl ' src={logo}></img>
                        <span className='text-xl tracking-tight'>Tale<span className='bg-gradient-to-r from-yellow-500 to-yellow-800 text-transparent bg-clip-text'>Flect.AI</span></span>
                    </div>
                    <ul className='hidden lg:flex ml-14 space-x-12 text-[17px]'>
                        <li><a>Home</a></li>
                        <li><a>Features</a></li>
                        <li><a>Contact</a></li>
                        <li><a>Pricing</a></li>
                    </ul>
                    <div className='hidden lg:flex justify-center space-x-12 items-center '>
                        <a className='py-2 px-3 border rounded-md'>LogIn</a>
                        <a className='bg-gradient-to-r from-yellow-500 to-yellow-900 py-2 px-3 rounded-md border border-neutral-400'>Sign Up</a>
                    </div>
                    <div className='lg:hidden md:flex flex-col justify-end'>
                        <button onClick={toggleNavbar}>
                            {mobileDrawerOpen ? <X /> : <Menu />}
                        </button>

                    </div>
                </div>
                
            </div>
            {
                    mobileDrawerOpen && (
                        <div className="fixed right-0 z-20 w-full bg-neutral-900 p-12 flex flex-col justify-center items-center lg:hidden">
                            <ul>
                                <li className='py-2'><a>Home</a></li>
                                <li className='py-2'><a>Features</a></li>
                                <li className='py-2'><a>Contact</a></li>
                                <li className='py-2'><a>Pricing</a></li>
                            </ul>
                            <div className='flex justify-center space-x-6 items-center py-4'>
                                <a className='py-2 px-3 border rounded-md'>LogIn</a>
                                <a className='bg-gradient-to-r from-yellow-500 to-yellow-900 py-2 px-3 rounded-md'>Sign Up</a>
                            </div>
                            

                        </div>
                    )
                }
        </nav>
    )
}

export default Navbar
