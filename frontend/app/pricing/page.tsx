// @ts-nocheck
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-24 pt-32">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.1)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.1)_0%,_rgba(0,0,0,0)_60%)]"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Pricing Plans
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Choose the plan that works best for your restaurant. All plans
            include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <Card
              className="flex flex-col overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="h-2 w-full bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Starter
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-indigo-600">
                    $49
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </div>
                <CardDescription className="mt-5 text-gray-600">
                  Perfect for small restaurants just getting started with
                  digital ordering
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Single restaurant portal
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Customer ordering interface
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">Admin dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">Kitchen view</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Up to 50 menu items
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Basic AI recommendations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full bg-indigo-600 font-medium text-white transition-all hover:bg-indigo-700"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Professional Plan */}
            <Card
              className="flex flex-col overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
              style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)" }}
            >
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-indigo-600/10"></div>
              <div className="absolute -left-12 -bottom-12 h-24 w-24 rounded-full bg-purple-600/10"></div>
              <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="rounded-t-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-center text-sm font-semibold uppercase tracking-wider text-white">
                Most Popular
              </div>
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Professional
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-indigo-600">
                    $99
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </div>
                <CardDescription className="mt-5 text-gray-600">
                  Ideal for established restaurants with moderate order volume
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Single restaurant portal
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Customer ordering interface
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Advanced admin dashboard
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Enhanced kitchen view
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Unlimited menu items
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Advanced AI recommendations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Priority email & chat support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Analytics dashboard
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card
              className="flex flex-col overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="h-2 w-full bg-gradient-to-r from-gray-700 to-gray-900"></div>
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Enterprise
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-indigo-600">
                    $249
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </div>
                <CardDescription className="mt-5 text-gray-600">
                  For restaurant chains and high-volume establishments
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Multiple restaurant portals (up to 5)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Custom-branded interfaces
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Enterprise admin dashboard
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Advanced kitchen management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Unlimited menu items
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Premium AI features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      24/7 priority support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">
                      Advanced analytics & reporting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span className="ml-3 text-gray-700">API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full bg-gray-900 font-medium text-white transition-all hover:bg-gray-800"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center"
                  >
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-gray-50 py-24">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.05)_0%,_rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.05)_0%,_rgba(0,0,0,0)_60%)]"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Support
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Dinetap AI pricing and plans
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
            <div className="divide-y divide-gray-100">
              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Can I switch plans later?
                </h3>
                <p className="mt-3 text-gray-700">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes will be reflected in your next billing cycle. There
                  are no penalties for changing plans.
                </p>
              </div>

              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Is there a setup fee?
                </h3>
                <p className="mt-3 text-gray-700">
                  No, there are no setup fees. You only pay the monthly
                  subscription fee for your chosen plan. Our AI-powered system
                  makes setup quick and easy.
                </p>
              </div>

              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Do you offer a free trial?
                </h3>
                <p className="mt-3 text-gray-700">
                  Yes, we offer a 14-day free trial on all plans so you can test
                  the platform before committing. No credit card is required to
                  start your trial.
                </p>
              </div>

              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  What payment methods do you accept?
                </h3>
                <p className="mt-3 text-gray-700">
                  We accept all major credit cards, including Visa, Mastercard,
                  American Express, and Discover. We also support payment via
                  PayPal for your convenience.
                </p>
              </div>

              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="mt-3 text-gray-700">
                  Yes, you can cancel your subscription at any time. You&apos;ll
                  continue to have access until the end of your current billing
                  period with no additional charges.
                </p>
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
              14-Day Free Trial
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
              growth. No credit card required.
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden bg-indigo-600 px-8 font-medium text-white transition-all hover:bg-indigo-700"
              >
                <Link href="/dashboard" className="flex items-center">
                  Start Free Trial
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
                  Learn More
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
