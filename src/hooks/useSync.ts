import NetInfo from "@react-native-community/netinfo";
import { UpdateMode } from "realm";
import { getRealm } from "../db/realm";
import {
  createWorkOrder,
  syncWorkOrders,
  updateWorkOrderApi,
} from "../services/workOrdersService";
import { actions, state } from "../store/useStore";

export const useSync = () => {
  const { clearSyncedFromQueue, loadWorkOrders } = actions();
  const { pendingQueue } = state();

  const sync = async (lastSyncedAt: string) => {
    const isConnected = await NetInfo.fetch().then((s) => s.isConnected);
    if (!isConnected) return;

    try {
      const realm = await getRealm();
      const syncedIds: string[] = [];
      for (const item of pendingQueue) {
        try {
          if (item.createdAt === item.updatedAt) {
            await createWorkOrder(item);
          } else {
            await updateWorkOrderApi(item);
          }
          syncedIds.push(item.id);
        } catch (err: any) {
          console.warn("Falha ao sincronizar item:", item.id, err?.message);
        }
      }

      clearSyncedFromQueue(syncedIds);
      const result = await syncWorkOrders(lastSyncedAt);
      realm.write(() => {
        result.created.forEach((item) => {
          realm.create("WorkOrder", item, UpdateMode.Modified);
        });
        result.updated.forEach((item) => {
          realm.create("WorkOrder", item, UpdateMode.Modified);
        });
        result.deleted.forEach((id: string) => {
          const item = realm.objectForPrimaryKey("WorkOrder", id);
          if (item) {
            item.deleted = true;
            item.deletedAt = new Date().toISOString();
          }
        });
      });

      await loadWorkOrders();
    } catch (err: any) {
      console.log("Erro na sincronização:", err?.message);
    }
  };

  return { sync };
};
