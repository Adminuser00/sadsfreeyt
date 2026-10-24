import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Volume2,
  ListMusic,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import { VideoTrack, AiSummaryData } from '../types';

interface GeminiAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: VideoTrack;
  initialTab?: 'summary' | 'dj' | 'chat';
  onPlaySuggestedTrack?: (title: string, artist: string) => void;
}

export const GeminiAIModal: React.FC<GeminiAIModalProps> = ({
  isOpen,
  onClose,
  track,
  initialTab = 'summary',
  onPlaySuggestedTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'dj' | 'chat'>(initialTab);
  const [summaryData, setSummaryData] = useState<AiSummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Smart DJ state
  const [djPrompt, setDjPrompt] = useState('Late night monsoon coding lo-fi with soothing acoustic guitar');
  const [djResults, setDjResults] = useState<any>(null);
  const [isGeneratingDj, setIsGeneratingDj] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: `Namaste! Main YouTube Gold ka VIP AI Assistant hoon. Current track "${track.title}" ke baare mein koi sawal ya recommendations chahiye?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // TTS audio state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch summary when modal opens
  useEffect(() => {
    if (isOpen && !summaryData) {
      loadSummary();
    }
  }, [isOpen, track.id]);

  const loadSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: track.title,
          channel: track.channel,
          description: track.description,
          videoId: track.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      }
    } catch (e) {
      console.warn('Summary fetch failed:', e);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateDj = async () => {
    if (!djPrompt.trim()) return;
    setIsGeneratingDj(true);
    try {
      const res = await fetch('/api/gemini/smart-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodPrompt: djPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setDjResults(data);
      }
    } catch (e) {
      console.warn('Smart DJ failed:', e);
    } finally {
      setIsGeneratingDj(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          videoContext: { title: track.title, channel: track.channel },
          history: chatMessages.slice(-4),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Auto-Skip Ad Shield active. Streaming in crystal gold audio!' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Play TTS voice note
  const handlePlayVoice = async (textToSpeak: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voice: 'Kore' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          await audio.play();
        } else {
          setIsSpeaking(false);
        }
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.warn('TTS error:', e);
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#12141a] border border-amber-500/30 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-[#171922] to-[#12141a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>YouTube Gold Gemini Intelligence</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950">
                  VIP
                </span>
              </h3>
              <p className="text-xs text-neutral-400 truncate max-w-md">
                Analyzing: <span className="text-amber-300 font-medium">{track.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 border-b border-neutral-800 bg-[#151720]">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            AI Summary & Moments
          </button>
          <button
            onClick={() => setActiveTab('dj')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'dj'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Smart DJ Mixtape
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            VIP Concierge Chat
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {isSummarizing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs text-neutral-300">
                    Gemini 3.8 Flash is analyzing audio structure & timestamps...
                  </p>
                </div>
              ) : summaryData ? (
                <>
                  {/* Executive Summary Card */}
                  <div className="p-4 rounded-xl bg-neutral-900/80 border border-amber-500/20 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Executive Gold Summary
                      </span>
                      <button
                        onClick={() => handlePlayVoice(summaryData.summary)}
                        disabled={isSpeaking}
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition border border-amber-500/30"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isSpeaking ? 'Speaking...' : 'Listen Voice'}</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                      {summaryData.summary}
                    </p>

                    {/* Vibe Tags */}
                    {summaryData.vibeTags && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-800">
                        {summaryData.vibeTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-400/15 text-amber-300 border border-amber-400/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chapters & Highlights */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Key Moments & Chapters
                    </h4>
                    <div className="space-y-1.5">
                      {summaryData.chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800 text-xs hover:border-amber-500/30 transition"
                        >
                          <span className="font-semibold text-neutral-200">{ch.title}</span>
                          <span className="font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10">
                            {ch.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gold Trivia Fact */}
                  {summaryData.goldFact && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                      <span className="font-bold text-amber-300">💡 Gold Studio Trivia: </span>
                      <span>{summaryData.goldFact}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={loadSummary}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                  >
                    Generate AI Breakdown
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SMART DJ */}
          {activeTab === 'dj' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-neutral-900 to-[#171a22] border border-amber-500/20">
                <label className="text-xs font-bold text-amber-300 block mb-1.5">
                  Describe Your Desired Vibe or Mood:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={djPrompt}
                    onChange={(e) => setDjPrompt(e.target.value)}
                    placeholder="e.g. Chill monsoon drive acoustic Bollywood with lo-fi beats..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleGenerateDj}
                    disabled={isGeneratingDj}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    {isGeneratingDj ? (
                      <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Mix Now</span>
                  </button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[
                    'Late Night Coding',
                    'Soulful Bollywood Acoustic',
                    'Retro 80s Synthwave',
                    'Deep Focus Meditation',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDjPrompt(p);
                        setTimeout(handleGenerateDj, 100);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* DJ Results */}
              {djResults && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      {djResults.playlistTitle}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {djResults.playlistDescription}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {djResults.tracks?.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs hover:border-amber-500/30 transition"
                      >
                        <div>
                          <p className="font-semibold text-white">{t.title}</p>
                          <p className="text-[11px] text-neutral-400">
                            {t.artist} • <span className="text-amber-400">{t.genre}</span>
                          </p>
                        </div>

                        {onPlaySuggestedTrack && (
                          <button
                            onClick={() => {
                              onPlaySuggestedTrack(t.title, t.artist);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-neutral-950 text-xs font-semibold transition"
                          >
                            Play
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIP CHAT CONCIERGE */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[340px]">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-500 text-neutral-950 font-medium'
                          : 'bg-neutral-900 text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <span>Gemini is composing...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2 mt-3 pt-3 border-t border-neutral-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about this track, lyrics, or recommend similar vibes..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
