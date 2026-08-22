import { useState, useEffect, useCallback } from 'react';
import { Machine } from '../types/machine';
import { getMachines, subscribeToMachines } from '../services/machineApi';

interface UseMachinesResult {
  machines: Machine[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRealTime: boolean;
}

export function useMachines(): UseMachinesResult {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRealTime, setIsRealTime] = useState<boolean>(false);

  const fetchMachinesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMachines();
      setMachines(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch machines'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Set up real-time listener
    const unsubscribe = subscribeToMachines(
      (updatedMachines) => {
        if (isMounted) {
          setMachines(updatedMachines);
          setLoading(false);
          setError(null);
          setIsRealTime(true);
        }
      },
      (err) => {
        if (isMounted) {
          console.warn('[useMachines] Subscription note:', err);
          setIsRealTime(false);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    machines,
    loading,
    error,
    refetch: fetchMachinesData,
    isRealTime
  };
}
