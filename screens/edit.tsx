import React from "react";
import { EditWorkOrder } from "../components/EditWorkOrder";
import Realm from "realm";

export default function EditScreen({ realm }: { realm: Realm }) {
  return <EditWorkOrder realm={realm} />;
}
