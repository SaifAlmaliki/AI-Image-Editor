/**
 * Mobile Navigation Component
 *
 * A responsive navigation header specifically designed for mobile devices.
 * Features:
 * 1. App logo and branding
 * 2. User authentication status handling
 * 3. Slide-out navigation menu (Sheet)
 * 4. Active route highlighting
 * 5. User profile button for signed-in users
 * 6. Login button for signed-out users
 *
 * The component uses the Sheet component from shadcn/ui for the slide-out menu
 * and Clerk for authentication features.
 */

"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
  // Get current route for active link highlighting
  const pathname = usePathname();

  return (
    <header className="header">
      {/* App logo and home link */}
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        {/* Content shown only to authenticated users */}
        <SignedIn>
          {/* User profile button with sign-out functionality */}
          <UserButton afterSignOutUrl="/" />

          {/* Mobile slide-out menu */}
          <Sheet>
            {/* Menu trigger button */}
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            {/* Slide-out menu content */}
            <SheetContent className="sheet-content sm:w-64">
              <>
                {/* App logo in menu */}
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />

                {/* Navigation links */}
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname

                    return (
                      <li
                        className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}
                        key={link.route}
                      >
                      <Link className="sidebar-link cursor-pointer" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        {/* Login button shown to unauthenticated users */}
        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default MobileNav