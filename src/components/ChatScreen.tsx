import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { generateAvatarResponse } from '../utils/avatarAlgorithm';
import { generateGeminiAvatarResponse } from '../utils/gemini';
import { Icon } from './icons';
import { storage } from '../utils/storage';

interface ChatScreenProps {
  user: User;
}

export function ChatScreen({ user }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const language = user.settings.language;
  const avatar = user.avatar;

  useEffect(() => {
    // Load existing messages
    const savedMessages = storage.getChatMessages();
    setMessages(savedMessages);

    // Add welcome message if no messages exist
    if (savedMessages.length === 0 && avatar) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'avatar',
        content: language === 'rus' 
          ? `Привет! Я ${avatar.name}. Я здесь, чтобы выслушать и поддержать тебя. Как дела?`
          : `Hello! I'm ${avatar.name}. I'm here to listen and support you. How are you doing?`,
        timestamp: new Date(),
        avatarType: avatar.type
      };
      setMessages([welcomeMessage]);
      storage.addChatMessage(welcomeMessage);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !avatar) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    storage.addChatMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = updatedMessages.slice(-8);
      const avatarResponse = await generateGeminiAvatarResponse({
        avatar,
        language,
        history
      });

      const avatarMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'avatar',
        content: avatarResponse,
        timestamp: new Date(),
        avatarType: avatar.type
      };

      setMessages(prev => [...prev, avatarMessage]);
      storage.addChatMessage(avatarMessage);
    } catch {
      const fallbackResponse = generateAvatarResponse(avatar.type, userMessage.content, language);
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'avatar',
        content: fallbackResponse,
        timestamp: new Date(),
        avatarType: avatar.type
      };

      setMessages(prev => [...prev, fallbackMessage]);
      storage.addChatMessage(fallbackMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const text = {
    en: {
      placeholder: 'Share your thoughts...',
      send: 'Send',
      typing: `${avatar?.name} is typing...`
    },
    rus: {
      placeholder: 'Поделитесь своими мыслями...',
      send: 'Отправить',
      typing: `${avatar?.name} печатает...`
    }
  };

  const t = text[language];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.type === 'user'
                ? 'bg-black text-contrast'
                : 'surface-card text-black'
            }`}>
              {message.type === 'avatar' && avatar && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-black/10 overflow-hidden flex items-center justify-center">
                    {avatar.image ? (
                      <img src={avatar.image} alt={avatar.name} className="h-full w-full object-cover" />
                    ) : (
                      <Icon name="user" className="h-4 w-4" />
                    )}
                  </div>
                  <span className="font-medium text-sm">{avatar.name}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-contrast/70' : 'text-black/50'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString(language === 'rus' ? 'ru-RU' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="surface-card rounded-2xl px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-black/10 overflow-hidden flex items-center justify-center">
                  {avatar?.image ? (
                    <img src={avatar.image} alt={avatar.name} className="h-full w-full object-cover" />
                  ) : (
                    <Icon name="user" className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium text-sm">{avatar?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="surface-card rounded-2xl p-4">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className="flex-1 resize-none bg-transparent outline-none text-black placeholder-black/40 min-h-[20px] max-h-20"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="btn-primary px-4 py-2 text-sm"
          >
            {t.send}
          </button>
        </div>
      </div>
    </div>
  );
}
