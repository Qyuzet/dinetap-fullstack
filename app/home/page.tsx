// @ts-nocheck
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  Sparkles,
  Globe,
  Utensils,
  LayoutDashboard,
  Clock,
  Zap,
  ArrowRight,
  ChevronRight,
  BarChart2,
  Shield,
  Smartphone,
  Server,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden bg-black pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        {/* Animated particles or dots (simulated with pseudo-elements) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-[10%] h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
          <div className="absolute -bottom-20 right-[5%] h-60 w-60 rounded-full bg-purple-600/20 blur-3xl"></div>
          <div className="absolute left-[40%] top-[30%] h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 py-20 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <div className="mb-12 w-full max-w-2xl text-center lg:mb-0 lg:text-left">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-400"></span>
              AI-Powered Restaurant Solutions
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Restaurant
              </span>{" "}
              With Intelligent Ordering
            </h1>

            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              Create sophisticated digital ordering systems with AI-powered
              design, intelligent recommendations, and seamless operations
              management.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                <Link href="/features" className="flex items-center">
                  Explore Features
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 lg:justify-start">
              <div className="flex -space-x-2">
                {[
                  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120",
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120",
                  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120",
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-black"
                  >
                    <Image
                      src={src}
                      alt={`User ${i + 1}`}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-medium text-indigo-400">500+</span>{" "}
                restaurants trust Dinetap AI
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-lg lg:max-w-xl">
            {/* Decorative elements */}
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"></div>

            {/* Dashboard mockup */}
            <div className="relative rounded-xl border border-gray-800 bg-gray-900/80 p-2 shadow-2xl backdrop-blur-sm">
              <div className="absolute -right-3 -top-3 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-medium text-indigo-300 backdrop-blur-md">
                <div className="rounded-full bg-indigo-600/80 px-3 py-1">
                  AI-Powered
                </div>
              </div>

              <div className="rounded-lg bg-gray-800 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Dinetap AI Dashboard
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 rounded bg-gray-700"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-24 rounded bg-indigo-900/60"></div>
                    <div className="h-24 rounded bg-indigo-800/60"></div>
                    <div className="h-24 rounded bg-indigo-700/60"></div>
                  </div>
                  <div className="h-32 rounded bg-gray-700"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 rounded bg-indigo-600/60"></div>
                    <div className="h-16 rounded bg-indigo-500/60"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-5 -left-5 rounded-lg border border-gray-800 bg-gray-900/90 p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <BarChart2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Orders Today</div>
                    <div className="text-lg font-bold text-white">+27.4%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Intelligent Workflow
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              How Dinetap AI Transforms Your Restaurant
            </h2>
            <p className="text-lg text-gray-600">
              Our sophisticated AI platform elevates your restaurant's digital
              presence through an intelligent, streamlined process
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            {/* Modern timeline with cards */}
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: <Globe className="h-6 w-6 text-indigo-600" />,
                  title: "Connect & Analyze",
                  description:
                    "Provide your restaurant's website or description. Our advanced AI analyzes your brand identity, menu structure, and customer preferences to create a tailored digital experience.",
                  imageComponent: (
                    <div className="h-[200px] w-full rounded-lg bg-gray-100 p-4">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 rounded bg-indigo-100"></div>
                        <div className="h-6 w-6 rounded-full bg-indigo-200"></div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded bg-indigo-200"></div>
                          <div className="h-4 w-3/4 rounded bg-indigo-100"></div>
                          <div className="h-4 w-5/6 rounded bg-indigo-200"></div>
                        </div>
                        <div className="rounded-lg bg-indigo-50 p-2">
                          <div className="h-full w-full rounded bg-indigo-100"></div>
                        </div>
                      </div>
                      <div className="mt-4 h-20 rounded-lg bg-indigo-50 p-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-full rounded bg-indigo-200"></div>
                          <div className="h-full rounded bg-indigo-100"></div>
                          <div className="h-full rounded bg-indigo-200"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  step: "02",
                  icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
                  title: "AI-Powered Creation",
                  description:
                    "Our sophisticated algorithms design a custom-branded ordering portal that perfectly captures your restaurant's essence, automatically generating an optimized digital menu.",
                  imageComponent: (
                    <div className="h-[200px] w-full rounded-lg bg-gray-100 p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-300"></div>
                        <div className="h-4 w-24 rounded bg-indigo-200"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-2">
                          <div className="h-24 rounded-lg bg-indigo-100 p-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="h-3 w-full rounded bg-indigo-200"></div>
                                <div className="h-3 w-2/3 rounded bg-indigo-200"></div>
                                <div className="h-3 w-1/2 rounded bg-indigo-200"></div>
                              </div>
                              <div className="h-full rounded bg-indigo-200"></div>
                            </div>
                          </div>
                          <div className="h-12 rounded-lg bg-indigo-50"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-12 rounded-lg bg-indigo-200"></div>
                          <div className="h-24 rounded-lg bg-indigo-100"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  step: "03",
                  icon: <Utensils className="h-6 w-6 text-indigo-600" />,
                  title: "Seamless Operations",
                  description:
                    "Launch your complete digital ecosystem with dedicated interfaces for customers, cashiers, and kitchen staff—all working in perfect harmony to streamline your operations.",
                  imageComponent: (
                    <div className="h-[200px] w-full rounded-lg bg-gray-100 p-4">
                      <div className="mb-3 flex justify-between">
                        <div className="h-5 w-32 rounded bg-indigo-200"></div>
                        <div className="flex space-x-1">
                          <div className="h-5 w-5 rounded bg-indigo-100"></div>
                          <div className="h-5 w-5 rounded bg-indigo-200"></div>
                          <div className="h-5 w-5 rounded bg-indigo-300"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="h-16 rounded-lg bg-indigo-100 p-2">
                            <div className="flex h-full items-center justify-between">
                              <div className="h-4 w-16 rounded bg-indigo-200"></div>
                              <div className="h-8 w-8 rounded-full bg-indigo-200"></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-12 rounded bg-indigo-50"></div>
                            <div className="h-12 rounded bg-indigo-100"></div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-indigo-50 p-2">
                          <div className="mb-2 h-4 w-full rounded bg-indigo-100"></div>
                          <div className="grid grid-cols-3 gap-1">
                            <div className="h-20 rounded bg-indigo-200"></div>
                            <div className="h-20 rounded bg-indigo-100"></div>
                            <div className="h-20 rounded bg-indigo-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                  <div className="relative p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                        {item.icon}
                      </div>
                      <span className="text-3xl font-bold text-gray-200 transition-colors group-hover:text-indigo-200">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mb-6 text-gray-600">{item.description}</p>

                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      {item.imageComponent}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>

                    <div className="flex items-center text-sm font-medium text-indigo-600">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
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
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <Shield className="mr-1 h-3.5 w-3.5" />
              Enterprise-Grade Platform
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Advanced Features Powered by AI
            </h2>
            <p className="text-lg text-gray-600">
              A comprehensive suite of tools designed to revolutionize your
              restaurant's digital presence
            </p>
          </div>

          <div className="mx-auto max-w-7xl">
            {/* Featured highlight */}
            <div className="mb-16 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-indigo-950 shadow-xl">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <div className="mb-4 inline-flex items-center rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    AI-Powered Design
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-white">
                    Intelligent Design System
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Our advanced AI analyzes your brand identity and
                    automatically generates a custom-designed ordering portal
                    that perfectly matches your restaurant's aesthetic and
                    values.
                  </p>
                  <ul className="mb-8 space-y-3">
                    {[
                      "Brand identity recognition",
                      "Automatic color scheme generation",
                      "Typography and layout optimization",
                      "Responsive design for all devices",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/30">
                          <svg
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.5 3L2.5 5L7.5 0"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Link href="/features" className="flex items-center">
                      Learn more about AI design
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative hidden md:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
                  <div className="h-full w-full p-8">
                    <div className="grid h-full grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="h-24 rounded-lg bg-indigo-500/20 p-4">
                          <div className="h-4 w-24 rounded bg-white/20"></div>
                          <div className="mt-2 h-8 rounded bg-white/10"></div>
                        </div>
                        <div className="h-32 rounded-lg bg-indigo-600/20 p-4">
                          <div className="h-4 w-16 rounded bg-white/20"></div>
                          <div className="mt-2 h-16 rounded bg-white/10"></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-40 rounded-lg bg-purple-500/20 p-4">
                          <div className="h-4 w-20 rounded bg-white/20"></div>
                          <div className="mt-2 h-24 rounded bg-white/10"></div>
                        </div>
                        <div className="h-16 rounded-lg bg-purple-600/20 p-4">
                          <div className="h-4 w-12 rounded bg-white/20"></div>
                          <div className="mt-2 h-4 rounded bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <LayoutDashboard className="h-6 w-6 text-indigo-600" />,
                  title: "Unified Dashboard",
                  description:
                    "A comprehensive control center that gives you complete visibility and control over all aspects of your digital ordering system.",
                  tag: "Management",
                },
                {
                  icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
                  title: "Multi-Interface System",
                  description:
                    "Dedicated views for customers, cashiers, and kitchen staff create a seamless end-to-end ordering experience with real-time synchronization.",
                  tag: "Operations",
                },
                {
                  icon: <Zap className="h-6 w-6 text-indigo-600" />,
                  title: "Rapid Deployment",
                  description:
                    "Launch your complete digital ordering ecosystem in minutes with our AI-powered setup process and intuitive configuration tools.",
                  tag: "Efficiency",
                },
                {
                  icon: <Globe className="h-6 w-6 text-indigo-600" />,
                  title: "Brand Intelligence",
                  description:
                    "Our AI analyzes your existing web presence to maintain perfect brand consistency across all digital touchpoints automatically.",
                  tag: "Branding",
                },
                {
                  icon: <Utensils className="h-6 w-6 text-indigo-600" />,
                  title: "Smart Menu System",
                  description:
                    "Intelligent menu management with AI-suggested categories, dynamic pricing options, and customizable modifiers for a complete menu experience.",
                  tag: "Core Feature",
                },
                {
                  icon: <BarChart2 className="h-6 w-6 text-indigo-600" />,
                  title: "Analytics & Insights",
                  description:
                    "Gain valuable business intelligence with comprehensive analytics on order patterns, customer preferences, and operational efficiency.",
                  tag: "Intelligence",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                  <div className="mb-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {feature.tag}
                  </div>

                  <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                    {feature.icon}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mb-4 text-gray-600">{feature.description}</p>

                  <div className="mt-auto flex items-center text-sm font-medium text-indigo-600">
                    Explore feature
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Success Stories
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Trusted by Leading Restaurants
            </h2>
            <p className="text-lg text-gray-600">
              See how innovative restaurants are transforming their digital
              experience with Dinetap AI
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Featured testimonial */}
            <div className="mb-16 overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="grid md:grid-cols-5">
                <div className="col-span-3 p-8 md:p-12">
                  <div className="mb-6">
                    <svg
                      width="120"
                      height="30"
                      viewBox="0 0 120 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-indigo-600"
                    >
                      {[...Array(5)].map((_, i) => (
                        <path
                          key={i}
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="currentColor"
                          transform={`translate(${i * 24}, 0)`}
                        />
                      ))}
                    </svg>
                  </div>
                  <blockquote className="mb-8">
                    <p className="mb-4 text-2xl font-medium italic text-gray-900">
                      "Dinetap AI has completely transformed how we handle
                      orders. The AI-designed interface perfectly captures our
                      brand essence, and our customers love the seamless
                      ordering experience. Our online orders have increased by
                      45% since implementation."
                    </p>
                    <footer className="flex items-center">
                      <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120"
                          alt="Marco Tempest"
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Marco Tempest</p>
                        <p className="text-sm text-gray-600">
                          CEO, Solaria Restaurant Group
                        </p>
                      </div>
                    </footer>
                  </blockquote>
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                      <BarChart2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">45% increase</p>
                      <p className="text-sm text-gray-600">in online orders</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 hidden bg-indigo-600 md:block">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800"></div>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
                    <div className="absolute bottom-8 left-8 rounded-lg bg-white/90 p-4 backdrop-blur-sm">
                      <div className="text-xl font-bold text-indigo-600">
                        Solaria Restaurant
                      </div>
                      <div className="text-sm text-gray-600">
                        Premium Dining Experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial grid */}
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    "The AI design captured our brand perfectly. Our customers love how easy it is to order online now.",
                  author: "Anita Rodriguez",
                  role: "Operations Manager, Spice Garden",
                  image:
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120",
                  rating: 5,
                },
                {
                  quote:
                    "The kitchen interface has streamlined our operations. We're processing orders faster than ever before.",
                  author: "David Lee",
                  role: "Executive Chef, Burger House",
                  image:
                    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120",
                  rating: 5,
                },
                {
                  quote:
                    "Dinetap AI's analytics have given us insights we never had before. We've optimized our menu based on the data.",
                  author: "Sarah Johnson",
                  role: "Owner, Fresh Bites Café",
                  image:
                    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-indigo-500"
                        >
                          <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="currentColor"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="mb-6 text-gray-700">"{testimonial.quote}"</p>

                  <div className="mt-auto flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Logos section */}
            <div className="mt-20">
              <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-gray-500">
                Trusted by restaurants worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {[
                  { name: "Bistro Elegance", color: "text-indigo-600" },
                  { name: "Spice Garden", color: "text-amber-600" },
                  { name: "Ocean Blue", color: "text-blue-600" },
                  { name: "Fresh Bites", color: "text-green-600" },
                  { name: "Urban Plate", color: "text-gray-800" },
                  { name: "Sunset Grill", color: "text-orange-600" },
                ].map((restaurant, i) => (
                  <div key={i} className="h-8">
                    <div
                      className={`text-xl font-bold ${restaurant.color} grayscale transition-all duration-300 hover:grayscale-0`}
                    >
                      {restaurant.name}
                    </div>
                  </div>
                ))}
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

        {/* Animated particles or dots (simulated with pseudo-elements) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-[10%] h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl"></div>
          <div className="absolute -bottom-20 right-[5%] h-60 w-60 rounded-full bg-purple-600/10 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
                <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-400"></span>
                Start Your Digital Transformation
              </div>

              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Elevate Your Restaurant with{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Intelligent AI
                </span>{" "}
                Technology
              </h2>

              <p className="mb-8 text-lg text-gray-300">
                Join the community of forward-thinking restaurants using Dinetap
                AI to create exceptional digital experiences, streamline
                operations, and drive growth.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden bg-indigo-600 px-8 font-medium text-white transition-all hover:bg-indigo-700"
                >
                  <Link href="/dashboard" className="flex items-center">
                    Create Your Portal
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

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-800 pt-8">
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-gray-400">Restaurants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">50,000+</p>
                  <p className="text-sm text-gray-400">Orders Processed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-sm text-gray-400">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl"></div>

              {/* Form card */}
              <div className="relative rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm">
                <div className="absolute -right-3 -top-3 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600/10 text-xs font-medium text-indigo-300 backdrop-blur-md">
                  <div className="rounded-full bg-indigo-600/80 px-3 py-1">
                    14-day trial
                  </div>
                </div>

                <h3 className="mb-6 text-2xl font-bold text-white">
                  Get Started Today
                </h3>

                <div className="mb-8 space-y-4">
                  <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                    <div className="mb-1 text-sm font-medium text-gray-300">
                      Restaurant Name
                    </div>
                    <div className="text-lg text-white">Your Restaurant</div>
                  </div>

                  <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                    <div className="mb-1 text-sm font-medium text-gray-300">
                      Website
                    </div>
                    <div className="text-lg text-white">yourrestaurant.com</div>
                  </div>

                  <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                    <div className="mb-1 text-sm font-medium text-gray-300">
                      AI Design Style
                    </div>
                    <div className="flex items-center text-lg text-white">
                      <span className="mr-2 h-3 w-3 rounded-full bg-indigo-500"></span>
                      Modern Elegance
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-indigo-600 font-medium text-white hover:bg-indigo-700"
                >
                  <Link href="/dashboard">Start Creating</Link>
                </Button>

                <p className="mt-4 text-center text-sm text-gray-400">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Button removed */}
    </main>
  );
}
