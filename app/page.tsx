"use client";
import Image from "next/image";
import ProjectPreview from "@/components/ProjectPreview";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center" style={{backgroundColor: '#F3E0BF'}}>
      <div className="w-full bg-yellow-400 text-center py-2 text-black font-semibold">
        🚧 Under Construction 🚧
      </div>
      <div className="w-full max-w-5xl px-4 mt-4 relative">
        <header className="w-full px-8 py-2 flex justify-between items-center bg-[#3e7a85] text-white rounded-lg">
          <div className="flex items-center space-x-2">
            <Image src="/smallIconLogan.png" alt="Logan Patterson" width={50} height={50} />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-6 text-white px-4">
              {/* <a href="#" className="hover:text-gray-300">Reading</a> */}
              <a href="#" className="hover:text-gray-300">Projects</a>
              <a href="#" className="hover:text-gray-300">About</a>
            </nav>
            <a href="mailto:lpatterson762+portfolio@gmail.com" className="text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a href="https://github.com/LoganTylerPatterson" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="absolute right-4 md:hidden">
            <div className="w-auto bg-[#3e7a85] text-white flex flex-col items-center space-y-4 py-4 px-8 rounded-lg">
              <a href="#" className="hover:text-gray-300">
                Reading
              </a>
              <a href="#" className="hover:text-gray-300">
                Projects
              </a>
              <a href="#" className="hover:text-gray-300">
                About
              </a>
              <div className="flex space-x-4">
                <a href="mailto:lpatterson762+portfolio@gmail.com" className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a href="https://github.com/LoganTylerPatterson" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-20 px-4 py-20">
        <div className="w-full max-w-sm">
          <Image src="/PlayerCard.png" alt="Logan Patterson Action Figure" width={400} height={600} />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800">Hi, I'm Logan Patterson</h1>
          <p className="text-3xl text-gray-600 mt-2">Software Engineer</p>
        </div>
      </div>

      <div className="w-full max-w-5xl p-10 mt-10 rounded-lg bg-[#e9d8be]">
        <ProjectPreview />
      </div>
    </main>
  );
} 