import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useThemeColors } from "../../hooks/useThemeColors";
import { actions } from "../../store/useStore";
import { styles } from "./styles";

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

type Props = {
  visible: boolean;
  onClose: () => void;
  initialData?: WorkOrder;
};

const values = [
  { label: "Pendente", value: "Pending" },
  { label: "Em andamento", value: "In Progress" },
  { label: "Concluído", value: "Completed" },
];

export const WorkOrderModal = ({ visible, onClose, initialData }: Props) => {
  const { colors, isDarkMode } = useThemeColors();
  const { addWorkOrder, updateWorkOrder } = actions();
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<
    "Pending" | "In Progress" | "Completed"
  >("Pending");

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<
    Pick<WorkOrder, "title" | "description" | "assignedTo" | "status">
  >({
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      status: "Pending",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        assignedTo: initialData.assignedTo,
        status: initialData.status,
      });
      setTempStatus(initialData.status);
    } else {
      reset({
        title: "",
        description: "",
        assignedTo: "",
        status: "Pending",
      });
      setTempStatus("Pending");
    }
  }, [initialData, visible]);

  const handleSave = async (
    data: Pick<WorkOrder, "title" | "description" | "assignedTo" | "status">,
  ) => {
    const now = new Date().toISOString();
    const order = {
      ...data,
      id: initialData?.id ?? uuidv4(),
      completed: data.status === "Completed",
      deleted: false,
      createdAt: initialData?.createdAt ?? now,
      updatedAt: now,
    };

    if (initialData) {
      await updateWorkOrder(order);
    } else {
      await addWorkOrder(order);
    }
    reset();
    onClose();
  };

  const status = watch("status");

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <Text style={[styles.header, { color: colors.text }]}>
            {initialData ? "Editar Ordem" : "Nova Ordem"}
          </Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: "Título é obrigatório!" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Título"
                placeholderTextColor={colors.subText}
                value={value}
                onChangeText={onChange}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.subText },
                ]}
              />
            )}
          />
          {errors.title && (
            <Text style={{ color: "#FF3B30", marginBottom: 4 }}>
              {errors.title.message}
            </Text>
          )}
          <Controller
            control={control}
            name="description"
            rules={{ required: "Descrição é obrigatória!" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Descrição"
                placeholderTextColor={colors.subText}
                value={value}
                onChangeText={onChange}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.subText },
                ]}
              />
            )}
          />
          {errors.description && (
            <Text style={{ color: "#FF3B30", marginBottom: 4 }}>
              {errors.description.message}
            </Text>
          )}
          <Controller
            control={control}
            name="assignedTo"
            rules={{ required: "Técnico é obrigatório!" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Técnico responsável"
                placeholderTextColor={colors.subText}
                value={value}
                onChangeText={onChange}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.subText },
                ]}
              />
            )}
          />
          {errors.assignedTo && (
            <Text style={{ color: "#FF3B30", marginBottom: 4 }}>
              {errors.assignedTo.message}
            </Text>
          )}
          {Platform.OS === "android" ? (
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View
                  style={[
                    styles.inputPickerAndroid,
                    {
                      backgroundColor: isDarkMode ? "#1e1e1e" : undefined,
                      borderColor: colors.subText,
                    },
                  ]}
                >
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    style={{ color: colors.text }}
                  >
                    {values.map((item) => (
                      <Picker.Item
                        style={styles.pickerItemAndroid}
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setTempStatus(status);
                  setStatusPickerVisible(true);
                }}
                style={[
                  styles.input,
                  {
                    justifyContent: "center",
                    backgroundColor: isDarkMode ? "#1e1e1e" : undefined,
                    borderColor: colors.subText,
                  },
                ]}
              >
                <Text style={{ color: status ? colors.text : colors.subText }}>
                  {values.find((s) => s.value === status)?.label ||
                    "Selecionar status"}
                </Text>
              </TouchableOpacity>
              <Modal
                visible={statusPickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setStatusPickerVisible(false)}
              >
                <View style={styles.overlay}>
                  <View
                    style={[
                      styles.pickerWrapper,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Picker
                      selectedValue={tempStatus}
                      onValueChange={(itemValue) => setTempStatus(itemValue)}
                      style={{ color: colors.text }}
                    >
                      {values.map((item) => (
                        <Picker.Item
                          key={item.value}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Picker>
                    <View style={styles.pickerActions}>
                      <TouchableOpacity
                        onPress={() => setStatusPickerVisible(false)}
                      >
                        <Text style={{ color: colors.subText }}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setValue("status", tempStatus);
                          setStatusPickerVisible(false);
                        }}
                      >
                        <Text
                          style={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Confirmar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.subText }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(handleSave)}>
              <Text style={{ fontWeight: "bold", color: colors.text }}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
