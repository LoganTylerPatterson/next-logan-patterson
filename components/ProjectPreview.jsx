import Link from 'next/link';

export default function ProjectPreview() {
  return (
    <div className="bg-white/80 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Boids: Flocking Simulation</h3>
        <p className="text-gray-600 mb-4">
          An interactive simulation of flocking behavior, inspired by Craig Reynolds' Boids algorithm. 
          Watch as hundreds of agents follow a simple set of rules to create complex, life-like patterns.
        </p>
        <Link href="/boids" className="inline-block bg-[#3e7a85] text-white px-4 py-2 rounded-lg hover:bg-[#31626b] transition-colors">
          View Project
        </Link>
      </div>
    </div>
  );
} 