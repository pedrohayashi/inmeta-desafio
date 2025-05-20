import React from "react";
import { FlatList, Text, TouchableOpacity, View, Button } from "react-native";
import Realm from "realm";
import { WorkOrder } from "../models/WorkOrder";
import { useRouter } from "expo-router";

export const WorkOrderList = ({ realm }: { realm: Realm }) => {
  const router = useRouter();
  const workOrders = realm.objects<WorkOrder>("WorkOrder").sorted("createdAt", true);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={workOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}>
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Nova Ordem de Serviço" onPress={() => router.push("/edit")} />
    </View>
  );
};