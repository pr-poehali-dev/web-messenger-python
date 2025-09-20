import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  isOwn: boolean;
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
    { id: '1', text: 'Привет! Как дела?', sender: 'Алексей', time: '14:30', isOwn: false },
    { id: '2', text: 'Отлично! А у тебя как?', sender: 'Вы', time: '14:32', isOwn: true },
    { id: '3', text: 'Тоже хорошо! Планы на выходные есть?', sender: 'Алексей', time: '14:35', isOwn: false },
    { id: '4', text: 'Да, думаю в кино сходить', sender: 'Вы', time: '14:37', isOwn: true },
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'Вы',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
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
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                      : 'bg-white border border-slate-200 text-slate-900'
                  } shadow-sm`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-white/70' : 'text-slate-500'
                  }`}>
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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Paperclip" size={20} />
            </Button>
            <div className="flex-1 relative">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="rounded-full border-slate-200 focus:border-primary pr-12"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
        </div>
      </div>
    </div>
  );
};

export default Index;