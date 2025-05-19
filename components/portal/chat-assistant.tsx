// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare, X, RefreshCw } from "lucide-react";
import { MenuItem } from "@/types/menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface ChatAssistantProps {
  portalId: string;
  menuItems?: MenuItem[];
}

export function ChatAssistant({
  portalId,
  menuItems = [],
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Dinetap AI, your restaurant assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [retryMessage, setRetryMessage] = useState<Message | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatOpen]);

  // Reset error count after 5 minutes of no errors
  useEffect(() => {
    if (errorCount > 0) {
      const timer = setTimeout(() => {
        setErrorCount(0);
      }, 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [errorCount]);

  const handleSendMessage = async (messageToSend = input, retry = false) => {
    if (!messageToSend.trim()) return;

    // If we're retrying, we don't need to add the user message again
    if (!retry) {
      const userMessage: Message = {
        role: "user",
        content: messageToSend,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");
    setIsLoading(true);
    setRetryMessage(null);

    try {
      // Show typing indicator
      const typingMessage: Message = {
        role: "assistant",
        content: "...",
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        typingMessage,
      ]);

      // Prepare messages for API - filter out error messages and typing indicators
      const messagesToSend = messages
        .filter((msg) => !msg.isError && !msg.isTyping)
        .concat(
          retry
            ? []
            : [{ role: "user", content: messageToSend, timestamp: new Date() }]
        );

      // Create a clean version of messages for the API
      const cleanMessages = messagesToSend.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Set up request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

      console.log("Sending chat request with messages:", cleanMessages.length);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: cleanMessages,
            portalId,
            menuItems,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Remove typing indicator
        setMessages((prev) => prev.filter((m) => !m.isTyping));

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Check if we got a valid response
        if (
          !data.response ||
          typeof data.response !== "string" ||
          data.response.trim() === ""
        ) {
          throw new Error("Received an empty response from the server");
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [
          ...prev.filter((m) => !m.isTyping),
          assistantMessage,
        ]);

        setErrorCount(0); // Reset error count on success
      } catch (fetchError) {
        throw fetchError; // Re-throw to be handled by the outer catch
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => !m.isTyping));

      // Increment error count
      setErrorCount((prev) => prev + 1);

      let errorMessage =
        "I'm sorry, I encountered an error. Please try again later.";

      if (error.name === "AbortError") {
        errorMessage =
          "The request took too long to process. Please try a shorter message or try again.";
      } else if (error.message?.includes("API key")) {
        errorMessage =
          "There's an issue with the AI service. Please try again later.";
      } else if (error.message?.includes("safety")) {
        errorMessage =
          "I couldn't process that request due to content safety policies. Please try a different question.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      const errorMsg: Message = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);

      // Save the message for retry
      if (!retry) {
        setRetryMessage({
          role: "user",
          content: messageToSend,
          timestamp: new Date(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryMessage) {
      // Remove the last error message
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(retryMessage.content, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Check if we should disable the chat due to too many errors
  const isChatDisabled = errorCount >= 5;

  return (
    <>
      {/* Chat button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleChat}
              className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg z-50"
              size="icon"
              variant="default"
              disabled={isChatDisabled}
            >
              {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isChatDisabled
              ? "Chat is temporarily disabled due to errors. Please try again later."
              : isChatOpen
              ? "Close chat"
              : "Open chat assistant"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Chat window */}
      {isChatOpen && !isChatDisabled && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-xl z-50 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dinetap AI Assistant</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px] px-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2 shrink-0">
                      <div className="bg-primary text-white flex items-center justify-center h-full w-full rounded-full text-xs">
                        DT
                      </div>
                    </Avatar>
                  )}

                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isError
                        ? "bg-destructive/10 text-destructive"
                        : message.isTyping
                        ? "bg-muted animate-pulse"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                      {message.isTyping && (
                        <span className="inline-block animate-pulse">...</span>
                      )}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2 shrink-0">
                      <div className="bg-secondary text-secondary-foreground flex items-center justify-center h-full w-full rounded-full text-xs">
                        You
                      </div>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Retry button for errors */}
              {retryMessage && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </Button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="pt-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
                ref={inputRef}
              />
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
