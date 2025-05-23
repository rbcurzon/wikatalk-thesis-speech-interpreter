import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import DotsLoader from "@/components/DotLoader";
import useThemeStore from "@/store/useThemeStore";

const SpeechLoading: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const colors: string[] = ["#FCD116", "#4785ff", "#ce1126", "#FCD116"];

  // Get screen dimensions to ensure full coverage
  const { height, width } = Dimensions.get("window");

  return (
    <View
      style={[
        styles.overlay,
        { width, height }, // Ensure full screen coverage
      ]}
      // This ensures touch events are captured by this view
      pointerEvents="auto"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: activeTheme.backgroundColor },
        ]}
      >
        <Animated.Text style={[styles.loadingText]}>
          Translating...
        </Animated.Text>

        <DotsLoader colors={colors} />
      </View>
    </View>
  );
};

export default SpeechLoading;

// Styles
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#0a0f28",
    width: "75%",
    maxWidth: 350,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 10000, // Even higher z-index
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  loadingText: {
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
});
