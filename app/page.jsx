import Link from "next/link";
import { Banner } from "../components/Banner/Banner";

export default function Home() {

  return (
    <main> 
      <Banner type="warning">
        🚧 Under Construction 🚧
      </Banner>
      <Link href="/sankey" className="text-blue-600 underline">
        Go to Budget Sankey Diagram
      </Link>
      <Link href="/flow" className="text-blue-600 underline ml-4">
        Go to Flow Diagram
      </Link>
      <Link href="/branches" className="text-blue-600 underline ml-4">
        Go to Branches Diagram
      </Link>
    </main>
  );
} 
