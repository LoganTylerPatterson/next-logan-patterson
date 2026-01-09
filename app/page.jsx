'use client'
import React from "react";
import Link from "next/link";
import { Banner } from "../components/Banner/Banner";
import ParticleNetwork from "@/components/ParticleNetwork/ParticleNetwork";

export default function Home() {
  const linkItemCSS = "";

  return (
    <main className="p-16">
      <Banner type="warning" className="-mx-16">🚧 Under Construction 🚧</Banner>
      <nav className="flex space-between">
        <ul>
          <li>
            <Link href="/sankey" className="text-blue-600 underline">
              Budget Sankey Diagram
            </Link>
          </li>
          <li>
            <Link href="/flow" className="text-blue-600 underline ml-4">
              Go to Flow
            </Link>
          </li>
          <li>
            <Link href="/branches" className="text-blue-600 underline ml-4">
              Branches
            </Link>
          </li>
          <li>
            <a href="https://graph-six-rho.vercel.app/">3D Graph Shader</a>
          </li>
        </ul>
      </nav>
      <ParticleNetwork />
    </main>
  );
}
