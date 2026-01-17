import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, SPACING, BORDER_RADIUS } from '@/shared/constants';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<
  Priority,
  { color: string; backgroundColor: string; label: string }
> = {
  LOW: {
    color: Colors.semantic.success,
    backgroundColor: `${Colors.semantic.success}20`,
    label: 'tasks.priorityLow',
  },
  MEDIUM: {
    color: Colors.semantic.warning,
    backgroundColor: `${Colors.semantic.warning}20`,
    label: 'tasks.priorityMedium',
  },
  HIGH: {
    color: Colors.semantic.error,
    backgroundColor: `${Colors.semantic.error}20`,
    label: 'tasks.priorityHigh',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const { t } = useTranslation();
  const config = priorityConfig[priority];

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.color }]}>
        {t(config.label)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PriorityBadge;
