// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  UtensilsCrossed,
  Menu,
  X,
  Store,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/order/cart-sheet";

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
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

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/95 shadow backdrop-blur" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Store className="h-6 w-6 text-blue-600" />
            <span
              className={cn(
                "hidden font-sans text-xl font-bold sm:inline-block",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              Dinetap AI
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent transition-colors",
                        pathname === route.href
                          ? isScrolled
                            ? "text-primary"
                            : "text-blue-600"
                          : isScrolled
                          ? "text-foreground/70"
                          : "text-white/90",
                        "hover:bg-accent/40 hover:text-accent-foreground"
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
                isScrolled ? "text-foreground" : "text-white"
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
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <CartSheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative",
                  isScrolled ? "text-foreground" : "text-white"
                )}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-blue-600 p-0 text-center text-[10px] text-white"
                    variant="outline"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
          </CartSheet>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden",
              isScrolled ? "text-foreground" : "text-white"
            )}
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
        <div className="absolute left-0 right-0 top-16 z-50 bg-background shadow-lg md:hidden">
          <nav className="container px-4 py-4">
            <ul className="space-y-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      pathname === route.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
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
