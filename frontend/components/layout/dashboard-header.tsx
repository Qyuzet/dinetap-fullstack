// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Store,
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  PlusCircle,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Store className="mr-2 h-5 w-5 text-indigo-600" />,
    },
    {
      href: "/dashboard/create-portal",
      label: "Create Portal",
      icon: <PlusCircle className="mr-2 h-5 w-5 text-indigo-600" />,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo
            variant="default"
            size="lg"
            className="mr-8"
            textClassName="text-indigo-700 font-extrabold"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <nav className="hidden space-x-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === route.href
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-sm"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="hidden items-center rounded-lg border border-gray-200 bg-white/50 text-gray-700 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-600 md:flex"
            >
              <Home className="mr-2 h-5 w-5 text-indigo-500" />
              Back to Home
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-100 hover:shadow-md"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
              2
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border-2 border-indigo-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl p-2 shadow-lg"
            >
              <DropdownMenuLabel className="text-indigo-800 font-bold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-indigo-100" />
              <DropdownMenuItem className="rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700">
                <User className="mr-2 h-5 w-5 text-indigo-500" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700">
                <Settings className="mr-2 h-5 w-5 text-indigo-500" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-indigo-100" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-5 w-5 text-red-500" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-100 hover:shadow-md md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <div className="border-t bg-white shadow-lg md:hidden">
          <nav className="container px-4 py-4">
            <ul className="space-y-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                      pathname === route.href
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-sm"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="mr-2 h-5 w-5 text-indigo-500" />
                  Back to Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
