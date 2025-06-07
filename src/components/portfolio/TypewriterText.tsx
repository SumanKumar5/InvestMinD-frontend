import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  isLoading?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  onComplete,
  isLoading = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const typeNextCharacter = useCallback(() => {
    if (currentIndex < text.length) {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [currentIndex, text, onComplete]);

  useEffect(() => {
    if (!text || skipAnimation) return;

    if (currentIndex < text.length && !isLoading) {
      setIsTyping(true);
      const timeout = setTimeout(typeNextCharacter, 30); // Typing speed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, typeNextCharacter, isLoading, skipAnimation]);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsTyping(false);
      onComplete?.();
    }
  }, [skipAnimation, text, onComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        <span>Generating insight...</span>
      </div>
    );
  }

  // Inject blinking cursor directly into the string
  const renderedText = isTyping ? displayedText + '▍' : displayedText;

  return (
    <div className="relative">
      {!skipAnimation && isTyping && (
        <div className="absolute -top-8 right-0">
          <button
            onClick={() => setSkipAnimation(true)}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-md transition-colors"
          >
            Skip
          </button>
        </div>
      )}

      <div className="prose prose-invert max-w-none mt-8">
        <ReactMarkdown>{renderedText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TypewriterText;
