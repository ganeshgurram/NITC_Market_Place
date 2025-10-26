import { Search, User, MessageCircle, Plus, Bell, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface HeaderProps {
  currentUser?: {
    name: string;
    email?: string;
    avatar?: string;
    rating: number;
    department?: string;
    year?: string;
  };
  onSearch: (query: string) => void;
  onProfileClick: () => void;
  onMessagesClick: () => void;
  onPostItemClick: () => void;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  searchQuery: string;
  unreadMessages: number;
}

export function Header({ 
  currentUser, 
  onSearch, 
  onProfileClick, 
  onMessagesClick, 
  onPostItemClick,
  onSignInClick,
  onSignOut,
  searchQuery,
  unreadMessages 
}: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">NM</span>
            </div>
            <h1>NITC Marketplace</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search books, equipment, stationery..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {currentUser && (
              <>
                <Button onClick={onPostItemClick} className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  List Item
                </Button>
                
                <Button variant="ghost" size="icon" onClick={onMessagesClick} className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>

                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
              </>
            )}

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <div className="font-medium">{currentUser.name}</div>
                      {currentUser.email && (
                        <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                      )}
                      {currentUser.department && (
                        <div className="text-sm text-muted-foreground">
                          {currentUser.department} • {currentUser.year}
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onMessagesClick}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={onSignInClick}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}