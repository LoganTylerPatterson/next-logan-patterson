import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 font-sans text-violet-100">

      <div className='min-h-[30vh] px-8 self-center content-center font-bold bg-clip-text'>
        <h1 className="text-6xl ">
          Logan Patterson
        </h1>
        <div className="mt-4 flex justify-between">
          <h3 className="hover:underline"><a href="mailto:lpatterson762@gmail.com">lpatterson762@gmail.com</a></h3>
          <h3 className="hover:underline"><a href="https://github.com/LoganTylerPatterson">Github</a></h3>
        </div>
      </div>
      
      <main className="mx-auto px-6 mt-16">
        <h2 className="text-2xl font-semibold mt-8 inline-block border-b-2 border-[#a020f0] pb-2">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

          <Link href="https://play.google.com/store/apps/details?id=com.hut8development.trim&hl=en_US&pli=1">
            <div className="bg-[#f8f1f6] group rounded-lg p-6 transition-all duration-300 hover:bg-[#cccace] hover:shadow-md hover:shadow-[#cccace]">
              <h3 className="text-xl font-medium text-[#a020f0]">
                DumbPhone
              </h3>
              <p className="text-[#3b3b3b] mb-4">
                Minimal Android home app
              </p>
              <span className="text-[#a020f0] text-sm group-hover:underline">
                View project →
              </span>
            </div>
          </Link>
          
          <Link href="/branches" className="group">
            <div className="bg-[#f8f1f6] rounded-lg p-6 transition-all duration-300 hover:bg-[#cccace] hover:shadow-md hover:shadow-[#cccace]">
              <h3 className="text-xl font-medium text-[#a020f0]">
                Branches
              </h3>
              <p className="text-[#3b3b3b] mb-4">
                A visual exploration of branching paths
              </p>
              <span className="text-[#a020f0] text-sm group-hover:underline">
                View project →
              </span>
            </div>
          </Link>
          
          <Link href="/flow" className="group">
            <div className="bg-[#f8f1f6] rounded-lg p-6 transition-all duration-300 hover:bg-[#cccace] hover:shadow-md hover:shadow-[#cccace]">
              <h3 className="text-xl font-medium text-[#a020f0]">
                FlowGame (under construction)
              </h3>
              <p className="text-[#3b3b3b] mb-4">
                A personal spin of a classic game to explore hamiltonian paths(mobile only)
              </p>
              <span className="text-[#a020f0] text-sm group-hover:underline">
                View project →
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}