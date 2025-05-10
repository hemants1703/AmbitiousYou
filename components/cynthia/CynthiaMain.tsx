"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, BotIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import "./styles.css"
interface Message {
    role: "user" | "assistant"
    content: string
}

export default function CynthiaMain({ cynthiaOnScreen, setCynthiaOnScreen }: { cynthiaOnScreen: boolean, setCynthiaOnScreen: (cynthiaOnScreen: boolean) => void }) {
    const [messages, setMessages] = React.useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm Cynthia, your personal AI assistant. How can I help you today?"
        }
    ])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        // TODO: Implement actual API call to your backend
        // For now, we'll just simulate a response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm here to help! This is a simulated response. In the future, I'll be connected to a real AI backend."
            }])
            setIsLoading(false)
        }, 1000)
    }

    return (
        <Dialog open={cynthiaOnScreen} onOpenChange={setCynthiaOnScreen}>
            <DialogContent className={`${cynthiaOnScreen ? "scale-in-ver-center" : ""} sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 bg-gradient-to-b from-background/20 to-background/20 backdrop-blur-3xl border border-custom-light/20`}>
                <DialogHeader className="px-6 py-4 border-b border-custom-light/20">
                    <DialogTitle className="flex items-center gap-2 text-custom-dark dark:text-custom-light">
                        <BotIcon className="w-5 h-5" />
                        Cynthia Assistant
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-full bg-custom-light/20 flex items-center justify-center">
                                        <BotIcon className="w-4 h-4 text-custom-dark dark:text-custom-light" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg px-4 py-2",
                                        message.role === "user"
                                            ? "bg-custom-dark text-white"
                                            : "bg-custom-light/20 text-custom-dark dark:text-custom-light"
                                    )}
                                >
                                    {message.content}
                                </div>
                                {message.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-custom-dark/20 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-custom-dark dark:text-custom-light" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-custom-light/20 flex items-center justify-center">
                                    <BotIcon className="w-4 h-4 text-custom-dark dark:text-custom-light" />
                                </div>
                                <div className="bg-custom-light/20 text-custom-dark dark:text-custom-light rounded-lg px-4 py-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-custom-dark dark:bg-custom-light animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-custom-dark dark:bg-custom-light animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 rounded-full bg-custom-dark dark:bg-custom-light animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="p-4 border-t border-custom-light/20">
                    <div className="flex gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="min-h-[60px] resize-none bg-background/50 border-custom-light/20 focus-visible:ring-custom-light/20"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(e)
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-custom-dark hover:bg-custom-dark/90 text-white"
                        >
                            <SendIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}