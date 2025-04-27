// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";

export function MainHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Determine if we're on a page with a dark background
  const isDarkBackground =
    pathname === "/" || pathname === "/home" || pathname.startsWith("/portal");

  // Determine background color based on scroll and current page
  const headerBg = isScrolled
    ? "bg-white shadow"
    : isDarkBackground
    ? "bg-black/30 backdrop-blur-sm"
    : "bg-white shadow-sm";

  // Determine text color based on scroll and current page
  const textColor = isScrolled
    ? "text-gray-900"
    : isDarkBackground
    ? "text-white"
    : "text-gray-900";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        headerBg
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo
            variant={isDarkBackground && !isScrolled ? "light" : "default"}
            size="md"
            className="mr-6"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "transition-colors",
                        pathname === route.href
                          ? isDarkBackground && !isScrolled
                            ? "bg-white/20 text-white font-medium"
                            : "bg-indigo-50 text-indigo-600 font-medium"
                          : cn(
                              isDarkBackground && !isScrolled
                                ? "text-white hover:bg-white/20"
                                : "text-gray-900 hover:bg-indigo-50 hover:text-indigo-600"
                            )
                      )}
                    >
                      {route.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden sm:flex items-center",
                isDarkBackground && !isScrolled
                  ? "text-white hover:bg-white/20 font-medium"
                  : "hover:bg-indigo-50 hover:text-indigo-600 text-gray-900"
              )}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden sm:flex items-center",
                isDarkBackground && !isScrolled
                  ? "text-white hover:bg-white/20 font-medium"
                  : "hover:bg-indigo-50 hover:text-indigo-600 text-gray-900"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", textColor)}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-white shadow-lg md:hidden">
          <nav className="container px-4 py-4">
            <ul className="space-y-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      pathname === route.href
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
