// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Globe, FileText, Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  createPortalData,
  generateColorScheme,
  analyzeRestaurantWebsite,
} from "./page-server";
import { saveMenuItems } from "./menu-actions";
import { MenuItem } from "@/models/Portal";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  websiteUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  websiteDescription: z.string().optional(),
});

export default function CreatePortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("website");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      websiteUrl: "",
      websiteDescription: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true);

    try {
      // Get the website URL if available
      const websiteUrl =
        activeTab === "website" ? values.websiteUrl : undefined;

      // Generate a color scheme based on the website URL
      const colors = await generateColorScheme(websiteUrl);

      // Initialize variables for restaurant data
      let restaurantName = values.name;
      let description = values.description || "";
      let menuItems: Omit<MenuItem, "id">[] = [];

      // If website URL is provided, analyze the website
      if (websiteUrl) {
        toast({
          title: "Analyzing Website",
          description:
            "We're analyzing your restaurant website to extract information and menu items...",
        });

        // Analyze the restaurant website
        const analysis = await analyzeRestaurantWebsite(websiteUrl);

        // Update restaurant name if not already set
        if (!restaurantName && analysis.restaurantName) {
          restaurantName = analysis.restaurantName;
          form.setValue("name", restaurantName);
        }

        // Update description if not already set
        if (!description && analysis.description) {
          description = analysis.description;
          form.setValue("description", description);
        }

        // Use menu items from analysis
        if (analysis.menuItems && analysis.menuItems.length > 0) {
          menuItems = analysis.menuItems;
          toast({
            title: "Menu Items Found",
            description: `We found ${menuItems.length} menu items on your website.`,
          });
        }
      } else {
        // No website URL provided, using empty menu items
        console.log("No website URL provided - using empty menu items");
      }

      // Create the portal
      const newPortal = await createPortalData({
        name: values.name,
        description:
          values.description ||
          (activeTab === "website"
            ? `Created from website: ${values.websiteUrl}`
            : "Created manually"),
        status: "active",
        userId: "user_1", // In a real app, this would be the actual user ID
        colors,
      });

      // If we have a portal ID and menu items, save them to the database
      if (newPortal?.id && menuItems.length > 0) {
        try {
          console.log("Saving menu items for portal:", newPortal.id);

          // Update the portalId for each menu item
          const menuItemsWithPortalId = menuItems.map((item) => ({
            ...item,
            portalId: newPortal.id,
          }));

          // Save menu items to the database using the server action
          const success = await saveMenuItems(menuItemsWithPortalId);

          if (success) {
            console.log("Menu items saved successfully");

            // AI context generation removed
          } else {
            console.error("Failed to save menu items");
          }
        } catch (saveError) {
          console.error("Error saving menu items:", saveError);
          // Continue even if saving menu items fails
        }
      }

      toast({
        title: "Success",
        description: "Your restaurant portal has been created successfully!",
      });

      setAnalysisComplete(true);

      // Redirect to the dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating portal:", error);
      toast({
        title: "Error",
        description: "Failed to create your portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div
      className="container mx-auto px-4 py-10 relative"
      style={{
        background:
          "radial-gradient(circle at 10% 20%, rgba(236, 242, 255, 0.4) 0%, rgba(250, 250, 255, 0.1) 90%)",
      }}
    >
      <div className="mb-10">
        <Button
          variant="ghost"
          asChild
          className="mb-6 rounded-lg border border-indigo-200 bg-white font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-5 w-5 text-indigo-500" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-white p-8 shadow-sm">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-indigo-800">
            Create New Portal
          </h1>
          <p className="text-lg text-indigo-600/80">
            Set up a new restaurant ordering portal with beautiful design and
            customization options
          </p>
        </div>
      </div>

      <Card className="mx-auto max-w-3xl border-0 bg-white shadow-lg overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl font-bold text-indigo-800">
            Restaurant Information
          </CardTitle>
          <CardDescription className="text-indigo-600/70">
            Provide details about your restaurant to create a customized
            ordering portal with AI-powered design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="website"
            className="space-y-6"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 bg-indigo-50 p-1 rounded-xl">
              <TabsTrigger
                value="website"
                className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              >
                <Globe className="mr-2 h-5 w-5 text-indigo-500" />
                Website Analysis
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              >
                <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                Manual Setup
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <TabsContent value="website" className="space-y-6">
                  <Alert className="bg-indigo-50/70 border-indigo-200 text-indigo-800">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <AlertTitle className="text-lg font-bold">
                      Website Analysis
                    </AlertTitle>
                    <AlertDescription className="text-indigo-700">
                      Enter your restaurant website URL that contains your menu
                      to create a customized ordering portal with AI-powered
                      design, branding, and automatic menu creation. For best
                      results, use a URL that leads directly to a page with menu
                      items. Our AI will analyze your website to extract all the
                      necessary information.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                        <FormLabel className="text-lg font-semibold text-indigo-800">
                          Restaurant Website URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourrestaurant.com"
                            className="mt-2 border-indigo-200 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="mt-2 text-indigo-600/70">
                          Enter your restaurant website URL that contains your
                          menu. Make sure the URL leads directly to a page with
                          menu items. We'll analyze it to extract your
                          restaurant's branding, design elements, and menu items
                          automatically.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                        <FormLabel className="text-lg font-semibold text-indigo-800">
                          Restaurant Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Restaurant Name"
                            className="mt-2 border-indigo-200 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="manual" className="space-y-6">
                  <Alert className="bg-indigo-50/70 border-indigo-200 text-indigo-800">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <AlertTitle className="text-lg font-bold">
                      Manual Setup
                    </AlertTitle>
                    <AlertDescription className="text-indigo-700">
                      Provide details about your restaurant to create a
                      customized ordering portal with your preferred design.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                        <FormLabel className="text-lg font-semibold text-indigo-800">
                          Restaurant Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Restaurant Name"
                            className="mt-2 border-indigo-200 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                        <FormLabel className="text-lg font-semibold text-indigo-800">
                          Restaurant Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your restaurant, cuisine type, and ambiance"
                            className="min-h-[120px] mt-2 border-indigo-200 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="mt-2 text-indigo-600/70">
                          This helps us understand your restaurant's style and
                          create a matching design.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteDescription"
                    render={({ field }) => (
                      <FormItem className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                        <FormLabel className="text-lg font-semibold text-indigo-800">
                          Website Design Preferences
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your preferred color scheme, style, and any specific design elements"
                            className="min-h-[120px] mt-2 border-indigo-200 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="mt-2 text-indigo-600/70">
                          Our AI will use this information to generate a design
                          that matches your preferences and brand identity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isAnalyzing || analysisComplete}
                    className="min-w-[200px] rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 text-lg font-medium shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        {activeTab === "website"
                          ? "Analyzing Website..."
                          : "Creating Portal..."}
                      </>
                    ) : analysisComplete ? (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Portal Created!
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        {activeTab === "website"
                          ? "Create from Website"
                          : "Create Portal"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
