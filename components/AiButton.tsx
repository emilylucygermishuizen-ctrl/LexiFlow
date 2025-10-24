
import React from 'react';
import { motion } from 'framer-motion';
import { WandSparkles } from 'lucide-react';

interface AiButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const AiButton: React.FC<AiButtonProps> = ({ text, onClick, className = '' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, boxShadow: "3px 3px 0px #b58900" }}
    whileTap={{ scale: 0.95, boxShadow: "1px 1px 0px #93a1a1" }}
    className={`flex items-center gap-1.5 text-xs font-bold text-yellow bg-base3 border-2 border-base1 px-2 py-1 rounded-sm shadow-[2px_2px_0px_#93a1a1] transition-all ${className}`}
  >
    <WandSparkles className="w-3.5 h-3.5" />
    {text}
  </motion.button>
);

export default AiButton;
