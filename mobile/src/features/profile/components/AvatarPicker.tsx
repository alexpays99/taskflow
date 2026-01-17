import React from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Avatar } from '@/shared/components';
import { useAvatarPicker } from '../hooks/useAvatarPicker';
import { Colors, SPACING, BORDER_RADIUS } from '@/shared/constants';

interface AvatarPickerProps {
  avatarUrl?: string | null;
  name?: string;
  size?: number;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  avatarUrl,
  name,
  size = 100,
}) => {
  const { showPicker, isLoading } = useAvatarPicker();

  return (
    <Pressable onPress={showPicker} style={styles.container}>
      <Avatar uri={avatarUrl} name={name} size={size} />
      {isLoading && (
        <View style={[styles.overlay, { width: size, height: size, borderRadius: size / 2 }]}>
          <ActivityIndicator color={Colors.neutral.white} />
        </View>
      )}
      <View style={styles.editBadge}>
        <Text style={styles.editIcon}>✎</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.main,
    borderRadius: BORDER_RADIUS.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  editIcon: {
    color: Colors.neutral.white,
    fontSize: 14,
  },
});

export default AvatarPicker;
