import { useWorkOrderStore } from "../store/useWorkOrderStore";
import { WorkOrder } from "../models/WorkOrder";
import Realm from "realm";

export const synchronizeWorkOrders = async (realm: Realm) => {
  const { lastSync, setLastSync } = useWorkOrderStore.getState();
  const since = lastSync || new Date(0).toISOString();

  const unsynced = realm.objects<WorkOrder>("WorkOrder").filtered("synced == false");
  for (const order of unsynced) {
    const method = order.updatedLocally ? "PUT" : "POST";
    const url = method === "PUT"
      ? `https://fieldsync.onrender.com/work-orders/${order.id}`
      : `https://fieldsync.onrender.com/work-orders`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    realm.write(() => {
      order.synced = true;
      order.updatedLocally = false;
    });
  }

  const res = await fetch(`https://fieldsync.onrender.com/work-orders/sync?since=${since}`);
  const data = await res.json();

  realm.write(() => {
    data.created.forEach((item: WorkOrder) => {
      realm.create("WorkOrder", { ...item, synced: true, updatedLocally: false }, Realm.UpdateMode.Modified);
    });

    data.updated.forEach((item: WorkOrder) => {
      realm.create("WorkOrder", { ...item, synced: true, updatedLocally: false }, Realm.UpdateMode.Modified);
    });

    data.deleted.forEach((id: string) => {
      const obj = realm.objectForPrimaryKey("WorkOrder", id);
      if (obj) realm.delete(obj);
    });
  });

  setLastSync(new Date().toISOString());
};