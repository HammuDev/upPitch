'use strict';
import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('uppitch_api_key') || '');
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3.5 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0B0F1A] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto animate-modal-scale">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Google Gemini API Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-200">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Key className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>Direct Gemini AI Key</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Optional: Enter your Google Gemini API key if not set in server <code className="text-indigo-300 font-mono">.env.local</code>. Stored securely in your browser.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="cursor-text w-full rounded-lg border border-white/[0.08] bg-[#070A14] px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Get a free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3 py-1.5 font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-500 shadow-sm inline-flex items-center gap-1 transition-all"
            >
              {isSaved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
