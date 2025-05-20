import Realm from "realm";

export class WorkOrder extends Realm.Object<WorkOrder> {
  id!: string;
  title!: string;
  description!: string;
  status!: "Pending" | "In Progress" | "Completed";
  assignedTo!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
  completed!: boolean;
  deleted!: boolean;
  synced!: boolean;
  updatedLocally!: boolean;

  static schema: Realm.ObjectSchema = {
    name: "WorkOrder",
    primaryKey: "id",
    properties: {
      id: "string",
      title: "string",
      description: "string",
      status: "string",
      assignedTo: "string",
      createdAt: "string",
      updatedAt: "string",
      deletedAt: "string?",
      completed: "bool",
      deleted: "bool",
      synced: { type: "bool", default: false },
      updatedLocally: { type: "bool", default: false },
    },
  };
}