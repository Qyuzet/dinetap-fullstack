// @ts-nocheck
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Store,
  Sparkles,
  Globe,
  Utensils,
  LayoutDashboard,
  Clock,
  Zap,
  CheckCircle,
  ChefHat,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Shield,
  BarChart2,
  Server,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-24 pt-32">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.1)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.1)_0%,_rgba(0,0,0,0)_60%)]"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
            <Shield className="mr-1 h-3.5 w-3.5" />
            Platform Capabilities
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Dinetap AI{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform Features
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Discover how our AI-powered platform can transform your
            restaurant&apos;s digital ordering experience with intelligent
            automation
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI-Powered Platform
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Core Platform Features
            </h2>
            <p className="text-lg text-gray-600">
              Our intelligent platform combines cutting-edge AI with intuitive
              design to create a seamless digital experience for your restaurant
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  AI-Powered Design
                </h3>
                <p className="mb-4 text-gray-700">
                  Our advanced AI analyzes your restaurant&apos;s website or
                  description to create a custom-branded ordering portal that
                  matches your restaurant&apos;s identity. The system
                  automatically extracts your color scheme, style, and menu
                  items to create a cohesive digital experience.
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Multiple Interfaces
                </h3>
                <p className="mb-4 text-gray-700">
                  Dinetap AI provides three specialized interfaces: a
                  customer-facing ordering portal, an admin dashboard for
                  cashiers to manage orders, and a kitchen view for food
                  preparation staff. Each interface is optimized for its
                  specific purpose, creating a seamless workflow.
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Website Integration
                </h3>
                <p className="mb-4 text-gray-700">
                  Simply provide your existing website URL, and our AI will
                  analyze it to extract your brand identity, menu items, and
                  design elements. This ensures your digital ordering system
                  maintains consistent branding with your main website.
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Quick Setup
                </h3>
                <p className="mb-4 text-gray-700">
                  Get your digital ordering system up and running in minutes,
                  not weeks. Our streamlined setup process eliminates the need
                  for complex development work or design skills. Just provide
                  your information, and our AI handles the rest.
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-20 grid gap-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white md:grid-cols-3">
            {[
              {
                value: "85%",
                label: "Increase in online orders",
                icon: <BarChart2 className="h-6 w-6" />,
              },
              {
                value: "3.5x",
                label: "Faster order processing",
                icon: <Clock className="h-6 w-6" />,
              },
              {
                value: "24/7",
                label: "Automated operations",
                icon: <Server className="h-6 w-6" />,
              },
            ].map((stat, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-indigo-100">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Features */}
      <section className="relative overflow-hidden bg-gray-50 py-24">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.05)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.05)_0%,_rgba(0,0,0,0)_60%)]"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <LayoutDashboard className="mr-1 h-3.5 w-3.5" />
              User Experience
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Specialized Interfaces
            </h2>
            <p className="text-lg text-gray-600">
              Each interface is tailored to its specific user, creating a
              seamless workflow from order to delivery
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Customer Interface */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Customer Portal
                </h3>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Intuitive menu browsing with categories and search
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      AI-powered food recommendations based on preferences
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Simple cart management and checkout process
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Real-time order status updates
                    </span>
                  </li>
                </ul>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  View demo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Admin Interface */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <Store className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h3>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Comprehensive order management system
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Order status tracking and updates
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Menu and inventory management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Sales analytics and reporting
                    </span>
                  </li>
                </ul>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  View demo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Kitchen Interface */}
            <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                <ChefHat className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="relative">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Kitchen View
                </h3>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Clear display of incoming orders
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Order prioritization and timing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Special instructions highlighted
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      One-click status updates
                    </span>
                  </li>
                </ul>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  View demo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full overflow-hidden bg-black py-24 text-white">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.2)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.2)_0%,_rgba(0,0,0,0)_60%)]"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-400"></span>
              Start Your Journey
            </div>

            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Restaurant
              </span>
              ?
            </h2>

            <p className="mb-8 text-lg text-gray-300">
              Join hundreds of restaurants already using Dinetap AI to create
              exceptional digital experiences, streamline operations, and drive
              growth. Start with a 14-day free trial.
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden bg-indigo-600 px-8 font-medium text-white transition-all hover:bg-indigo-700"
              >
                <Link href="/dashboard" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-700 bg-gray-900/50 font-medium text-gray-200 backdrop-blur-sm transition-all hover:border-indigo-500 hover:bg-gray-800/50 hover:text-indigo-300"
              >
                <Link href="/pricing" className="flex items-center">
                  View Pricing
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
