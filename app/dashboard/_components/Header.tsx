"use client"
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center h-16 w-full p-4 shadow-md bg-white">
      
      {/* LEFT → Logo */}
      <Link href="/">
        <Image src="/logo.svg" width={120} height={40} alt="logo" />
      </Link>

      {/* RIGHT → User */}
      <div className="ml-auto">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-up">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign Up
            </button>
          </Link>
        )}
      </div>

    </nav>
  );
}

export default Header;