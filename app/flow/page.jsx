"use client"
import { useState } from 'react';
import FlowGame from './flow_game';

function Flow() {
  const [difficulty, setDifficulty] = useState(null);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      {!difficulty ? (
        <div className="text-center flex-col">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
            Insomniac Flow
          </h1>
          <div className="my-32"></div>
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => setDifficulty('easy')}
              className="bg-emerald-600 text-gray-100 py-2 w-64
                rounded-xl text-xl font-semibold"
            >
              🌿 Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className="bg-amber-600 text-gray-100 py-2 px-8 w-64
                rounded-xl text-xl font-semibold"
            >
              🌟 Medium
            </button>
            {/* <button
              onClick={() => setDifficulty('hard')}
              className="bg-rose-600 text-gray-100 py-2 px-8 w-64
                rounded-xl text-xl font-semibold"
            >
              🔥 Hard
            </button> */}
          </div>
        </div>
      ) : (
        <FlowGame difficulty={difficulty} onRestart={() => setDifficulty(null)} />
      )}
    </div>
  );
}

export default Flow;