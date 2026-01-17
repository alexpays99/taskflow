import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Colors, SPACING } from '@/shared/constants';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onTaskPress: (task: Task) => void;
  onTaskComplete: (task: Task) => void;
  onEndReached?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isRefetching,
  onRefresh,
  onTaskPress,
  onTaskComplete,
  onEndReached,
}) => {
  const { t } = useTranslation();

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>{t('tasks.noTasks')}</Text>
        <Text style={styles.emptyDescription}>
          {t('tasks.noTasksDescription')}
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard
          task={item}
          onPress={() => onTaskPress(item)}
          onComplete={() => onTaskComplete(item)}
        />
      )}
      estimatedItemSize={120}
      contentContainerStyle={styles.listContent}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
});

export default TaskList;
