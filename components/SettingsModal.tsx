'use client';
import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = React.memo(({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('uppitch_api_key') || '');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('uppitch_api_key', apiKey.trim());
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 shadow-2xl shadow-indigo-500/10 space-y-4 max-h-[95vh] overflow-y-auto animate-modal-scale"
      >
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
            <h3 id="settings-modal-title" className="text-sm font-bold text-slate-900">Google Gemini API Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-900">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Key className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Direct Gemini AI Key</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Optional: Enter your Google Gemini API key if not set in server <code className="text-indigo-700 font-mono font-semibold">.env.local</code>. Stored in your browser (localStorage) and sent to our server with each request to call Gemini. Use a key you can rotate.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="cursor-text w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Get a free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">Google AI Studio</a>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-700 shadow-sm inline-flex items-center gap-1 transition-all"
            >
              {isSaved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});

SettingsModal.displayName = 'SettingsModal';
