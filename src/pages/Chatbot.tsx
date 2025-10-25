import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Smart Campus assistant. How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("event") || lowerQuery.includes("events")) {
      return "You can find all upcoming events in the Events section. Tech Talk 2024 is happening on March 25th at the Auditorium A!";
    } else if (lowerQuery.includes("lost") || lowerQuery.includes("found")) {
      return "Check the Lost & Found section to report or search for items. We currently have 8 items waiting to be reunited with their owners!";
    } else if (lowerQuery.includes("club") || lowerQuery.includes("clubs")) {
      return "We have 24 active clubs! Popular ones include Coding Club, Photography Club, and Environmental Club. Visit the Clubs section to explore all options.";
    } else if (lowerQuery.includes("feedback")) {
      return "You can submit feedback in the Feedback section. Your voice matters, and all feedback is reviewed by the administration!";
    } else if (lowerQuery.includes("help") || lowerQuery.includes("hi") || lowerQuery.includes("hello")) {
      return "I can help you with:\n- Finding events\n- Lost & Found items\n- Club information\n- Submitting feedback\n- General campus info\n\nWhat would you like to know?";
    } else {
      return "I'm here to help! You can ask me about events, lost & found, clubs, or feedback. What would you like to know?";
    }
  };

  const quickQuestions = [
    "What events are happening?",
    "How do I report a lost item?",
    "Tell me about clubs",
    "How can I give feedback?",
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-creative rounded-full">
              <Bot className="w-5 h-5 text-creative-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Campus Assistant</h1>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[calc(100vh-240px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>Chat with Campus Assistant</CardTitle>
            <CardDescription>
              Ask me anything about campus life, events, clubs, and more!
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={
                          message.sender === "bot"
                            ? "bg-gradient-creative text-creative-foreground"
                            : "bg-gradient-hero text-primary-foreground"
                        }
                      >
                        {message.sender === "bot" ? <Bot className="w-4 h-4" /> : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex flex-col ${
                        message.sender === "user" ? "items-end" : "items-start"
                      } max-w-[70%]`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-gradient-creative">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chatbot;
