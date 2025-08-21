import React, { useState, useEffect, useRef } from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Drawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'md'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const heightClasses = {
    sm: 'h-1/4',
    md: 'h-1/2',
    lg: 'h-3/4',
    xl: 'h-5/6',
    full: 'h-full'
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Trigger animation after component mounts
      setTimeout(() => {
        setIsAnimating(false);
      }, 10);
    } else {
      setIsAnimating(true);
      document.body.style.overflow = '';
      
      // Hide component after animation completes
      setTimeout(() => {
        if (!isOpen) {
          setIsVisible(false);
          setIsAnimating(false);
        }
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Handle touch gestures for mobile
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY) return;
    
    const currentY = e.touches[0].clientY;
    setCurrentY(currentY);
    
    const diff = currentY - startY;
    
    if (diff > 0 && drawerRef.current) {
      drawerRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!startY || !currentY) return;
    
    const diff = currentY - startY;
    
    if (drawerRef.current) {
      drawerRef.current.style.transform = '';
    }
    
    // Close drawer if swiped down more than 100px
    if (diff > 100) {
      onClose();
    }
    
    setStartY(null);
    setCurrentY(null);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ease-out ${
        isAnimating ? 'bg-black/0' : 'bg-black/50'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      <div
        ref={drawerRef}
        className={`w-full bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out transform ${
          heightClasses[height]
        } ${
          isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
     

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close drawer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-3 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};