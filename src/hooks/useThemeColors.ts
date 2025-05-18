import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return {
    isDarkMode,
    colors: {
      background: isDarkMode ? "#121212" : "#fff",
      card: isDarkMode ? "#1E1E1E" : "#f0f0f0",
      text: isDarkMode ? "#fff" : "#000",
      subText: isDarkMode ? "#bbb" : "#666",
      syncButton: "#007AFF",
      addButton: "#28A745",
      icon: isDarkMode ? "#ccc" : "#888",
    },
  };
};
