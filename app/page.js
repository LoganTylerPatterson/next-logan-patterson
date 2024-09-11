import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div class="flex justify-center items-center h-screen">
      <Link href="/tetris">Tetris</Link>
    </div>
  )
}
