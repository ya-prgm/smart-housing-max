import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch {
      setCopiedText(null);
      return false;
    }
  }, []);

  return { copiedText, copy, isCopied: copiedText !== null };
};
