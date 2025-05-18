import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
