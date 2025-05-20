import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { WorkOrder } from "../models/WorkOrder";
import Realm from "realm";
import { v4 as uuidv4 } from "uuid";
import { useLocalSearchParams, useRouter } from "expo-router";

export const EditWorkOrder = ({ realm }: { realm: Realm }) => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const isEdit = Boolean(id);
  const existingOrder = isEdit ? realm.objectForPrimaryKey<WorkOrder>("WorkOrder", id!) : null;

  const [title, setTitle] = useState(existingOrder?.title || "");
  const [description, setDescription] = useState(existingOrder?.description || "");
  const [assignedTo, setAssignedTo] = useState(existingOrder?.assignedTo || "");
  const [status, setStatus] = useState<WorkOrder["status"]>(existingOrder?.status || "Pending");

  const save = () => {
    const now = new Date().toISOString();

    realm.write(() => {
      realm.create(
        "WorkOrder",
        {
          id: existingOrder?.id || uuidv4(),
          title,
          description,
          status,
          assignedTo,
          createdAt: existingOrder?.createdAt || now,
          updatedAt: now,
          completed: status === "Completed",
          deleted: false,
          synced: false,
          updatedLocally: true,
        },
        Realm.UpdateMode.Modified
      );
    });

    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput value={title} onChangeText={setTitle} placeholder="Título" style={{ marginBottom: 8 }} />
      <TextInput value={description} onChangeText={setDescription} placeholder="Descrição" style={{ marginBottom: 8 }} />
      <TextInput value={assignedTo} onChangeText={setAssignedTo} placeholder="Técnico Responsável" style={{ marginBottom: 8 }} />
      <Button title="Salvar" onPress={save} />
    </View>
  );
};
