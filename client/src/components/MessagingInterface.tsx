import { useState, useEffect } from "react";
import { ArrowLeft, Send, Star, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { messagesAPI } from "../utils/api";
import { toast } from "sonner";
import React from "react";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    rating?: number;
  };
  receiver: {
    _id: string;
    name: string;
    rating?: number;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  conversationId: string;
  otherUser: {
    _id: string;
    name: string;
    rating?: number;
  };
  item?: {
    _id: string;
    title: string;
    images?: string[];
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  selectedSeller?: {
    id: string;
    name: string;
    rating?: number;
  } | null;
  selectedItem?: {
    id: string;
    title: string;
    images?: string[];
  } | null;
}

export function MessagingInterface({
  isOpen,
  onClose,
  currentUserId,
  selectedSeller,
  selectedItem
}: MessagingInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate conversation ID from two user IDs
  const generateConversationId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  // Fetch conversations when modal opens, clear selection when it closes
  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    } else {
      // Clear selection when modal closes
      setSelectedConversation(null);
      setMessages([]);
    }
  }, [isOpen]);

  // Auto-select conversation when seller is specified
  useEffect(() => {
    if (isOpen && selectedSeller) {
      const conversationId = generateConversationId(currentUserId, selectedSeller.id);
      // Always select the conversation (will load messages if they exist)
      setSelectedConversation(conversationId);
    }
  }, [isOpen, selectedSeller, currentUserId]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messagesAPI.getConversations();
      setConversations(data.conversations || []);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error(error.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await messagesAPI.getConversationMessages(conversationId);
      setMessages(data.messages || []);
    } catch (error: any) {
      // If conversation doesn't exist yet (new conversation), just set empty messages
      console.log('No messages yet for this conversation:', conversationId);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Determine receiver ID
    let receiverId: string;
    if (selectedSeller) {
      receiverId = selectedSeller.id;
    } else {
      const currentConv = conversations.find(c => c.conversationId === selectedConversation);
      if (!currentConv) return;
      receiverId = currentConv.otherUser._id;
    }

    try {
      const messageData = {
        receiverId,
        content: newMessage.trim(),
        itemId: selectedItem?.id
      };

      await messagesAPI.sendMessage(messageData);
      setNewMessage("");

      // Generate conversation ID if not already set
      const convId = selectedConversation || generateConversationId(currentUserId, receiverId);
      
      // Refresh messages
      await fetchMessages(convId);
      
      // Set conversation if not already set
      if (!selectedConversation) {
        setSelectedConversation(convId);
      }

      // Refresh conversations list to show the new message
      await fetchConversations();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    }
  };

  // Get current conversation or create virtual one for new chats
  const currentConversation = selectedConversation
    ? conversations.find(c => c.conversationId === selectedConversation) ||
      (selectedSeller ? {
        conversationId: selectedConversation,
        otherUser: {
          _id: selectedSeller.id,
          name: selectedSeller.name,
          rating: selectedSeller.rating
        },
        item: selectedItem ? {
          _id: selectedItem.id,
          title: selectedItem.title,
          images: selectedItem.images
        } : undefined,
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0
      } : null)
    : null;

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
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
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No conversations yet</p>
                <p className="text-xs mt-2">Start a conversation by contacting a seller</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.conversationId}
                  onClick={() => setSelectedConversation(conversation.conversationId)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.conversationId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.otherUser.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conversation.lastMessageTime)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">
                          {conversation.otherUser.rating ? conversation.otherUser.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        {conversation.item && (
                          <Badge variant="outline" className="text-xs">
                            {conversation.item.title.substring(0, 20)}...
                          </Badge>
                        )}
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                    <AvatarFallback>{currentConversation.otherUser.name[0]}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="font-medium">{currentConversation.otherUser.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {currentConversation.otherUser.rating ? currentConversation.otherUser.rating.toFixed(1) : '0.0'}
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
              {currentConversation.item && (
                <div className="p-3 bg-gray-50 border-b">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        {currentConversation.item.images && currentConversation.item.images[0] && (
                          <img
                            src={currentConversation.item.images[0]}
                            alt={currentConversation.item.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{currentConversation.item.title}</h5>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="text-lg font-medium">Start the conversation</p>
                      <p className="text-sm mt-2">Send a message to {currentConversation.otherUser.name}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender._id === currentUserId ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === currentUserId
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === currentUserId
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}>
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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