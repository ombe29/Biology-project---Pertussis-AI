
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-2 text-xs opacity-75">
          <span className="font-bold">{isUser ? 'אתה' : 'מוח AI'}</span>
          <span>•</span>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
          {message.text}
        </p>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 mb-2">מקורות:</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-indigo-600 px-2 py-1 rounded transition-colors max-w-[150px] truncate"
                  dir="ltr"
                >
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
