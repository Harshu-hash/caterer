import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const QuoteSelectionContext = createContext(null);

export function QuoteSelectionProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = useCallback((item) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.refId === item.refId);
      if (exists) return prev.filter((i) => i.refId !== item.refId);
      return [...prev, item];
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedItems([]), []);

  const value = useMemo(() => ({ selectedItems, toggleItem, clearSelection }), [selectedItems, toggleItem, clearSelection]);

  return <QuoteSelectionContext.Provider value={value}>{children}</QuoteSelectionContext.Provider>;
}

export function useQuoteSelection() {
  const ctx = useContext(QuoteSelectionContext);
  if (!ctx) throw new Error('useQuoteSelection must be used within QuoteSelectionProvider');
  return ctx;
}
