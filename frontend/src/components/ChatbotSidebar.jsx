import { CloseOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import travelApi from '../services/travelApi';

const heroImageUrl = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80';

function ChatbotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState([
    {
      role: 'assistant',
      content: 'Hi! Ask me about flights, trains, buses or hotels and I will guide you.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = message.trim();
    if (!question || isLoading) {
      return;
    }
    setMessage('');
    setError('');

    setThread((prev) => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const answer = await travelApi.askChatbot(question);
      setThread((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer || 'Sorry, I could not generate a reply right now.'
        }
      ]);
    } catch (apiError) {
      const fallback = apiError?.response?.data?.message || 'Chatbot is temporarily unavailable.';
      setError(fallback);
      setThread((prev) => [...prev, { role: 'assistant', content: 'Something went wrong fetching an answer.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-black/50 transition hover:scale-105 hover:bg-gray-200"
        aria-label="Open travel assistant"
      >
        <MessageOutlined className="text-xl" />
      </button>
    );
  }

  return (
    <aside className="fixed bottom-6 right-6 z-40 w-96 max-w-[90vw] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white shadow-2xl shadow-black/50 backdrop-blur">
      <div className="relative h-36 overflow-hidden">
        <img src={heroImageUrl} alt="Travel assistant" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/85 via-slate-900/70 to-transparent" />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-200"
          aria-label="Close travel assistant"
        >
          <CloseOutlined className="text-xs" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between gap-3 text-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Apna Plan Assistant</p>
            <h3 className="text-xl font-semibold leading-tight">Need help planning?</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <span className="relative inline-flex h-2 w-2 overflow-hidden rounded-full bg-emerald-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm text-gray-200">
          Ask anything about flights, trains, buses or hotels and we will guide you through the next steps.
        </p>

        <div className="h-56 overflow-auto rounded-2xl border border-white/15 bg-white/5 px-3 py-3 shadow-inner">
          {thread.map((entry, index) => (
            <div key={`${entry.role}-${index}`} className={`mb-3 flex ${entry.role === 'assistant' ? '' : 'justify-end'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow ${
                  entry.role === 'assistant'
                    ? 'bg-white/10 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {entry.content}
              </div>
            </div>
          ))}
          {isLoading && <p className="text-xs text-white/70">Thinking…</p>}
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <div className="flex flex-wrap gap-2">
          {['Track flight', 'Find trains', 'Bus offers', 'Hotel deals', 'Reschedule trip', 'Baggage rules'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setMessage(suggestion)}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white transition hover:border-white hover:bg-white/15"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="chatbot-question" className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
            Your question
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-white/30">
            <MessageOutlined className="text-white/60" />
            <input
              id="chatbot-question"
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about your journey..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
              <SendOutlined className="text-[10px]" />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}

export default ChatbotSidebar;
