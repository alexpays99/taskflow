import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, SPACING } from '@/shared/constants';
import { User } from '@/features/auth/types';
import { AvatarPicker } from './AvatarPicker';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      <AvatarPicker
        avatarUrl={user.avatarUrl}
        name={user.name || user.email}
        size={100}
      />
      <Text style={styles.name}>{user.name || 'User'}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: SPACING.md,
  },
  email: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: SPACING.xs,
  },
});

export default ProfileHeader;
