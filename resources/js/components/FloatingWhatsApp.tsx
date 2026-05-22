// resources/js/Components/FloatingWhatsApp.tsx
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingWhatsAppProps {
    phoneNumber: string;
    message: string;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
    phoneNumber,
    message,
}) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message,
    )}`;

    return (
        <motion.div
            className="fixed right-6 bottom-6 z-50"
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
            {/* Ping Animation */}
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-full bg-green-500"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* WhatsApp Button */}
            <Button
                size="icon"
                className="relative z-10 h-14 w-14 rounded-full bg-green-500 shadow-lg hover:bg-green-600"
                asChild
            >
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat via WhatsApp"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </a>
            </Button>
        </motion.div>
    );
};

export default FloatingWhatsApp;
