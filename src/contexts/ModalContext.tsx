'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ModalContextType {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const openTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isTransactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
