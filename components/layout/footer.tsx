// @ts-nocheck
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-full lg:col-span-2">
            <Logo variant="default" size="md" className="mb-4" />
            <p className="mb-6 max-w-xs text-sm text-gray-600">
              Dinetap AI by OACF Intelligence Ltd is a platform for restaurants
              to create digital ordering systems with AI-powered design.
              Digitalize your restaurant with our easy-to-use platform.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 h-4 w-4 text-indigo-600" />
                <a
                  href="mailto:contact@dinetapai.com"
                  className="hover:text-indigo-600"
                >
                  contact@dinetapai.com
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 h-4 w-4 text-indigo-600" />
                <a href="tel:+1234567890" className="hover:text-indigo-600">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-indigo-600" />
                <span>123 Innovation Drive, Tech City</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/features" className="hover:text-indigo-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} OACF Intelligence Ltd. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-gray-500 transition-colors hover:text-indigo-600"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-500 transition-colors hover:text-indigo-600"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-500 transition-colors hover:text-indigo-600"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
