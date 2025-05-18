import Ionicons from "@expo/vector-icons/Ionicons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WorkOrderModal } from "../components/WorkOrderModal/WorkOrderModal";
import { useSync, useThemeColors } from "../hooks";
import { actions, state } from "../store/useStore";

type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  completed: boolean;
  deleted: boolean;
};

const Home = () => {
  const { colors, isDarkMode } = useThemeColors();
  const { sync } = useSync();
  const { workOrders, lastSyncedAt, pendingQueue } = state();
  const { loadWorkOrders, loadLastSyncedAt, loadPendingQueue } = actions();
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    loadWorkOrders();
    loadLastSyncedAt();
    loadPendingQueue();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected;
      setIsConnected(connected);

      if (connected && !isSyncing) {
        setIsSyncing(true);
        sync(lastSyncedAt ?? "2024-01-01T00:00:00Z")
          .catch(() => {
            Alert.alert(
              "Falha na sincronização",
              "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.",
              [{ text: "OK" }],
            );
          })
          .finally(() => {
            setIsSyncing(false);
          });
      }
    });

    return () => unsubscribe();
  }, [lastSyncedAt, isSyncing]);

  const lastSyncText = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString()
    : "Nunca sincronizado";

  const isPending = (id: string) => pendingQueue.some((item) => item.id === id);

  const handleModalVisible = () => setModalVisible((prev) => !prev);

  const handleSync = async () => {
    if (isSyncing || !isConnected) return;
    setIsSyncing(true);
    try {
      await sync(lastSyncedAt ?? "2024-01-01T00:00:00Z");
    } catch (err: any) {
      Alert.alert(
        "Falha na sincronização",
        "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.",
        [{ text: "OK" }],
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const renderItem = ({ item }: { item: WorkOrder }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedOrder(item);
        setModalVisible(true);
      }}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          {isPending(item.id) && (
            <Ionicons name="time-outline" size={24} color="#FF9900" />
          )}
        </View>
        <Text style={{ color: colors.text }}>Status: {item.status}</Text>
        <Text style={{ color: colors.text }}>Técnico: {item.assignedTo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: colors.text }]}>
          Ordens de Serviço
        </Text>
        {isConnected !== null && (
          <Ionicons
            name={isConnected ? "wifi-outline" : "cloud-offline-outline"}
            size={24}
            color={isConnected ? "#28A745" : "#FF3B30"}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
      <View style={styles.syncRow}>
        <Ionicons
          name="cloud-done-outline"
          size={16}
          color={colors.icon}
          style={styles.marginRight}
        />
        <Text style={[styles.syncInfo, { color: colors.subText }]}>
          Ultima sincronização: {lastSyncText}
        </Text>
      </View>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.addButton }]}
          onPress={() => {
            setSelectedOrder(null);
            setModalVisible(true);
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={styles.marginRight}
          />
          <Text style={styles.addButtonText}>Nova Ordem</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={workOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={[
          styles.syncButton,
          (isSyncing || !isConnected) && { opacity: 0.6 },
        ]}
        onPress={handleSync}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.marginRight}
          />
        ) : (
          <Ionicons
            name="sync-outline"
            size={20}
            color="#fff"
            style={styles.marginRight}
            disabled={isSyncing || !isConnected}
          />
        )}
        <Text style={styles.syncButtonText}>
          {isSyncing ? "Sincronizando..." : "Sincronizar agora"}
        </Text>
      </TouchableOpacity>
      <WorkOrderModal
        visible={modalVisible}
        onClose={handleModalVisible}
        initialData={selectedOrder ?? undefined}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topActions: {
    alignItems: "flex-end",
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  syncInfo: {
    fontSize: 12,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  syncButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  marginRight: {
    marginRight: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
