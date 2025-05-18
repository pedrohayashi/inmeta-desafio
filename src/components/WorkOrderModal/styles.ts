import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000060",
  },
  container: {
    margin: 20,
    borderRadius: 8,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  inputPickerAndroid: {
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 4,
  },
  pickerItemAndroid: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  pickerWrapper: {
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    paddingBottom: 12,
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
