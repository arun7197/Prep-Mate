"use client"
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex justify-between items-center h-16 w-full p-4 shadow-md bg-white">
      <Link href="/">
        <Image src="/logo.svg" width={150} height={100} alt="logo" className="m-3" />
      </Link>
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/sign-in" />
      ) : (
        <Link href="/sign-up">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
        </Link>
      )}
    </nav>
  );
}

export default Header;
