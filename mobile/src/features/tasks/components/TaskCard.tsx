import { Card } from '@/shared/components';
import { BORDER_RADIUS, Colors, SPACING } from '@/shared/constants';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onComplete,
}) => {
  const { t } = useTranslation();

  return (
    <Card style={styles.card} onPress={onPress} variant="elevated">
      <View style={styles.header}>
        <Pressable
          style={[styles.checkbox, task.isCompleted && styles.checkbox_checked]}
          onPress={onComplete}
        >
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, task.isCompleted && styles.title_completed]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <Text style={styles.dueDate}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: Colors.border.dark,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox_checked: {
    backgroundColor: Colors.semantic.success,
    borderColor: Colors.semantic.success,
  },
  checkmark: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: SPACING.xs,
  },
  title_completed: {
    textDecorationLine: 'line-through',
    color: Colors.text.secondary,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  dueDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

export default TaskCard;
