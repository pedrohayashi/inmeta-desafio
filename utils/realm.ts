// src/utils/realm.ts
import Realm from "realm";
import { WorkOrder } from "../models/WorkOrder";

let realmInstance: Realm | null = null;

export async function getRealmInstance(): Promise<Realm> {
  if (realmInstance && !realmInstance.isClosed) {
    return realmInstance;
  }
  realmInstance = await Realm.open({
    schema: [WorkOrder],
    schemaVersion: 1,
  });
  return realmInstance;
}
