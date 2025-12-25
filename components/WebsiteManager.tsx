
import React, { useState } from 'react';

interface WebsiteManagerProps {
  websites: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}

const WebsiteManager: React.FC<WebsiteManagerProps> = ({ websites, onAdd, onRemove }) => {
  const [newUrl, setNewUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      onAdd(newUrl.trim());
      setNewUrl('');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Language" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        אתרי בסיס לידע
      </h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="הוסף כתובת אתר (URL)..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
          dir="ltr"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          הוסף אתר
        </button>
      </form>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {websites.length === 0 ? (
          <p className="text-sm text-gray-400 italic">טרם הוספו אתרים. ה-AI ישתמש בידע כללי.</p>
        ) : (
          websites.map((url, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg group">
              <span className="text-sm text-gray-600 truncate max-w-[200px]" dir="ltr">{url}</span>
              <button
                onClick={() => onRemove(idx)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="הסר אתר"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebsiteManager;
