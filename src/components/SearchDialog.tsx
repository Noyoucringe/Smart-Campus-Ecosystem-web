import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Package, MessageSquare, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchResults = [
    {
      category: "Events",
      icon: Calendar,
      items: [
        { title: "Tech Talk 2024", subtitle: "March 25, 2024", url: "/events" },
        { title: "Cultural Fest", subtitle: "March 28, 2024", url: "/events" },
      ],
    },
    {
      category: "Lost & Found",
      icon: Package,
      items: [
        { title: "Blue Backpack", subtitle: "Found at Library", url: "/lost-found" },
        { title: "Silver Water Bottle", subtitle: "Found at Cafeteria", url: "/lost-found" },
      ],
    },
    {
      category: "Clubs",
      icon: Users,
      items: [
        { title: "Coding Club", subtitle: "120 members", url: "/clubs" },
        { title: "Photography Club", subtitle: "85 members", url: "/clubs" },
      ],
    },
  ];

  const filteredResults = searchResults
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Campus</DialogTitle>
          <DialogDescription>
            Search for events, lost items, clubs, and more
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[400px] mt-4">
          {query === "" ? (
            <div className="text-center text-muted-foreground py-8">
              Start typing to search
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                    <category.icon className="w-4 h-4" />
                    {category.category}
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => handleSelect(item.url)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
