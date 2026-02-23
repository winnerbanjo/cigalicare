import { ReactNode } from 'react';
import { Portal } from '@/components/Portal';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] isolate flex items-center justify-center bg-black/50 p-4 backdrop-blur-[20px]">
        <div className="glass-luxury w-full max-w-2xl animate-fadeUp p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/20 pb-4">
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            <Button variant="ghost" onClick={onClose} className="h-9 px-3">
              Close
            </Button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
};
