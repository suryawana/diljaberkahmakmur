import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ── WhatsApp SVG Icon ── */
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.05 9.38L1.054 31.29l6.12-1.96A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.614c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.824-6.8-8.064-7.114-.23-.314-1.934-2.574-1.934-4.91 0-2.334 1.224-3.48 1.658-3.956.39-.432 1.026-.64 1.636-.64.198 0 .374.01.534.018.432.018.648.042.934.724.354.85 1.218 2.97 1.324 3.184.108.216.216.498.072.788-.134.298-.252.43-.468.674-.216.244-.422.432-.638.694-.198.232-.42.48-.174.912.244.432 1.088 1.794 2.336 2.908 1.606 1.434 2.9 1.898 3.37 2.098.354.15.776.114 1.032-.15.324-.336.724-.892 1.132-1.442.29-.39.656-.442 1.046-.298.394.134 2.506 1.182 2.936 1.396.432.216.718.324.824.504.108.18.108 1.04-.28 2.142z" />
    </svg>
);

/* ── Chatbot Icon ── */
const ChatbotIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 2a7 7 0 0 1 7 7v1a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7z" />
        <circle cx="9.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
        <path d="M8 17v1a4 4 0 0 0 8 0v-1" />
        <path d="M5 9H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2" />
        <path d="M19 9h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2" />
    </svg>
);

/* ── Send Icon ── */
const SendIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

/* ── Types ── */
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface FloatingButtonsProps {
    phoneNumber?: string;
    message?: string;
    companyName?: string;
}

/* ── Quick reply suggestions ── */
const QUICK_REPLIES = [
    'Produk apa saja yang tersedia?',
    'Bagaimana cara pemesanan?',
    'Apakah tersedia di e-Katalog?',
];

/* ── Message formatting: convert simple Markdown-like syntax to HTML ── */
const escapeHtml = (str: string) =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const formatMessage = (text: string) => {
    if (!text) return '';
    // Escape to prevent injection
    let out = escapeHtml(text);

    // Bold: **bold** -> <strong>bold</strong>
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *italic* -> <em>italic</em>
    out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Strikethrough: ~~strike~~ -> <del>strike</del>
    out = out.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Convert newlines to <br>
    out = out.replace(/\r\n|\r|\n/g, '<br/>');

    return out;
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
const FloatingButtons: React.FC<FloatingButtonsProps> = ({
    phoneNumber,
    message = 'Halo, saya tertarik dengan produk Anda',
    companyName = 'Customer Service',
}) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const whatsappUrl = phoneNumber
        ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        : '#';

    /* Auto-scroll to bottom */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    /* Welcome message */
    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    text: `Halo! 👋 Selamat datang di ${companyName}. Ada yang bisa kami bantu?\n\nAnda bisa bertanya langsung tentang produk, pemesanan, atau informasi lainnya.`,
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isChatOpen, messages.length, companyName]);

    /* Focus input when chat opens */
    useEffect(() => {
        if (isChatOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isChatOpen]);

    /* Call backend API (Gemini) */
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim()) return;

            const userMsg: Message = {
                id: `user-${Date.now()}`,
                text: text.trim(),
                sender: 'user',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
            setInputValue('');
            setIsTyping(true);

            try {
                // Build history from recent messages (exclude welcome)
                const history = [...messages, userMsg]
                    .filter((m) => m.id !== 'welcome')
                    .slice(-10)
                    .map((m) => ({
                        text: m.text,
                        sender: m.sender,
                    }));

                // Get CSRF token
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') ?? '';

                const res = await fetch('/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        message: text.trim(),
                        history,
                    }),
                });

                const data = await res.json();

                const botMsg: Message = {
                    id: `bot-${Date.now()}`,
                    text:
                        data.reply ??
                        'Maaf, terjadi gangguan. Silakan coba lagi.',
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMsg]);
            } catch {
                const errorMsg: Message = {
                    id: `bot-err-${Date.now()}`,
                    text: 'Maaf, terjadi gangguan koneksi. Silakan coba lagi atau hubungi kami via WhatsApp. 🙏',
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMsg]);
            } finally {
                setIsTyping(false);
            }
        },
        [messages],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <>
            {/* ── Chatbot Window ── */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="fixed right-6 bottom-36 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 max-sm:right-3 max-sm:bottom-32 max-sm:h-[420px] max-sm:w-[calc(100vw-24px)]"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <ChatbotIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white">
                                    {companyName}
                                </p>
                                <p className="flex items-center gap-1.5 text-xs text-blue-100">
                                    <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                                    Online • AI Assistant
                                </p>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                            msg.sender === 'user'
                                                ? 'rounded-br-md bg-blue-600 text-white'
                                                : 'rounded-bl-md bg-white text-gray-700 shadow-sm ring-1 ring-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: formatMessage(msg.text),
                                        }}
                                    />
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies (shown only at start) */}
                        {messages.length <= 1 && (
                            <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-white px-4 py-2.5">
                                {QUICK_REPLIES.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q)}
                                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ketik pesan..."
                                disabled={isTyping}
                                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 transition-colors outline-none placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
                            >
                                <SendIcon className="h-4 w-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Floating Buttons Container ── */}
            <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center gap-3 max-sm:right-3">
                {/* Chatbot Button */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 2.2,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-shadow hover:shadow-xl hover:shadow-blue-500/40"
                        aria-label="Buka chatbot"
                    >
                        <AnimatePresence mode="wait">
                            {isChatOpen ? (
                                <motion.svg
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </motion.svg>
                            ) : (
                                <motion.div
                                    key="icon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                >
                                    <ChatbotIcon className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </motion.div>

                {/* WhatsApp Button */}
                <motion.div
                    className="relative"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 2,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Ping animation */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 rounded-full bg-green-500"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 0, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat via WhatsApp"
                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition-shadow hover:shadow-xl hover:shadow-green-500/40"
                    >
                        <WhatsAppIcon className="h-7 w-7" />
                    </a>
                </motion.div>
            </div>
        </>
    );
};

export default FloatingButtons;
