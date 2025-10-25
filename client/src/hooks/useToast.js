import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications
 * @returns {Object} - { toast, showToast, hideToast }
 *
 * @example
 * const { toast, showToast, hideToast } = useToast();
 *
 * // Show success toast
 * showToast('Saved successfully!', 'success');
 *
 * // Show error toast
 * showToast('Failed to save', 'error');
 *
 * // Render toast
 * {toast && <Toast {...toast} onClose={hideToast} />}
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      setToast({ message, type, duration });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}

export default useToast;
