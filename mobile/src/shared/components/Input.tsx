import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { Colors, SPACING, BORDER_RADIUS } from '@/shared/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = [
    styles.inputContainer,
    isFocused && styles.inputContainer_focused,
    error && styles.inputContainer_error,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={containerStyle}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.iconContainer}>
            {rightIcon}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.neutral.white,
  },
  inputContainer_focused: {
    borderColor: Colors.primary.main,
  },
  inputContainer_error: {
    borderColor: Colors.semantic.error,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: Colors.text.primary,
  },
  iconContainer: {
    paddingRight: SPACING.md,
  },
  error: {
    fontSize: 12,
    color: Colors.semantic.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
