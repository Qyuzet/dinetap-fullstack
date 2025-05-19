"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Globe, Palette, Menu, Bot, Sparkles } from "lucide-react";

interface AnalysisVisualizerProps {
  websiteUrl: string;
  isAnalyzing: boolean;
  analysisResult?: any;
  onComplete?: () => void;
}

export default function AnalysisVisualizer({
  websiteUrl,
  isAnalyzing,
  analysisResult,
  onComplete,
}: AnalysisVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Steps in the analysis process
  const steps = [
    { id: "connect", label: "Connecting to website", icon: Globe, delay: 1000 },
    { id: "analyze", label: "Analyzing content", icon: Bot, delay: 2000 },
    { id: "extract", label: "Extracting information", icon: Sparkles, delay: 2000 },
    { id: "generate", label: "Generating theme", icon: Palette, delay: 1500 },
    { id: "menu", label: "Creating menu items", icon: Menu, delay: 2000 },
    { id: "complete", label: "Analysis complete", icon: CheckCircle2, delay: 1000 },
  ];

  // Reset state when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentStep(0);
      setShowColorPalette(false);
      setShowMenuItems(false);
      setShowDescription(false);
      setIsComplete(false);
    }
  }, [isAnalyzing]);

  // Progress through steps
  useEffect(() => {
    if (!isAnalyzing || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);

      // Show color palette after the "generate" step
      if (currentStep === 3) {
        setShowColorPalette(true);
      }

      // Show menu items after the "menu" step
      if (currentStep === 4) {
        setShowMenuItems(true);
      }

      // Show description after all steps
      if (currentStep === 5) {
        setShowDescription(true);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, steps[currentStep].delay);

    return () => clearTimeout(timer);
  }, [currentStep, isAnalyzing, steps, onComplete]);

  // If not analyzing and no result, don't show anything
  if (!isAnalyzing && !analysisResult) return null;

  // Extract colors from analysis result
  const colors = analysisResult?.analysis?.themeRecommendations || {
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    accentColor: "#DBEAFE",
  };

  // Extract menu items from analysis result
  const menuItems = analysisResult?.menuItems || [];

  // Extract description from analysis result
  const description = analysisResult?.analysis?.description || "";

  return (
    <Card className="w-full mt-4 overflow-hidden border-2 border-indigo-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700">
          AI Analysis: {websiteUrl}
        </h3>

        {/* Progress steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                y: 0,
              }}
              className="flex items-center gap-3"
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : index === currentStep ? (
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              ) : (
                <step.icon className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={`${
                  index <= currentStep
                    ? "text-indigo-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Results visualization */}
        <div className="space-y-6">
          {/* Color palette */}
          <AnimatePresence>
            {showColorPalette && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Generated Color Palette
                </h4>
                <div className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-md shadow-sm"
                    style={{ backgroundColor: colors.primaryColor }}
                  />
                  <div
                    className="w-12 h-12 rounded-md shadow-sm"
                    style={{ backgroundColor: colors.secondaryColor }}
                  />
                  <div
                    className="w-12 h-12 rounded-md shadow-sm"
                    style={{ backgroundColor: colors.accentColor }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{colors.primaryColor}</Badge>
                  <Badge variant="outline">{colors.secondaryColor}</Badge>
                  <Badge variant="outline">{colors.accentColor}</Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu items preview */}
          <AnimatePresence>
            {showMenuItems && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Generated Menu Items ({menuItems.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {menuItems.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-2 border rounded-md text-sm"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-xs truncate">
                        {item.description || "No description"}
                      </div>
                      <div className="text-indigo-600 font-medium">
                        ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                      </div>
                    </motion.div>
                  ))}
                </div>
                {menuItems.length > 4 && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{menuItems.length - 4} more items
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Restaurant Description
                </h4>
                <p className="text-sm text-gray-700 italic">"{description}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete message */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 p-3 rounded-md border border-green-200"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">
                    Analysis complete! Your restaurant portal is ready.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
