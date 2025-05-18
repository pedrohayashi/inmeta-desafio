export type ImmerSet<State> = (fn: (state: State) => void) => void;

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  completed: boolean;
  deleted: boolean;
  synced?: { type: "bool"; default: true };
};

export type WorkOrderState = {
  state: {
    workOrders: WorkOrder[];
    lastSyncedAt: null | string;
    pendingQueue: WorkOrder[];
  };
};

export type WorkOrderActions = {
  actions: {
    loadWorkOrders: () => Promise<void>;
    addWorkOrder: (order: WorkOrder, syncLater?: boolean) => Promise<void>;
    updateWorkOrder: (order: WorkOrder, syncLater?: boolean) => Promise<void>;
    clearSyncedFromQueue: (ids: string[]) => void;
    setLastSyncedAt: (date: string) => Promise<void>;
    loadLastSyncedAt: () => Promise<void>;
    loadPendingQueue: () => Promise<void>;
  };
};
