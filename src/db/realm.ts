import Realm from "realm";
import { MetadataSchema } from "./schemas/MetadataSchema";
import { WorkOrderSchema } from "./schemas/WorkOrderSchema";

export const getRealm = async () => {
  return await Realm.open({
    schema: [WorkOrderSchema, MetadataSchema],
    schemaVersion: 3,
  });
};
