import api from "./api";
import type { WorkOrder } from "./types";

export const createWorkOrder = async (order: WorkOrder) => {
  await api.post("/work-orders", order);
};

export const updateWorkOrderApi = async (order: WorkOrder) => {
  await api.put(`/work-orders/${order.id}`, order);
};

export const syncWorkOrders = async (
  since: string,
): Promise<{
  created: WorkOrder[];
  updated: WorkOrder[];
  deleted: string[];
}> => {
  const { data } = await api.get("/work-orders/sync", {
    params: { since },
  });
  return data;
};
