"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Authentication buttons component for desktop view
function AuthButtons() {
  return (
    <div className="flex items-center gap-4 p-4">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

// Authentication buttons component for mobile view
function MobileAuthButtons() {
  return (
    <div>
      <SignedOut>
        <div className="flex gap-2">
          <SheetClose asChild>
            <SignInButton>
              <button className="flex-1 px-4 py-3.5 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform">
                Sign In
              </button>
            </SignInButton>
          </SheetClose>
          <SheetClose asChild>
            <SignUpButton>
              <button className="flex-1 px-4 py-3.5 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform">
                Sign Up
              </button>
            </SignUpButton>
          </SheetClose>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center px-4 py-3.5 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80"
    >
      <div className="flex h-24 items-center px-4 md:px-8 lg:px-32 container mx-auto">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={80}
                className="w-[40px] h-auto transition-all duration-300 group-hover:brightness-110"
              />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-auto">
          <NavigationMenuList className="flex gap-1">
            {/* About & Contact */}
            {[
              { name: "Courses", href: "/courses" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className="h-12 px-5 text-base font-medium transition-all duration-200 hover:text-theme_primary inline-flex items-center justify-center rounded-full hover:bg-slate-100/80"
                >
                  {item.name}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth and Book Class Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
          <Button asChild className="bg-primary hover:bg-theme_primary">
            <Link href="/book-appointment">Book a Class</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative scale-125"
              >
                <Menu className="h-6 w-6 transition-all duration-200 rotate-0 scale-100" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[400px] p-0 bg-gradient-to-b from-white to-slate-50 border-l border-slate-200/80"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200/80 bg-white">
                  <span className="text-xl font-semibold text-slate-900">
                    Menu
                  </span>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-slate-100/80 active:bg-slate-200/80"
                    >
                      <X className="h-5 w-5 text-slate-600" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex-1 overflow-y-auto">
                  <div className="flex flex-col p-6 space-y-6">
                    {/* Mobile Qiraat Menu */}

                    {/* Mobile About & Contact */}
                    <div className="space-y-3">
                      <h2 className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                        Navigation
                      </h2>
                      <div className="grid gap-2">
                        {[
                          { name: "Courses", href: "/courses" },
                          { name: "About", href: "/about" },
                          { name: "Contact", href: "/contact" },
                        ].map((item) => (
                            <Link
                            key={item.href}
                              href={item.href}
                            className="block px-4 py-3.5 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform"
                            onClick={() => setIsOpen(false)}
                            >
                              {item.name}
                            </Link>
                        ))}
                      </div>
                    </div>

                    {/* Auth Buttons - Mobile */}
                    <div className="space-y-3">
                      <h2 className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                        Account
                      </h2>
                      <MobileAuthButtons />
                    </div>

                    {/* Book Appointment Button - Mobile */}
                    <SheetClose asChild>
                      <Link href="/book-appointment" className="block px-2 py-3">
                        <Button className="w-full bg-primary hover:bg-theme_primary">
                          Book Appointment
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
