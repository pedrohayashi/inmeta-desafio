import { create } from "zustand";

interface WorkOrderStore {
  lastSync: string;
  setLastSync: (date: string) => void;
}

export const useWorkOrderStore = create<WorkOrderStore>((set) => ({
  lastSync: "",
  setLastSync: (date) => set({ lastSync: date }),
}));