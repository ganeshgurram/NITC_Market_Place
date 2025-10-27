import { useState } from "react";
import { ArrowLeft, Send, Star, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    isOnline: boolean;
  };
  item: {
    id: string;
    title: string;
    price?: number;
    type: string;
    image: string;
  };
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    otherUser: {
      id: "2",
      name: "Priya Sharma",
      rating: 4.8,
      isOnline: true
    },
    item: {
      id: "item1",
      title: "Advanced Engineering Mathematics - Kreyszig",
      price: 800,
      type: "sale",
      image: "https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=100"
    },
    messages: [
      {
        id: "1",
        senderId: "2",
        content: "Hi! Is this textbook still available?",
        timestamp: "2 hours ago",
        isRead: true
      },
      {
        id: "2",
        senderId: "1",
        content: "Yes, it's still available! The book is in excellent condition.",
        timestamp: "1 hour ago", 
        isRead: true
      },
      {
        id: "3",
        senderId: "2",
        content: "Great! Can we meet tomorrow at the library?",
        timestamp: "30 minutes ago",
        isRead: false
      }
    ],
    lastMessage: "Great! Can we meet tomorrow at the library?",
    lastMessageTime: "30 min ago",
    unreadCount: 1
  },
  {
    id: "2",
    otherUser: {
      id: "3",
      name: "Rahul Kumar",
      rating: 4.5,
      isOnline: false
    },
    item: {
      id: "item2",
      title: "Lab Equipment - Oscilloscope",
      type: "rent",
      image: "https://images.unsplash.com/photo-1758876569703-ea9b21463691?w=100"
    },
    messages: [
      {
        id: "4",
        senderId: "3",
        content: "Hi, I need the oscilloscope for my lab project. Is it available for rent?",
        timestamp: "1 day ago",
        isRead: true
      }
    ],
    lastMessage: "Hi, I need the oscilloscope for my lab project...",
    lastMessageTime: "1 day ago",
    unreadCount: 0
  }
];

export function MessagingInterface({ isOpen, onClose, currentUserId }: MessagingInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations] = useState(mockConversations);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message logic here
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r`}>
          <div className="p-4 border-b flex items-center justify-between">
            <h3>Messages</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-65px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.otherUser.avatar} />
                      <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{conversation.otherUser.name}</h4>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{conversation.otherUser.rating}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {conversation.item.title.substring(0, 20)}...
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Interface */}
        <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  <Avatar>
                    <AvatarImage src={currentConversation.otherUser.avatar} />
                    <AvatarFallback>{currentConversation.otherUser.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium">{currentConversation.otherUser.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{currentConversation.otherUser.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {currentConversation.otherUser.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-3 bg-gray-50 border-b">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentConversation.item.image}
                        alt={currentConversation.item.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{currentConversation.item.title}</h5>
                        <div className="flex items-center space-x-2">
                          {currentConversation.item.price && (
                            <span className="text-sm font-medium text-primary">
                              ₹{currentConversation.item.price}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {currentConversation.item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUserId
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h3>Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}