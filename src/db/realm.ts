import Realm from "realm";
import { MetadataSchema, WorkOrderSchema } from "./schemas";

export const getRealm = async () => {
  return await Realm.open({
    schema: [WorkOrderSchema, MetadataSchema],
    schemaVersion: 3,
  });
};
