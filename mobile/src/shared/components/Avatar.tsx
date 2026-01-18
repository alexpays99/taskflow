import { API_CONFIG, Colors } from "@/shared/constants";
import React from "react";
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  style,
}) => {
  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const imageStyle: ImageStyle = {
    ...styles.container,
    ...sizeStyle,
    overflow: "hidden",
  };

  const viewStyle: ViewStyle[] = [styles.container, sizeStyle, style].filter(
    Boolean,
  ) as ViewStyle[];

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (uri) {
    const fullUri = uri.startsWith("/") ? `${API_CONFIG.baseUrl}${uri}` : uri;

    return (
      <Image source={{ uri: fullUri }} style={imageStyle} resizeMode="cover" />
    );
  }

  return (
    <View style={[...viewStyle, styles.placeholder]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {name ? getInitials(name) : "?"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  placeholder: {
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: Colors.neutral.white,
    fontWeight: "600",
  },
});

export default Avatar;
