import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, SPACING, BORDER_RADIUS } from '@/shared/constants';

interface SettingsItemProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isDestructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  value,
  onPress,
  showArrow = true,
  isDestructive = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text
        style={[styles.label, isDestructive && styles.destructive]}
      >
        {label}
      </Text>
      <View style={styles.rightContent}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showArrow && onPress && <Text style={styles.arrow}>›</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  pressed: {
    backgroundColor: Colors.neutral.gray100,
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  destructive: {
    color: Colors.semantic.error,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: SPACING.sm,
  },
  arrow: {
    fontSize: 20,
    color: Colors.text.secondary,
  },
});

export default SettingsItem;
