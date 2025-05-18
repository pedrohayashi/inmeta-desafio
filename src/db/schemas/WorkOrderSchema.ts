export const WorkOrderSchema = {
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
    synced: { type: "bool", optional: false, default: true } as const,
  },
};
