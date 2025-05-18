import { UpdateMode } from "realm";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getRealm } from "../db/realm";
import { createSelectors } from "./selectors";
import { ImmerSet, WorkOrder, WorkOrderActions, WorkOrderState } from "./types";

const initialState: WorkOrderState = {
  state: {
    workOrders: [],
    pendingQueue: [],
    lastSyncedAt: null,
  },
};

const loadWorkOrders = async (set: ImmerSet<WorkOrderState>) => {
  const realm = await getRealm();
  const orders = realm
    .objects<WorkOrder>("WorkOrder")
    .filtered("deleted == false");
  set(({ state }) => {
    state.workOrders = Array.from(orders);
  });
};

const addWorkOrder = async (
  set: ImmerSet<WorkOrderState>,
  order: WorkOrder,
  syncLater: boolean = true,
) => {
  const realm = await getRealm();
  realm.write(() => {
    realm.create("WorkOrder", {
      ...order,
      synced: false,
    });
  });

  if (syncLater) {
    set(({ state }) => {
      state.pendingQueue.push(order);
    });
  }

  await loadWorkOrders(set);
};

const updateWorkOrder = async (
  set: ImmerSet<WorkOrderState>,
  order: WorkOrder,
  syncLater: boolean = true,
) => {
  const realm = await getRealm();
  realm.write(() => {
    realm.create("WorkOrder", { ...order, synced: false }, UpdateMode.Modified);
  });

  if (syncLater) {
    set(({ state }) => {
      const index = state.pendingQueue.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        state.pendingQueue[index] = order;
      } else {
        state.pendingQueue.push(order);
      }
    });
  }

  await loadWorkOrders(set);
};

const clearSyncedFromQueue = (set: ImmerSet<WorkOrderState>, ids: string[]) => {
  set(({ state }) => {
    state.pendingQueue = state.pendingQueue.filter(
      (item) => !ids.includes(item.id),
    );
  });
};

const setLastSyncedAt = async (set: ImmerSet<WorkOrderState>, date: string) => {
  const realm = await getRealm();
  realm.write(() => {
    realm.create(
      "Metadata",
      { key: "lastSyncedAt", value: date },
      UpdateMode.Modified,
    );
  });
  set(({ state }) => {
    state.lastSyncedAt = date;
  });
};

const loadLastSyncedAt = async (set: ImmerSet<WorkOrderState>) => {
  const realm = await getRealm();
  const entry = realm.objectForPrimaryKey<{
    key: string;
    value: string;
  }>("Metadata", "lastSyncedAt");
  if (entry?.value) {
    set(({ state }) => {
      state.lastSyncedAt = entry.value;
    });
  }
};

const loadPendingQueue = async (set: ImmerSet<WorkOrderState>) => {
  const realm = await getRealm();
  const unsynced = realm
    .objects<WorkOrder>("WorkOrder")
    .filtered("synced == false && deleted == false");

  set(({ state }) => {
    state.pendingQueue = Array.from(unsynced);
  });
};

const useStore = create<WorkOrderState & WorkOrderActions>()(
  immer((set) => ({
    ...initialState,
    actions: {
      loadWorkOrders: () => loadWorkOrders(set),
      addWorkOrder: (order, syncLater) => addWorkOrder(set, order, syncLater),
      updateWorkOrder: (order, syncLater) =>
        updateWorkOrder(set, order, syncLater),
      clearSyncedFromQueue: (ids) => clearSyncedFromQueue(set, ids),
      setLastSyncedAt: (date) => setLastSyncedAt(set, date),
      loadLastSyncedAt: () => loadLastSyncedAt(set),
      loadPendingQueue: () => loadPendingQueue(set),
    },
  })),
);

export const { actions, state } = createSelectors(useStore).use;
