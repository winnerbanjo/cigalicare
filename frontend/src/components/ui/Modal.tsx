import { ReactNode } from 'react';
import { Portal } from '@/components/Portal';
import { Button } from './Button';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  maxWidthClassName?: string;
}

export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  bodyClassName,
  maxWidthClassName = 'max-w-3xl'
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] isolate flex items-center justify-center bg-black/50 p-4 backdrop-blur-[20px]">
        <div className={cn('glass-luxury w-full animate-fadeUp overflow-hidden', maxWidthClassName)}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/90 px-6 py-4 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            <Button variant="ghost" onClick={onClose} className="h-9 px-3">
              Close
            </Button>
          </div>

          <div className={cn('max-h-[90vh] overflow-x-hidden overflow-y-auto px-6 pb-8 pt-6', bodyClassName)}>{children}</div>

          {footer ? (
            <div className="sticky bottom-0 z-10 border-t border-white/20 bg-white/92 px-6 py-4 backdrop-blur-xl">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </Portal>
  );
};
