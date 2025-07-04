"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, UserIcon, ExternalLinkIcon, XIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { redirect } from "next/navigation";

interface Citation {
  id: string;
  title: string;
  content: string;
  source?: string;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function CynthiaPage() {
  redirect("/");
  const [selectedCitation, setSelectedCitation] = React.useState<Citation | null>(null);
  const [showCitations, setShowCitations] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **Cynthia**, your personal AI ambition coach. I'm here to help you transform your dreams into actionable plans and guide you on your journey to success.\n\nWhat ambitious goal would you like to work on today?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const responses = [
        {
          content:
            "**Excellent ambition!** Based on my analysis, here's what I recommend:\n\n## Strategic Breakdown\n1. **Foundation Phase** (Weeks 1-2): Establish baseline habits and metrics\n2. **Growth Phase** (Weeks 3-8): Implement progressive improvements\n3. **Optimization Phase** (Weeks 9-12): Fine-tune and accelerate progress\n\n## Success Indicators\n- Track daily progress with measurable metrics\n- Weekly reflection and adjustment sessions\n- Monthly milestone celebrations\n\nWould you like me to create a detailed action plan for any specific phase?",
          citations: [
            {
              id: "1",
              title: "Goal Achievement Psychology",
              content:
                "Research demonstrates that structured goal breakdown increases achievement rates by 42% compared to vague aspirations.",
              source: "Journal of Applied Psychology, 2024",
              url: "https://example.com/research",
            },
            {
              id: "2",
              title: "Progressive Development Framework",
              content:
                "The three-phase approach (Foundation → Growth → Optimization) has shown 67% higher completion rates in long-term goal pursuit.",
              source: "Behavioral Science Quarterly",
              url: "https://example.com/framework",
            },
          ],
        },
      ];

      const randomResponse = responses[0];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          ...randomResponse,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    setShowCitations(true);
  };

  return (
    <div className="h-[calc(100svh-4rem)] bg-background">
      <div className="h-full max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#64ccc5] to-[#176b87] flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cynthia</h1>
              <p className="text-sm text-muted-foreground">AI Ambition Coach</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="h-full lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm h-full">
              {/* Chat Messages */}
              <div className="p-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                        message.role === "user" ? "flex-row-reverse" : ""
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0">
                        {message.role === "assistant" ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#64ccc5] to-[#176b87] flex items-center justify-center">
                            <SparklesIcon className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#176b87] to-[#64ccc5] flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium mb-1",
                            message.role === "user" ? "text-right" : ""
                          )}
                        >
                          {message.role === "assistant" ? "Cynthia" : "You"}
                        </div>

                        <div
                          className={cn(
                            "prose prose-sm max-w-none",
                            message.role === "user"
                              ? "bg-[#176b87] text-white rounded-lg px-4 py-3 ml-auto max-w-[80%]"
                              : "bg-gray-50 rounded-lg px-4 py-3"
                          )}
                        >
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-inherit">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2
                                  className={cn(
                                    "text-base font-semibold mb-2",
                                    message.role === "user" ? "text-white" : "text-[#176b87]"
                                  )}
                                >
                                  {children}
                                </h2>
                              ),
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0 text-inherit">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong
                                  className={cn(
                                    "font-semibold",
                                    message.role === "user" ? "text-white" : "text-[#176b87]"
                                  )}
                                >
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul className="space-y-1 ml-4 mb-2">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="space-y-1 ml-4 mb-2">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="flex items-start gap-2">
                                  <span
                                    className={cn(
                                      "mt-0.5",
                                      message.role === "user" ? "text-white" : "text-[#64ccc5]"
                                    )}
                                  >
                                    •
                                  </span>
                                  <span>{children}</span>
                                </li>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>

                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/20">
                              <div className="text-xs text-muted-foreground mb-2">Sources:</div>
                              <div className="flex flex-wrap gap-1">
                                {message.citations.map((citation, i) => (
                                  <button
                                    key={citation.id}
                                    onClick={() => handleCitationClick(citation)}
                                    className="text-xs px-2 py-1 bg-[#64ccc5]/10 hover:bg-[#64ccc5]/20 text-[#176b87] rounded border border-[#64ccc5]/20 hover:border-[#64ccc5]/40 transition-all duration-200 hover:scale-105"
                                  >
                                    [{i + 1}] {citation.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#64ccc5] to-[#176b87] flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">Cynthia</div>
                        <div className="bg-gray-50 rounded-lg px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#64ccc5] animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-[#64ccc5] animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-[#64ccc5] animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t bg-gray-50/50 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Cynthia about your ambitions..."
                      className="max-h-32 resize-none pr-12 bg-white border-gray-200 focus:border-[#64ccc5] focus:ring-[#64ccc5]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      size="sm"
                      className="absolute right-2 bottom-2 h-8 w-8 bg-[#176b87] hover:bg-[#176b87]/90 transition-all duration-200 hover:scale-105"
                    >
                      <SendIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar for Citations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm sticky top-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-foreground">Research Sources</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on source citations to view details
                </p>
              </div>

              <div className="p-4">
                {selectedCitation ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div>
                      <h4 className="font-semibold text-[#176b87] mb-2">
                        {selectedCitation.title}
                      </h4>
                      {selectedCitation.source && (
                        <Badge variant="outline" className="text-xs mb-3">
                          {selectedCitation.source}
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCitation.content}
                    </div>

                    {selectedCitation.url && (
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-[#176b87] hover:bg-[#176b87]/90 transition-all duration-200 hover:scale-105"
                      >
                        <a
                          href={selectedCitation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                          View Source
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                      <ExternalLinkIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm">
                      No citation selected. Click on a source link in the conversation to view
                      details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
