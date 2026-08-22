import { useState, useEffect, useCallback } from 'react';
import { Machine, MachineStatus } from '../types/machine';
import { getMachineById, subscribeToMachine, updateMachineStatus } from '../services/machineApi';

interface UseMachineResult {
  machine: Machine | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateStatus: (status: MachineStatus) => Promise<void>;
  isRealTime: boolean;
}

export function useMachine(machineId: string | null | undefined): UseMachineResult {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRealTime, setIsRealTime] = useState<boolean>(false);

  const fetchMachineData = useCallback(async () => {
    if (!machineId) {
      setMachine(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getMachineById(machineId);
      setMachine(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to load machine ${machineId}`));
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    if (!machineId) {
      setMachine(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const unsubscribe = subscribeToMachine(
      machineId,
      (updatedMachine) => {
        if (isMounted) {
          setMachine(updatedMachine);
          setLoading(false);
          setError(null);
          setIsRealTime(true);
        }
      },
      (err) => {
        if (isMounted) {
          console.warn(`[useMachine] Subscription note for ${machineId}:`, err);
          setIsRealTime(false);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [machineId]);

  const handleUpdateStatus = useCallback(
    async (status: MachineStatus) => {
      if (!machineId) return;
      try {
        await updateMachineStatus(machineId, status);
        // Optimistic local update
        setMachine((prev) => (prev ? { ...prev, status } : null));
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    },
    [machineId]
  );

  return {
    machine,
    loading,
    error,
    refetch: fetchMachineData,
    updateStatus: handleUpdateStatus,
    isRealTime
  };
}
