"use client";
import { useEffect, useRef, useState, ReactNode } from "react"
import React from 'react'

interface DropdownProps{
    buttonText: string; 
    children: ReactNode;

}

const Dropdown: React.FC<DropdownProps> = ({buttonText, children}) => {

    const [isOpen, setIsOpen ] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
            <button 
                type="button"
                className="inline-flex justify-center 
                    w-full rounded-md border border-gray-300 
                    shadow-sm px-4 py-2 bg-white text-sm 
                    font-medium text-gray-700 hover:bg-gray-50
                    focus:outlie-none focus:ring-2 focus-ring-offset-2
                    focus-ring-indigo-500"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true">
                    {buttonText} 
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                </svg>
            </button>
        </div>
        {isOpen && (
            <div className="origin-top-right absolute right-0
                    mt-2 w-56 rounded-sm shadow-lg bg-white ring-1 ring-black 
                    ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
            >
                <div className="py-1" role="none">{children}</div>
            </div>
        )}
    </div>
  )
}

export default Dropdown