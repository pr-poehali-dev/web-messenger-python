import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text?: string;
  sender: string;
  time: string;
  isOwn: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isGroup: boolean;
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Привет! Как дела?', sender: 'Алексей', time: '14:30', isOwn: false, type: 'text' },
    { id: '2', text: 'Отлично! А у тебя как?', sender: 'Вы', time: '14:32', isOwn: true, type: 'text' },
    { id: '3', type: 'image', fileUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', sender: 'Алексей', time: '14:34', isOwn: false },
    { id: '4', text: 'Тоже хорошо! Планы на выходные есть?', sender: 'Алексей', time: '14:35', isOwn: false, type: 'text' },
    { id: '5', text: 'Да, думаю в кино сходить', sender: 'Вы', time: '14:37', isOwn: true, type: 'text' },
    { id: '6', type: 'file', fileName: 'презентация.pdf', fileSize: '2.4 MB', sender: 'Вы', time: '14:38', isOwn: true },
  ]);

  const [chats] = useState<Chat[]>([
    { 
      id: '1', 
      name: 'Алексей Иванов', 
      avatar: 'АИ', 
      lastMessage: 'Да, думаю в кино сходить', 
      time: '14:37', 
      unread: 0, 
      isOnline: true,
      isGroup: false 
    },
    { 
      id: '2', 
      name: 'Команда разработки', 
      avatar: 'КР', 
      lastMessage: 'Встреча в 15:00', 
      time: '13:20', 
      unread: 3, 
      isOnline: false,
      isGroup: true 
    },
    { 
      id: '3', 
      name: 'Мария Петрова', 
      avatar: 'МП', 
      lastMessage: 'Спасибо за помощь!', 
      time: '12:45', 
      unread: 1, 
      isOnline: true,
      isGroup: false 
    },
    { 
      id: '4', 
      name: 'Дизайн команда', 
      avatar: 'ДК', 
      lastMessage: 'Новые макеты готовы', 
      time: '11:30', 
      unread: 0, 
      isOnline: false,
      isGroup: true 
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'Вы',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      const message: Message = {
        id: Date.now().toString(),
        type: 'image',
        fileUrl: imageUrl,
        sender: 'Вы',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        type: 'file',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        sender: 'Вы',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'image') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <img 
                src={message.fileUrl} 
                alt="Изображение" 
                className="max-w-[200px] max-h-[200px] rounded-lg object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <img 
              src={message.fileUrl} 
              alt="Изображение" 
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      );
    }
    
    if (message.type === 'file') {
      return (
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{message.fileName}</p>
            <p className="text-xs text-slate-500">{message.fileSize}</p>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="Download" size={16} />
          </Button>
        </div>
      );
    }
    
    return <p className="text-sm">{message.text}</p>;
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar with chats */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Messenger
            </h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Поиск..." 
              className="pl-10 rounded-full border-slate-200 focus:border-primary"
            />
          </div>
        </div>

        {/* Chats list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <Card 
                key={chat.id}
                className={`mb-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedChat === chat.id 
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className={`${chat.isGroup ? 'bg-accent' : 'bg-primary'} text-white`}>
                        <AvatarFallback className="text-white font-semibold">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && !chat.isGroup && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-slate-500">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <Badge className="bg-secondary text-white ml-2">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className={`${selectedChatData?.isGroup ? 'bg-accent' : 'bg-primary'} text-white`}>
                <AvatarFallback className="text-white font-semibold">
                  {selectedChatData?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-slate-900">{selectedChatData?.name}</h2>
                <p className="text-sm text-slate-500">
                  {selectedChatData?.isOnline ? 'В сети' : 'Был(а) недавно'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Video" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md rounded-2xl shadow-sm ${
                    message.type === 'image' 
                      ? 'p-1' 
                      : message.type === 'file'
                      ? 'p-2'
                      : 'px-4 py-2'
                  } ${
                    message.isOwn 
                      ? message.type === 'text'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-white border border-slate-200'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  {renderMessage(message)}
                  <p className={`text-xs mt-1 ${
                    message.isOwn && message.type === 'text' ? 'text-white/70' : 'text-slate-500'
                  } ${message.type !== 'text' ? 'px-2 pb-1' : ''}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="Paperclip" size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => imageInputRef.current?.click()}
              >
                <Icon name="Image" size={20} />
              </Button>
            </div>
            <div className="flex-1 relative">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="rounded-full border-slate-200 focus:border-primary pr-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                <Icon name="Smile" size={18} />
              </Button>
            </div>
            <Button 
              onClick={sendMessage}
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
              size="icon"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
          
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;