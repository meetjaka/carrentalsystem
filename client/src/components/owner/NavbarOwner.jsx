import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const {user} = useAppContext()
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 text-[#8DA0BF] border-b border-[rgba(255,255,255,0.04)] backdrop-blur-md transition-all ${
      scrolled 
        ? "bg-[#0A0F14]/95 shadow-[0_8px_24px_rgba(0,0,0,0.4)]" 
        : "bg-transparent"
    }`}>
      <Link to='/' className="flex items-center gap-2">
        <img src={assets.logo} alt='NextDrive' className='h-10 md:h-12' />
        <span className="text-xl md:text-2xl font-semibold text-[#DCE7F5] hidden sm:block">NextDrive</span>
      </Link>
      <p className='text-[#8DA0BF]'>Welcome, <span className='text-[#0A4D9F] font-medium'>{user?.name || 'Owner'}</span></p>
    </div>
  )
}

export default NavbarOwner
