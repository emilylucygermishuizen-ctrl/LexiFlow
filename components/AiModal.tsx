
import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import type { ModalState } from '../types';

interface AiModalProps extends ModalState {
  onClose: () => void;
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, title, content, sources, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-base02/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1.0 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-base3 rounded-sm border-2 border-base01 p-6 shadow-[8px_8px_0px_#93a1a1] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-base02">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-sm text-base01 hover:bg-base2 hover:text-red">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="min-h-[200px] text-base02">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-10">
              <Loader2 className="w-10 h-10 text-blue animate-spin" />
              <p className="ml-4 text-lg font-semibold">Generating insights...</p>
            </div>
          ) : (
            <>
              <div className="prose prose-sm prose-p:text-base02 prose-strong:text-base02 prose-ul:text-base02 whitespace-pre-wrap">
                {content}
              </div>
              {sources && sources.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-base01 border-b border-base1 pb-1 mb-2">
                    Sources
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {sources.map((source, index) => (
                      <li key={index} className="text-xs">
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue hover:underline"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AiModal;
