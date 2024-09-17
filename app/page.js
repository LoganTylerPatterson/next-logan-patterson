import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div class="flex justify-center items-center space-around h-screen">
      <Link href="/three">3D Experience</Link>
      <Link href="/tetris">Tetris</Link>
    </div>
  )
}
