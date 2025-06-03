
import React from 'react';

export const NUMBER_OF_DOORS = 3;

export const IconClosedDoor: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
);

export const IconCar: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 sm:w-16 sm:h-16 text-green-400 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v.958m12 0" />
  </svg>
);

export const IconGoat: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 sm:w-16 sm:h-16 text-gray-400 ${className}`}>
    {/* Using a simple placeholder icon for goat - e.g. a simplified animal shape or generic icon */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /> {/* This is XMarkIcon, let's use something else */}
    {/* A generic paw or simple animal shape */}
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0 4.5 4.5 0 0 1 0-6.364l6.364 6.364Zm-6.364 0L15.182 8.818M3.75 12H20.25" /> {/* More abstract 'undesirable' prize */}
  </svg>
);

// Default styling for doors
export const DOOR_BASE_CLASS = "border-2 rounded-lg p-4 m-2 flex flex-col items-center justify-center w-32 h-48 sm:w-40 sm:h-60 transition-all duration-300 ease-in-out transform hover:scale-105";
export const DOOR_CLOSED_CLASS = "bg-slate-700 border-slate-500 cursor-pointer hover:border-yellow-400";
export const DOOR_PLAYER_SELECTED_CLASS = "border-blue-500 ring-4 ring-blue-400 ring-opacity-75 scale-105 bg-slate-600";
export const DOOR_MONTY_OPENED_CLASS = "bg-slate-800 border-red-500 cursor-not-allowed";
export const DOOR_REVEALED_CAR_CLASS = "bg-green-800 border-green-500";
export const DOOR_REVEALED_GOAT_CLASS = "bg-slate-800 border-gray-600";
