import React from "react";
import { WorkOrderList } from "../components/WorkOrderList";
import Realm from "realm";

export default function IndexScreen({ realm }: { realm: Realm }) {
  return <WorkOrderList realm={realm} />;
}