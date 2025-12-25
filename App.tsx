
import React, { useState, useRef, useEffect } from 'react';
import { Role, Message, AppState } from './types';
import { GeminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';

const SOURCES_LIST = [
  { title: "Lung.org - Pertussis", url: "https://www.lung.org/lung-health-diseases/lung-disease-lookup/pertussis" },
  { title: "כללית - שעלת", url: "https://www.clalit.co.il/he/your_health/family/Pages/whooping_cough.aspx" },
  { title: "Wikipedia - Whooping Cough", url: "https://en.wikipedia.org/wiki/Whooping_cough" },
  { title: "CDC - About Pertussis", url: "https://www.cdc.gov/pertussis/about/index.html" },
  { title: "MedlinePlus - Whooping Cough", url: "https://medlineplus.gov/whoopingcough.html" },
  { title: "CDC HCP - Clinical Overview", url: "https://www.cdc.gov/pertussis/hcp/clinical-overview/index.html?utm_source=chatgpt.com" },
  { title: "WHO - Pertussis", url: "https://www.who.int/health-topics/pertussis?utm_source=chatgpt.com#tab=tab_1" },
  { title: "PAHO - Pertussis", url: "https://www.paho.org/en/topics/pertussis?utm_source=chatgpt.com" },
  { title: "NHS - Whooping Cough", url: "https://www.nhs.uk/conditions/whooping-cough" },
  { title: "Hopkins Medicine - Pertussis in Children", url: "https://www.hopkinsmedicine.org/health/conditions-and-diseases/pertussis-in-children?" },
  { title: "PMC - Evolution & Epidemiology", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4205565/" },
  { title: "משרד הבריאות - שעלת", url: "https://www.gov.il/he/pages/disease-pertussis" },
  { title: "משרד הבריאות - חיסון שעלת", url: "https://me.health.gov.il/en/parenting/raising-children/immunization-schedule/vaccines-up-to-age-six/mehumash/pertussis" },
  { title: "שיבא ילדים - שעלת", url: "https://yeladim.sheba.co.il/%D7%A9%D7%A2%D7%9C%D7%AA" },
  { title: "מרכז שניידר - שעלת", url: "https://www.schneider.org.il/?ArticleID=3414&CategoryID=856&" },
  { title: "PMC - Vaccine Effectiveness", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10600895/" }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [
      {
        id: '1',
        role: Role.MODEL,
        text: 'שלום! אני המורה הפרטי שלך לביולוגיה. אני כאן כדי לעזור לך להבין טוב יותר את נושא השעלת (Whooping Cough) על בסיס מקורות מדעיים מהימנים. איך אוכל לעזור היום?',
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiServiceRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    geminiServiceRef.current = new GeminiService();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      timestamp: new Date(),
    };

    const currentHistory = [...state.messages, userMessage];

    setState(prev => ({
      ...prev,
      messages: currentHistory,
      isLoading: true,
      error: null,
    }));
    setInput('');

    try {
      if (!geminiServiceRef.current) throw new Error("Service not initialized");

      const response = await geminiServiceRef.current.generateResponse(
        input,
        state.messages
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        sources: response.sources,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "משהו השתבש. נסה שוב.",
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto bg-gray-50 md:flex-row shadow-2xl overflow-hidden">
      {/* Sidebar - Positioned on the right in RTL */}
      <aside className="w-full md:w-80 bg-indigo-900 text-white p-6 flex flex-col h-auto md:h-full shrink-0 border-l border-indigo-800">
        <div className="mb-6 text-center md:text-right">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-1">מורה לביולוגיה</h1>
          <p className="text-indigo-200 text-xs font-medium">מאגר ידע מקיף על מחלת השעלת</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          <div className="p-4 bg-indigo-800/50 border border-indigo-700 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">נושא המיקוד</h4>
            <p className="text-sm">לימוד והבנה של מחלת השעלת על בסיס מקורות אקדמיים ורפואיים בינלאומיים.</p>
          </div>

          <div className="p-4 bg-indigo-800/50 border border-indigo-700 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-300 mb-3 uppercase tracking-wider">כל מקורות המידע (16)</h4>
            <div className="flex flex-col gap-2">
              {SOURCES_LIST.map((source, index) => (
                <a 
                  key={index}
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] py-2 px-3 bg-indigo-900/40 hover:bg-indigo-700 rounded-lg transition-colors border border-indigo-700/50 flex items-center gap-2 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-indigo-800">
          <p className="text-[10px] text-indigo-400 text-center leading-tight">
            התשובות מבוססות אך ורק על המקורות המצוינים לעיל.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 bg-slate-50/30">
          {state.messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {state.isLoading && (
            <div className="flex justify-end mb-6">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                <div className="flex space-x-1 space-x-reverse">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-400 font-medium">סורק מקורות...</span>
              </div>
            </div>
          )}
          {state.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center mb-4 border border-red-100">
              {state.error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="שאל אותי על מחלת השעלת..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg"
              disabled={state.isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || state.isLoading}
              className={`absolute left-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl transition-all flex items-center justify-center ${
                !input.trim() || state.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-95 shadow-md'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
