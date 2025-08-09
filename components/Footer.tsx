import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-[#3E2723] text-[#FBE9E7] py-8 px-4 mt-auto'>
         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
        {/* Copyright Information */}
        <p className="mb-2 md:mb-0 text-center md:text-left">
          &copy; 2025 TuklasVerse Entertainment App. All Rights Reserved.
        </p>

        {/* Legal Links */}
        <div className="flex space-x-4 text-center md:text-right">
          <Link href="/privacy-policy" className="hover:text-[#2196F3]">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-[#2196F3]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer